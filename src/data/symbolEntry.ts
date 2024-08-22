import {SymbolTable} from "./symbolTable";

export interface VariableEntry {
    type: string;
    scopeLevel: number;
}

export interface FunctionEntry {
    returnTypes: string[];
    scopeLevel: number;
    parameters: { type: string, name: string }[];
    scope: SymbolTable;
}

export interface ClassEntry {
    scope: SymbolTable;
}