import {ClassEntry, FunctionEntry, Type, VariableEntry} from "@src/data";

const BUILT_IN_TYPES = ["num", "str", "bool", "_", "unknown"];

export class SymbolTable {
    private readonly variableTable = new Map<string, VariableEntry>();
    private readonly functionTable = new Map<string, FunctionEntry>();
    private readonly classTable = new Map<string, ClassEntry>();

    constructor(private readonly parent: SymbolTable | null = null) {
    }

    public addVariable(name: string, type: Type): boolean {
        if (this.variableTable.has(name)) return false;
        if (!this.isValidType(type)) return false;
        this.variableTable.set(name, {type});
        return true;
    }

    public addFunction(
        name: string,
        returnTypes: Type[],
        parameters: { type: Type; name: string }[] = [],
        scope: SymbolTable
    ): boolean {
        if (this.functionTable.has(name)) return false;
        if (returnTypes.some(type => !this.isValidType(type))) return false;
        this.functionTable.set(name, {returnTypes, parameters, scope});
        return true;
    }

    public addClass(name: string, scope: SymbolTable): boolean {
        if (this.classTable.has(name)) return false;
        this.classTable.set(name, {scope});
        return true;
    }

    public variableLookup(name: string): VariableEntry | null {
        if (this.variableTable.has(name)) {
            return this.variableTable.get(name) || null;
        } else if (this.parent) {
            return this.parent.variableLookup(name);
        }
        return null;
    }

    public variableUpdate(name: string, type: Type): boolean {
        if (this.variableTable.has(name)) {
            const entry = this.variableTable.get(name);
            if (entry && this.isValidType(type)) {
                entry.type = type;
                return true;
            }
        }
        return false;
    }

    public functionLookup(name: string): FunctionEntry | null {
        if (this.functionTable.has(name)) {
            return this.functionTable.get(name) || null;
        } else if (this.parent) {
            return this.parent.functionLookup(name);
        }
        return null;
    }

    public classLookup(name: string): ClassEntry | null {
        if (this.classTable.has(name)) {
            return this.classTable.get(name) || null;
        } else if (this.parent) {
            return this.parent.classLookup(name);
        }
        return null;
    }

    public hasVariable(name: string): boolean {
        return this.variableLookup(name) !== null;
    }

    public hasFunction(name: string): boolean {
        return this.functionLookup(name) !== null;
    }

    public hasClass(name: string): boolean {
        return this.classLookup(name) !== null;
    }

    public createChildScope(): SymbolTable {
        return new SymbolTable(this);
    }

    public getParentScope(): SymbolTable | null {
        return this.parent;
    }

    public isValidType(type: Type): boolean {
        return BUILT_IN_TYPES.includes(type.name) || !!this.classLookup(type.name);
    }

    public toString(indent: string = ""): string {
        let result = `${indent}Symbol Table:\n${indent}{\n`;

        // Classes
        if (this.classTable.size > 0) {
            result += `${indent}  Classes:\n`;
            for (const [name, entry] of this.classTable) {
                result += `${indent}    ${name}:\n`;
                result += entry.scope.toString(indent + "      ");
            }
        }

        // Variables
        if (this.variableTable.size > 0) {
            result += `${indent}  Variables:\n`;
            for (const [name, entry] of this.variableTable) {
                result += `${indent}    ${name}: ${entry.type.name + "[]".repeat(entry.type.depth)}\n`;
            }
        }

        // Functions
        if (this.functionTable.size > 0) {
            result += `${indent}  Functions:\n`;
            for (const [name, entry] of this.functionTable) {
                const paramStr = entry.parameters.map(p => `${p.name}: ${p.type.name + "[]".repeat(p.type.depth)}`).join(", ");
                const returnStr = entry.returnTypes.length > 0
                    ? entry.returnTypes.map(t => t.name + "[]".repeat(t.depth)).join(", ")
                    : "_";
                result += `${indent}    ${name}: (${paramStr}) -> ${returnStr}\n`;
                result += entry.scope.toString(indent + "      ");
            }
        }

        result += `${indent}}\n`;
        return result;
    }
}