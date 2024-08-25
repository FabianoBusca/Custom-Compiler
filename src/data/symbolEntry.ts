import {SymbolTable} from "./symbolTable";

export interface VariableEntry {
    type: string;
}

export interface FunctionEntry {
    returnTypes: string[];
    parameters: { type: string, name: string }[];
    scope: SymbolTable;
}

export interface ClassEntry {
    scope: SymbolTable;
}