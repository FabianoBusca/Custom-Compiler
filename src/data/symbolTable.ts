import {ClassEntry, FunctionEntry, VariableEntry} from "./symbolEntry";
import {Type} from "./ast";

const BUILT_IN_TYPES = ["num", "str", "bool", "_"];

export class SymbolTable {
  private readonly variableTable: Map<string, VariableEntry>;
  private readonly functionTable: Map<string, FunctionEntry>;
  private readonly classTable: Map<string, ClassEntry>;
  
  constructor(private readonly parent: SymbolTable | null = null) {
    this.variableTable = new Map<string, VariableEntry>();
    this.functionTable = new Map<string, FunctionEntry>();
    this.classTable = new Map<string, ClassEntry>();
  }
  
  public addVariable(name: string, type: Type): boolean {
    if (this.variableTable.has(name)) return false;
    if (!BUILT_IN_TYPES.includes(type.name) && !this.classLookup(type.name)) return false;
    this.variableTable.set(name, {type});
    return true;
  }
  
  public addFunction(name: string, returnTypes: Type[], parameters: {
    type: Type,
    name: string
  }[] = [], scope: SymbolTable): boolean {
    if (this.functionTable.has(name)) return false;
    if (returnTypes.some(type => {
      return (!BUILT_IN_TYPES.includes(type.name) && !this.classLookup(type.name));
    })) return false;
    this.functionTable.set(name, {
      returnTypes,
      parameters,
      scope
    });
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
    } else if (this.parent !== null) {
      return this.parent.variableLookup(name);
    }
    return null;
  }
  
  public functionLookup(name: string): FunctionEntry | null {
    if (this.functionTable.has(name)) {
      return this.functionTable.get(name) || null;
    } else if (this.parent !== null) {
      return this.parent.functionLookup(name);
    }
    return null;
  }
  
  public classLookup(name: string): ClassEntry | null {
    if (this.classTable.has(name)) {
      return this.classTable.get(name) || null;
    } else if (this.parent !== null) {
      return this.parent.classLookup(name);
    }
    return null;
  }
  
  public createChildScope(): SymbolTable {
    return new SymbolTable(this);
  }
  
  public getParentScope(): SymbolTable | null {
    return this.parent;
  }
  
  public toString(indent: string = ''): string {
    let result = `${indent}Symbol Table:\n${indent}{\n`;
    
    // Classes section
    if (this.classTable.size > 0) {
      result += `${indent}  Classes:\n`;
      for (const [name, entry] of this.classTable) {
        result += `${indent}    ${name}:\n`;
        result += entry.scope.toString(indent + '    ');
      }
    }
    
    // Variables section
    if (this.variableTable.size > 0) {
      result += `${indent}  Variables:\n`;
      for (const [name, entry] of this.variableTable) {
        result += `${indent}    ${name}: ${entry.type}\n`;
      }
    }
    
    // Functions section
    if (this.functionTable.size > 0) {
      result += `${indent}  Functions:\n`;
      for (const [name, entry] of this.functionTable) {
        const paramTypes = entry.parameters.map(param => param.type).join(', ');
        const returnTypesStr = entry.returnTypes.length > 0 ? entry.returnTypes.join(', ') : '_';
        result += `${indent}    ${name}: (${paramTypes}) -> ${returnTypesStr}\n`;
        result += entry.scope.toString(indent + '    ');
      }
    }
    
    result += `${indent}}\n`;
    
    return result;
  }
}
