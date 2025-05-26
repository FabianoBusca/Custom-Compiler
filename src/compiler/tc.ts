import {DayErr} from "@src/utils";
import {
    ArrayElement,
    ASTNode,
    ClassDeclaration,
    Expression,
    FunctionCall,
    FunctionDeclaration,
    Identifier,
    MemberFunctionCall,
    Program,
    ReadStatement,
    Statement,
    SymbolTable,
    Type,
    VariableOperations
} from "@src/data";

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

    private compareTypes(actual: Type, expected: Type): boolean {
        return actual === expected;
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
        // Only declarations, everything is fine
        if (node.values.length === 0) return;

        // Flat the return types
        const returnTypes: Type[] = node.values.map(value => this.visitExpression(value)).flat();

    }

    private visitExpression(node: Expression): Type[] {
        switch (node.kind) {
            case 'FunctionCall':
                return this.visitFunctionCall(node as FunctionCall);
            case 'MemberFunctionCall':
                return this.visitMemberFunctionCall(node as MemberFunctionCall);
            case 'ArrayElement':
                return this.visitArrayElement(node as ArrayElement);
            default:
                return [this.visitSimpleExpression(node)];
        }
    }

    private visitFunctionCall(node: FunctionCall, st = this.symbolTable): Type[] {
        const functionDeclaration = st.functionLookup(node.identifier.name);
        if (!functionDeclaration) {
            this.throwError(`Function '${node.identifier.name}' is not declared.`, node.identifier);
        }

        this.checkFunctionCallArguments(node, functionDeclaration);

        return functionDeclaration.returnTypes;
    }

    private checkFunctionCallArguments(node: FunctionCall, functionDeclaration: { parameters: { type: Type }[] }) {
        const argumentsType = node.arguments.map(value => this.visitExpression(value)).flat();
        if (argumentsType.length !== functionDeclaration.parameters.length) {
            this.throwError('Number of arguments does not match the declaration.', node);
        }

        node.arguments.forEach((argument, index) => {
            if (!this.compareTypes(argumentsType[index], functionDeclaration.parameters[index].type)) {
                this.throwError(`Type mismatch: cannot assign a value of type '${argumentsType[index]}' to a parameter of type '${functionDeclaration.parameters[index].type}'.`, argument);
            }
        });
    }

    private visitMemberFunctionCall(node: MemberFunctionCall): Type[] {
        if (node.member.kind === 'Identifier' && (node.member as Identifier).name === 'this') {
            return this.visitFunctionCall(node.function);
        }

        const types = this.visitExpression(node.member);
        if (types.length !== 1) {
            this.throwError(
                `Member function call expects a single type, but got ${types.length} types.`,
                node.member
            );
        }

        const type = types[0];
        const classEntry = this.symbolTable.classLookup(type.name);
        if (!classEntry) {
            this.throwError(
                `Function '${node.function.identifier.name}' is not declared for type '${type.name}'.`,
                node.function.identifier
            );
        }

        return this.visitFunctionCall(node.function, classEntry.scope);
    }

    private visitArrayElement(node: ArrayElement): Type[] {
        const types = this.visitExpression(node.array);
        if (types.length !== 1) {
            this.throwError(
                `Array element access expects a single type, but got ${types.length} types.`,
                node.array
            )
        }

        const type = types[0];
        type.depth -= node.indexes.length
        if (type.depth < 0) {
            this.throwError(
                `Array element access exceeds array depth for type '${type.name}'.`,
                node
            );
        }

        return [type]
    }
}