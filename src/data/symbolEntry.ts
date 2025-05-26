import {SymbolTable, Type} from "@src/data";

export interface VariableEntry {
    type: Type;
}

export interface FunctionEntry {
    returnTypes: Type[];
    parameters: { type: Type, name: string }[];
    scope: SymbolTable;
}

export interface ClassEntry {
    scope: SymbolTable;
}