import {
    ArrayNode,
    Expression,
    FString, FunctionCall, FunctionDeclaration, Identifier,
    Program, Statement,
    SymbolTable,
    VariableAssignment,
    VariableDeclaration,
    VariableOperations
} from "../data";
import { DayError } from "../utils/error";
import assert from "assert";

const EMPTY = '$_empty_$';

export class TypeChecker {
    constructor(
        private readonly ast: Program,
        private symbolTable: SymbolTable
    ) {}

    check() {
        this.visitProgram(this.ast);
    }

    private compareTypes(type1: string, type2: string): boolean {
        if (type1 === type2) return true;
        return type1 === EMPTY || type2 === EMPTY;

    }

    private throwError(message: string): never {
        throw DayError.semanticError(message);
    }

    private visitProgram(program: Program) {
        program.body.forEach(statement => this.visitNode(statement));
    }

    private visitNode(node: Statement) {
        switch (node.kind) {
            case 'VariableOperations':
                this.visitVariableOperations(node as VariableOperations);
                break;
            case 'FunctionDeclaration':
                this.visitFunctionDeclaration(node as FunctionDeclaration);
                break;
            // case 'FunctionCall':
            //     break;
            default:
                this.throwError(`Unknown statement type: ${node.kind}`);
        }
    }

    private visitVariableOperations(node: VariableOperations) {
        if (node.values.length === 0) return;

        const valuesTypes = node.values.flatMap(value => this.visitExpression(value));

        if (valuesTypes.length === 1) {
            node.operations.forEach(operation => {
                const operationType = operation.kind === 'VariableDeclaration'
                    ? this.visitIdentifier((operation as VariableDeclaration).identifier)
                    : this.visitSimpleExpression((operation as VariableAssignment).element);

                if (!this.compareTypes(valuesTypes[0], operationType)) {
                    this.throwError(`Type mismatch: cannot assign a value of type '${valuesTypes[0]}' to a variable of type '${operationType}'.`);
                }
            });
            return;
        }

        if (valuesTypes.length !== node.operations.length) this.throwError('Number of expressions and variables do not match.');

        node.operations.forEach((operation, index) => {
            const operationType = operation.kind === 'VariableDeclaration'
                ? this.visitIdentifier((operation as VariableDeclaration).identifier)
                : this.visitSimpleExpression((operation as VariableAssignment).element);

            if (!this.compareTypes(valuesTypes[index], operationType)) {
                this.throwError(`Type mismatch: cannot assign a value of type '${valuesTypes[index]}' to a variable of type '${operationType}'.`);
            }
        });
    }

    private visitFunctionDeclaration(node: FunctionDeclaration) {
        this.symbolTable = this.symbolTable.functionLookup(node.identifier.name)?.scope || null;
        if (!this.symbolTable) this.throwError(`Function '${node.identifier.name}' is not declared.`);
        node.body.forEach(statement => this.visitNode(statement));
        this.symbolTable = this.symbolTable.getParentScope();
        assert(this.symbolTable); // should never be null
    }

    private visitExpression(node: Expression): string[] {
        if (node.kind === 'FunctionCall') {
            return this.visitFunctionCall(node as FunctionCall)
        }
        return [this.visitSimpleExpression(node)];
    }

    private visitFunctionCall(node: FunctionCall): string[] {

        const functionDeclaration = this.symbolTable.functionLookup(node.identifier.name);
        if (!functionDeclaration) {
            this.throwError(`Function '${node.identifier.name}' is not declared.`);
        }

        const argumentsType = node.arguments.flatMap(value => this.visitExpression(value));
        if (argumentsType.length !== functionDeclaration.parameters.length) this.throwError('Number of argument does not match the declaration.');

        node.arguments.forEach((argument, index) => {
            if (!this.compareTypes(argumentsType[index], functionDeclaration.parameters[index].type)) {
                this.throwError(`Type mismatch: cannot assign a value of type '${argumentsType[index]}' to a parameter of type '${functionDeclaration.parameters[index].type}'.`);
            }
        });

        return functionDeclaration.returnTypes;
    }

    private visitSimpleExpression(node: Expression): string {
        switch (node.kind) {
            case 'Number':
                return 'num';
            case 'String':
                return 'str';
            case 'Boolean':
                return 'bool';
            case 'F-String':
                return this.visitFString(node as FString);
            case 'Array':
                return this.visitArray(node as ArrayNode);
            case 'Identifier':
                return this.visitIdentifier(node as Identifier);
            default:
                return this.throwError(`Unknown expression type: ${node.kind}`);
        }
    }
    
    private visitFString(node: FString) {
        node.value.forEach(exp => {const type = this.visitSimpleExpression(exp); if (type !== 'str' && type !== 'num' && type != 'bool' && type !== EMPTY) this.throwError('F-String expressions must be of common type.')});
        return 'str';
    }

    private visitArray(node: ArrayNode) {
        const arrayTypes = node.elements.map(element => this.visitSimpleExpression(element));
        if (arrayTypes.length === 0) return EMPTY;
        let type = arrayTypes[0];
        if (arrayTypes.every(t => {if (type === EMPTY) {type = t; return true; } return t === EMPTY || t === type})) {
            return type + '[]';
        }
        return this.throwError('Array elements must be of the same type.');
    }

    private visitIdentifier(node: Identifier): string {
        const variableType = this.symbolTable.variableLookup(node.name)?.type;
        if (!variableType) {
            this.throwError(`Variable '${node.name}' is not declared.`);
        }
        return variableType;
    }
}
