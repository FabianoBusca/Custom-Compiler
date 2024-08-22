import {
    ArrayNode,
    Expression,
    FString, Identifier,
    Program, Statement,
    SymbolTable,
    VariableAssignment,
    VariableDeclaration,
    VariableOperations
} from "../data";
import { DayError } from "../utils/error";

const EMPTY = '$_empty_$';

export class TypeChecker {
    constructor(
        private readonly ast: Program,
        private readonly symbolTable: SymbolTable
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
            // case 'FunctionCall':
            //     break;
            default:
                this.throwError(`Unsupported node kind: ${node.kind}`);
        }
    }

    private visitVariableOperations(node: VariableOperations) {
        if (node.values.length === 0) return;

        if (node.values.length === 1) {
            const exprType = this.visitExpression(node.values[0]);

            node.operations.forEach(operation => {
                const operationType = operation.kind === 'VariableDeclaration'
                    ? this.visitIdentifier((operation as VariableDeclaration).identifier)
                    : this.visitExpression((operation as VariableAssignment).element);

                if (!this.compareTypes(exprType, operationType)) {
                    this.throwError(`Type mismatch: cannot assign a value of type '${exprType}' to a variable of type '${operationType}'.`);
                }
            });
            return;
        }

        const exprsType = []
        node.values.forEach(expr => exprsType.push(this.visitExpression(expr)));

        if (exprsType.length !== node.operations.length) this.throwError('Number of expressions and variables do not match.');

        node.operations.forEach((operation, index) => {
            const operationType = operation.kind === 'VariableDeclaration'
                ? this.visitIdentifier((operation as VariableDeclaration).identifier)
                : this.visitExpression((operation as VariableAssignment).element);

            if (!this.compareTypes(exprsType[index], operationType)) {
                this.throwError(`Type mismatch: cannot assign a value of type '${exprsType[index]}' to a variable of type '${operationType}'.`);
            }
        });
    }

    private visitExpression(node: Expression): string {
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
        node.value.forEach(exp => {const type = this.visitExpression(exp); if (type !== 'str' && type !== 'num' && type != 'bool' && type !== EMPTY) this.throwError('F-String expressions must be of common type.')});
        return 'str';
    }

    private visitArray(node: ArrayNode) {
        const arrayTypes = node.elements.map(element => this.visitExpression(element));
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
