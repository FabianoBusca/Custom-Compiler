import {
    Expression,
    FString,
    Identifier,
    Program,
    VariableAssignment,
    VariableDeclaration,
    VariableOperations
} from "./Ast";
import { SymbolTable } from "./SymbolTable";
import { DayError } from "./Error";

export class TypeChecker {
    constructor(
        private readonly ast: Program,
        private readonly symbolTable: SymbolTable
    ) {}

    check() {
        this.visitProgram(this.ast);
    }

    private throwError(message: string): never {
        throw DayError.semanticError(message);
    }

    private visitProgram(program: Program) {
        program.body.forEach(statement => this.visitNode(statement));
    }

    private visitNode(node: VariableOperations | VariableAssignment | VariableDeclaration | Expression) {
        switch (node.kind) {
            case 'VariableOperations':
                this.visitVariableOperations(node as VariableOperations);
                break;
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

                if (operationType !== exprType) {
                    this.throwError(`Type mismatch: cannot assign a value of type '${exprType}' to a variable of type '${operationType}'.`);
                }
            });
            return;
        }

        const exprsType = node.values.map(value => this.visitExpression(value));
        node.operations.forEach((operation, index) => {
            const operationType = operation.kind === 'VariableDeclaration'
                ? this.visitIdentifier((operation as VariableDeclaration).identifier)
                : this.visitExpression((operation as VariableAssignment).element);

            if (operationType !== exprsType[index]) {
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
            case 'Identifier':
                return this.visitIdentifier(node as Identifier);
            default:
                return this.throwError(`Unknown expression type: ${node.kind}`);
        }
    }

    private visitIdentifier(node: Identifier): string {
        const variableType = this.symbolTable.variableLookup(node.name)?.type;
        if (!variableType) {
            this.throwError(`Variable '${node.name}' is not declared.`);
        }
        return variableType;
    }

    private visitFString(node: FString) {
        node.value.forEach(exp => {const type = this.visitExpression(exp); if (type !== 'str' && type !== 'num' && type != 'bool') this.throwError('F-String expressions must be of common type.')});
        return 'str';
    }
}
