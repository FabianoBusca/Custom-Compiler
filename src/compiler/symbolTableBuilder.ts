import {
    ArrayElement,
    ArrayNode,
    ASTNode,
    BinaryExpression,
    ClassDeclaration,
    Expression,
    ForStatement,
    FString,
    FunctionCall,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    LogicalExpression,
    MemberAttribute,
    MemberFunctionCall,
    PrintStatement,
    Program,
    ReadStatement,
    ReturnStatement,
    Statement,
    SwitchStatement,
    SymbolTable,
    UnaryExpression,
    VariableOperations,
    WhileStatement
} from "@src/data";
import {ASTFactory, DayErr, Location} from "@src/utils";

export class SymbolTableBuilder {
    private scope: SymbolTable = new SymbolTable();
    private readonly errors: DayErr[] = [];

    constructor(
        private readonly ast: Program,
        private readonly source: string,
    ) {
    }

    build(): boolean {
        try {
            this.visitProgram(this.ast);
        } catch (error) {
            if (error instanceof DayErr) {
                return false;
            } else
                throw error;
        }

        return true;
    }

    private throwError(message: string, node: ASTNode): never {
        const error = new DayErr(
            message,
            "Semantic Error",
            node.start.line,
            node.start.column,
            node.end.column,
            this.source.split("\n")[node.start.line - 1],
        );
        this.errors.push(error);
        // TODO shouldn't be thrown here
        throw error;
    }

    private visitProgram(node: Program) {
        node.body.forEach(statement => this.visitStatement(statement));
    }

    private visitStatement(node: Statement) {
        switch (node.kind) {
            case 'VariableOperations':
                return this.visitVariableOperations(node as VariableOperations);
            case 'FunctionDeclaration':
                return this.visitFunctionDeclaration(node as FunctionDeclaration);
            case 'ClassDeclaration':
                return this.visitClassDeclaration(node as ClassDeclaration);
            case 'IfStatement':
                return this.visitIfStatement(node as IfStatement);
            case 'WhileStatement':
                return this.visitWhileStatement(node as WhileStatement);
            case 'ForStatement':
                return this.visitForStatement(node as ForStatement);
            case 'SwitchStatement':
                return this.visitSwitchStatement(node as SwitchStatement);
            case 'ReturnStatement':
                return this.visitReturnStatement(node as ReturnStatement);
            case 'PrintStatement':
            case 'ReadStatement':
                return this.visitIOStatement(node as PrintStatement | ReadStatement);
            case 'FunctionCall':
                return this.visitFunctionCall(node as FunctionCall);
            case 'MemberFunctionCall':
                return this.visitMemberFunctionCall(node as MemberFunctionCall);
            case 'UnaryExpression':
                return this.visitUnaryExpression(node as UnaryExpression);
            default:
                this.throwError(`Unexpected statement type '${node.kind}'`, node);
        }
    }

    private visitVariableOperations(node: VariableOperations) {
        node.operations.forEach(operation => {
            if (operation.kind === 'VariableDeclaration') {
                const declaration = operation;
                if (!this.scope.isValidType(declaration.type)) this.throwError(`Type '${declaration.type.name}' is not a valid type.`, declaration.type);
                if (!this.scope.addVariable(declaration.identifier.name, declaration.type)) this.throwError(`Symbol '${declaration.identifier.name}' is already declared in the current scope.`, declaration.identifier);
            } else {
                this.visitExpression(operation.element);
            }
        });
        node.values.forEach(value => this.visitExpression(value));
    }

    private visitFunctionDeclaration(node: FunctionDeclaration) {
        const newScope = this.scope.createChildScope();
        const invalidTypes = node.returnTypes.filter(type => !this.scope.isValidType(type));
        if (invalidTypes.length > 0) {
            invalidTypes.forEach(type => {
                this.throwError(`Type '${type.name}' is not a valid type.`, type);
            });
        }
        if (!this.scope.addFunction(node.identifier.name, node.returnTypes, node.parameters.map(parameter => ({
            type: parameter.type,
            name: parameter.identifier.name
        })), newScope)) this.throwError(`Symbol '${node.identifier.name}' is already declared in the current scope.`, node.identifier);
        this.scope = newScope;
        node.parameters.forEach(parameter => {
            if (!this.scope.isValidType(parameter.type)) this.throwError(`Type '${parameter.type.name}' is not a valid type.`, parameter.type);
            if (!this.scope.addVariable(parameter.identifier.name, parameter.type)) this.throwError(`Symbol '${parameter.identifier.name}' is already declared in the current scope.`, parameter.identifier);
        });
        node.body.forEach(statement => this.visitStatement(statement));
        const parent = this.scope.getParentScope();
        if (!parent) throw Error("Internal Error: Attempted to exit global scope.");
        this.scope = parent;
    }

    private visitClassDeclaration(node: ClassDeclaration) {
        const declaration = node;
        const newScope = this.scope.createChildScope();
        if (!this.scope.addClass(declaration.identifier.name, newScope)) this.throwError(`Symbol '${declaration.identifier.name}' is already declared in the current scope.`, declaration.identifier);
        this.scope = newScope;
        declaration.body.forEach(statement => this.visitStatement(statement));
        const parent = this.scope.getParentScope();
        if (!parent) throw Error("Internal Error: Attempted to exit global scope.");
        this.scope = parent;
    }

    private visitIfStatement(node: IfStatement) {
        this.visitExpression(node.condition);

        node.body.forEach(statement => this.visitStatement(statement));
        node.elseBody?.forEach(statement => this.visitStatement(statement));
    }

    private visitWhileStatement(node: WhileStatement) {
        this.visitExpression(node.condition);

        node.body.forEach(statement => this.visitStatement(statement));
    }

    private visitForStatement(node: ForStatement) {
        if (!this.scope.variableLookup(node.iterator.name)) {
            this.scope.addVariable(node.iterator.name, ASTFactory.createType("unknown", 0, null as unknown as Location, null as unknown as Location));
        }
        this.visitExpression(node.limit);

        node.body.forEach(statement => this.visitStatement(statement));
    }

    private visitSwitchStatement(node: SwitchStatement) {
        this.visitExpression(node.expression);

        node.cases.forEach(caseStatement => {
            caseStatement.values.forEach(expr => this.visitExpression(expr));
            caseStatement.body.forEach(statement => this.visitStatement(statement));
        });

        node.default?.forEach(statement => this.visitStatement(statement));
    }

    private visitReturnStatement(node: ReturnStatement) {
        node.values.forEach(expr => this.visitExpression(expr));
    }

    private visitIOStatement(node: PrintStatement | ReadStatement) {
        node.arguments.forEach(expr => this.visitExpression(expr));
    }

    private visitFunctionCall(node: FunctionCall): void {
        if (!this.scope.functionLookup(node.identifier.name)) this.throwError(`Function '${node.identifier.name}' is not declared.`, node.identifier);

        node.arguments.forEach((arg) => this.visitExpression(arg));
    }

    private visitMemberFunctionCall(node: MemberFunctionCall): void {
        this.visitExpression(node.member)
        this.visitFunctionCall(node.function)
    }

    private visitExpression(node: Expression): void {
        switch (node.kind) {
            case "FunctionCall":
                return this.visitFunctionCall(node as FunctionCall);
            case "Identifier":
                return this.visitIdentifier(node as Identifier);
            case "MemberFunctionCall":
                return this.visitMemberFunctionCall(node as MemberFunctionCall);
            case "MemberAttribute":
                return this.visitMemberAttribute(node as MemberAttribute);
            case "UnaryExpression":
                return this.visitUnaryExpression(node as UnaryExpression);
            case "LogicalExpression":
            case "BinaryExpression":
                return this.visitBinaryExpression(node as LogicalExpression | BinaryExpression);
            case "Number":
            case "String":
            case "Boolean":
                break
            case "F-String":
                return this.visitFString(node as FString);
            case "Array":
                return this.visitArray(node as ArrayNode);
            case "ArrayElement":
                return this.visitArrayElement(node as ArrayElement);
            default:
                this.throwError(`Unexpected node type '${node.kind}' in expression.`, node);
        }
    }

    private visitIdentifier(node: Identifier) {
        if (!this.scope.variableLookup(node.name)) this.throwError(`Variable '${node.name}' is not declared.`, node);
    }

    private visitMemberAttribute(node: MemberAttribute): void {
        this.visitExpression(node.member)
    }

    private visitUnaryExpression(node: UnaryExpression): void {
        this.visitExpression(node.base)
    }

    private visitBinaryExpression(node: LogicalExpression | BinaryExpression): void {
        this.visitExpression(node.left);
        this.visitExpression(node.right);
    }

    private visitFString(node: FString): void {
        node.expressions.forEach(expr => this.visitExpression(expr));
    }

    private visitArray(node: ArrayNode): void {
        node.elements.forEach(expr => this.visitExpression(expr));
    }

    private visitArrayElement(node: ArrayElement): void {
        this.visitExpression(node.array);
        node.indexes.forEach(idx => this.visitExpression(idx));
    }

    public getSymbolTable(): SymbolTable {
        return this.scope;
    }

    public getErrors(): DayErr[] {
        return this.errors;
    }
}