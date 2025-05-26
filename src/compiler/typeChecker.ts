import {
    ArrayElement,
    ArrayNode,
    ASTNode,
    ClassDeclaration,
    Expression,
    FString,
    FunctionCall,
    FunctionDeclaration,
    Identifier,
    MemberAttribute,
    MemberFunctionCall,
    Program,
    ReadStatement,
    ReturnStatement,
    Statement,
    SymbolTable,
    VariableAssignment,
    VariableDeclaration,
    VariableOperations
} from "@src/data";
import {DayErr} from "@src/utils";
import assert from "assert";

const EMPTY = '$_empty_$';
const ANY = '$_any_$';

type Type = string;

export class TypeChecker {
    private readonly errors: DayErr[] = [];

    constructor(
        private readonly ast: Program,
        private readonly symbolTable: SymbolTable,
        private readonly source: string,
    ) {
    }

    check() {
        this.visitProgram(this.ast);
    }

    /*compare types, the actual could be an array of type in case the possible return types are multiple, in this case it is only checked if the expected type is among the return types. ANY is the type of UNDERSCORE which should be always ignored. EMPTY represent an empty array and it can be assigned to any array type*/
    private compareTypes(actual: Type | Type[], expected: Type): boolean {
        if (actual === expected) return true;
        if (Array.isArray(actual)) return actual.includes(expected);
        if (actual.replace(/\[]/g, '') === EMPTY) return expected.endsWith('[]');
        return expected === ANY;
    }

    private throwError(message: string, node: ASTNode): never {
        const error = new DayErr(
            message,
            "Semantic Error",
            node.start.line,
            node.end.column,
            node.end.column + 1,
            this.source.split("\n")[node.start.line - 1],
        );
        this.errors.push(error);
        // TODO shouldn't be thrown here
        throw error;
    }

    private visitProgram(program: Program) {
        program.body.forEach(statement => this.visitStatement(statement));
    }

    private visitStatement(statement: Statement) {
        switch (statement.kind) {
            case 'VariableOperations':
                this.visitVariableOperations(statement as VariableOperations);
                break;
            case 'FunctionDeclaration':
                this.visitFunctionDeclaration(statement as FunctionDeclaration);
                break;
            case 'ClassDeclaration':
                this.visitClassDeclaration(statement as ClassDeclaration);
                break;
            case 'FunctionCall':
                this.visitFunctionCall(statement as FunctionCall);
                break;
            case 'ReadStatement':
                this.visitReadStatement(statement as ReadStatement);
                break;
            default:
                throw Error(`Unknown statement type: ${statement.kind}`);
        }
    }

    private visitVariableOperations(node: VariableOperations) {
        if (node.values.length === 0) return;

        const valuesTypes: (Type | Type[])[] = node.values.map(value => this.visitExpression(value)).flat();

        this.checkVariableOperationsTypes(node, valuesTypes);
    }

    private checkVariableOperationsTypes(node: VariableOperations, valuesTypes: (Type | Type[])[]) {
        if (valuesTypes.length === 1) {
            this.checkSingleValueAssignment(node, valuesTypes[0]);
        } else {
            this.checkMultiValueAssignment(node, valuesTypes);
        }
    }

    private checkSingleValueAssignment(node: VariableOperations, valueType: Type | Type[]) {
        node.operations.forEach(operation => {
            const operationType = this.getOperationType(operation);
            if (!this.compareTypes(valueType, operationType)) {
                this.throwError(`Type mismatch: cannot assign a value of type '${valueType}' to a variable of type '${operationType}'. ${(operation as VariableDeclaration).identifier.name});'`, (operation as VariableDeclaration).identifier);
            }
        });
    }

    private checkMultiValueAssignment(node: VariableOperations, valuesTypes: (Type | Type[])[]) {
        if (valuesTypes.length !== node.operations.length) {
            this.throwError('Number of expressions and variables do not match.');
        }

        node.operations.forEach((operation, index) => {
            const operationType = this.getOperationType(operation);
            if (!this.compareTypes(valuesTypes[index], operationType)) {
                this.throwError(`Type mismatch: cannot assign a value of type '${valuesTypes[index]}' to a variable of type '${operationType}'.`);
            }
        });
    }

    private getOperationType(operation: VariableDeclaration | VariableAssignment): Type {
        return operation.kind === 'VariableDeclaration'
            ? this.visitIdentifier((operation as VariableDeclaration).identifier)
            : this.visitSimpleExpression((operation as VariableAssignment).element);
    }

    private visitFunctionDeclaration(node: FunctionDeclaration) {
        this.withSymbolTableScope(node.identifier.name, 'function', () => {
            node.body.forEach(statement => {
                if (statement.kind === 'ReturnStatement') {
                    this.checkReturnStatement(statement as ReturnStatement, node.returnTypes);
                } else {
                    this.visitStatement(statement);
                }
            });
        });
    }

    private checkReturnStatement(statement: ReturnStatement, expectedTypes: Type[]) {
        statement.values.forEach((value, index) => {
            const actualType = this.visitSimpleExpression(value);
            if (!this.compareTypes(expectedTypes[index], actualType)) {
                this.throwError('Return type does not match the declaration.');
            }
        });
    }

    private visitClassDeclaration(node: ClassDeclaration) {
        this.withSymbolTableScope(node.identifier.name, 'class', () => {
            node.body.forEach(statement => this.visitStatement(statement));
        });
    }

    private withSymbolTableScope(name: string, type: 'function' | 'class', callback: () => void) {
        const lookup = type === 'function' ? this.symbolTable.functionLookup(name) : this.symbolTable.classLookup(name);
        this.symbolTable = lookup?.scope || null;
        if (!this.symbolTable) this.throwError(`${type} '${name}' is not declared.`);

        callback();

        this.symbolTable = this.symbolTable.getParentScope();
        assert(this.symbolTable); // should never be null
    }

    /*return the type of expression. The type is always in an array form to cover functions with multiple return types. In case of ArrayElement of function an array of Type array is returned to indicate the return type should be one of the possible.*/
    private visitExpression(node: Expression): Type[] | Type[][] {
        switch (node.kind) {
            case 'FunctionCall':
                return this.visitFunctionCall(node as FunctionCall);
            case 'MemberFunctionCall':
                return this.visitMemberFunctionCall(node as MemberFunctionCall);
            case 'ArrayElement':
                const result = this.visitArrayElement(node as ArrayElement);
                return Array.isArray(result) ? [result] : [result];
            default:
                return [this.visitSimpleExpression(node)];
        }
    }

    private visitFunctionCall(node: FunctionCall): Type[] {
        const functionDeclaration = this.symbolTable.functionLookup(node.identifier.name);
        if (!functionDeclaration) {
            this.throwError(`Function '${node.identifier.name}' is not declared.`);
        }

        this.checkFunctionCallArguments(node, functionDeclaration);

        return functionDeclaration.returnTypes;
    }

    private checkFunctionCallArguments(node: FunctionCall, functionDeclaration: { parameters: { type: Type }[] }) {
        const argumentsType = node.arguments.map(value => this.visitExpression(value)).flat();
        if (argumentsType.length !== functionDeclaration.parameters.length) {
            this.throwError('Number of arguments does not match the declaration.');
        }

        node.arguments.forEach((argument, index) => {
            if (!this.compareTypes(argumentsType[index], functionDeclaration.parameters[index].type)) {
                this.throwError(`Type mismatch: cannot assign a value of type '${argumentsType[index]}' to a parameter of type '${functionDeclaration.parameters[index].type}'.`);
            }
        });
    }

    private visitReadStatement(node: ReadStatement) {
        const exprType = this.visitSimpleExpression(node.arguments[0]); // can't be a complex expression
        node.arguments.forEach(argument => {
            this.visitExpression(argument)
        });
    }

    private visitSimpleExpression(node: Expression): Type {
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
            case 'MemberAttribute':
                return this.visitMemberAttribute(node as MemberAttribute);
            default:
                return this.throwError(`Unknown expression type: ${node.kind}`);
        }
    }

    private visitFString(node: FString): Type {
        node.value.forEach(exp => {
            const type = this.visitExpression(exp)[0];
            if (typeof type !== "string") this.throwError('Complex expression inside F-string')
            if (type !== 'str' && type !== 'num' && type !== 'bool' && type !== EMPTY) {
                this.throwError('F-String expressions must be of common type.');
            }
        });
        return 'str';
    }

    private visitArray(node: ArrayNode): Type {
        const arrayTypes = node.elements.map(element => this.visitSimpleExpression(element));
        if (arrayTypes.length === 0) return EMPTY;

        let type = arrayTypes[0];
        if (arrayTypes.every(t => {
            if (type === EMPTY) {
                type = t;
                return true;
            }
            return t === EMPTY || t === type;
        })) {
            return type + '[]';
        }
        return this.throwError('Array elements must be of the same type.');
    }

    private visitArrayElement(node: ArrayElement): Type | Type[] {
        if (node.array.kind === 'Identifier') {
            return this.visitArrayElementIdentifier(node);
        }
        return this.visitArrayElementFunctionCall(node);
    }

    private visitArrayElementIdentifier(node: ArrayElement): Type {
        const identifier = node.array as Identifier;
        let variableType = this.symbolTable.variableLookup(identifier.name)?.type;
        if (!variableType) {
            this.throwError(`Variable '${identifier.name}' is not declared.`);
        }
        for (let i = 0; i < node.indexes.length; i++) {
            if (!variableType.endsWith('[]')) {
                this.throwError(`Variable '${identifier.name}' is not an array.`);
            }
            variableType = variableType.slice(0, -2);
        }
        return variableType;
    }

    /*Allowing multiple return types make impossible to properly type check at compile time. Without being able to evaluate the index of the array it is only checked if the expected type is among the possible return types of the function*/
    private visitArrayElementFunctionCall(node: ArrayElement): Type[] {
        return this.symbolTable.functionLookup((node.array as FunctionCall).identifier.name)?.returnTypes || this.throwError(`Function '${(node.array as Identifier).name}' is not declared.`);
    }

    private visitIdentifier(node: Identifier): Type {
        if (node.name === '_') return ANY;
        const variableType = this.symbolTable.variableLookup(node.name)?.type;
        if (!variableType) {
            this.throwError(`Variable '${node.name}' is not declared.`);
        }
        return variableType;
    }

    private visitMemberAttribute(node: MemberAttribute): Type {
        if (node.member.name === 'this') return this.visitSimpleExpression(node.attribute);

        const memberType = this.symbolTable.variableLookup(node.member.name)?.type;
        if (!memberType) this.throwError(`Class '${node.member.name}' is not declared.`);

        return this.withClassScope(memberType, () => this.visitSimpleExpression(node.attribute));
    }

    private visitMemberFunctionCall(node: MemberFunctionCall): Type[] {
        if (node.member.name === 'this') return this.visitFunctionCall(node.function);

        const memberType = this.symbolTable.variableLookup(node.member.name)?.type;
        if (!memberType) this.throwError(`Class '${node.member.name}' is not declared.`);

        return this.withClassScope(memberType, () => this.visitFunctionCall(node.function));
    }

    private withClassScope<T>(classType: Type, callback: () => T): T {
        const originalScope = this.symbolTable;
        this.symbolTable = this.symbolTable.classLookup(classType.replace(/\[]/g, ''))?.scope || null;
        assert(this.symbolTable); // should never be null

        const result = callback();

        this.symbolTable = originalScope;
        return result;
    }
}