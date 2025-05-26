import {
    ASTNode,
    ClassDeclaration,
    ForStatement,
    FunctionCall,
    FunctionDeclaration,
    IfStatement,
    MemberFunctionCall,
    PrintStatement,
    Program,
    ReadStatement,
    ReturnStatement,
    SwitchStatement,
    SymbolTable,
    UnaryExpression,
    VariableOperations,
    WhileStatement
} from "@src/data";
import {DayErr} from "@src/utils";

// todo: check for usage of undefined variables, functions, classes
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
        node.body.forEach(statement => this.visitNode(statement));
    }

    private visitNode(node: ASTNode) {
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
        const declaration = node;
        const newScope = this.scope.createChildScope();
        const invalidTypes = declaration.returnTypes.filter(type => !this.scope.isValidType(type));
        if (invalidTypes.length > 0) {
            invalidTypes.forEach(type => {
                this.throwError(`Type '${type.name}' is not a valid type.`, type);
            });
        }
        if (!this.scope.addFunction(declaration.identifier.name, declaration.returnTypes, declaration.parameters.map(parameter => ({
            type: parameter.type,
            name: parameter.identifier.name
        })), newScope)) this.throwError(`Symbol '${declaration.identifier.name}' is already declared in the current scope.`, declaration.identifier);
        this.scope = newScope;
        declaration.parameters.forEach(parameter => {
            if (!this.scope.isValidType(parameter.type)) this.throwError(`Type '${parameter.type.name}' is not a valid type.`, parameter.type);
            if (!this.scope.addVariable(parameter.identifier.name, parameter.type)) this.throwError(`Symbol '${parameter.identifier.name}' is already declared in the current scope.`, parameter.identifier);
        });
        declaration.body.forEach(statement => this.visitNode(statement));
        const parent = this.scope.getParentScope();
        if (!parent) throw Error("Internal Error: Attempted to exit global scope.");
        this.scope = parent;
    }

    private visitClassDeclaration(node: ClassDeclaration) {
        const declaration = node;
        const newScope = this.scope.createChildScope();
        if (!this.scope.addClass(declaration.identifier.name, newScope)) this.throwError(`Symbol '${declaration.identifier.name}' is already declared in the current scope.`, declaration.identifier);
        this.scope = newScope;
        declaration.body.forEach(statement => this.visitNode(statement));
        const parent = this.scope.getParentScope();
        if (!parent) throw Error("Internal Error: Attempted to exit global scope.");
        this.scope = parent;
    }

    // todo create scope
    private visitIfStatement(node: IfStatement) {
        this.visitExpression(node.condition);

        node.body.forEach(statement => this.visitNode(statement));
        node.elseBody?.forEach(statement => this.visitNode(statement));
    }

    private visitWhileStatement(node: WhileStatement) {
        this.visitExpression(node.condition);

        node.body.forEach(statement => this.visitNode(statement));
    }

    private visitForStatement(node: ForStatement) {


        this.visitExpression(node.limit);

        node.body.forEach(statement => this.visitNode(statement));
    }

    private visitReturnStatement(node: ReturnStatement) {
        node.values.forEach(expr => this.visitExpression(expr));
    }

    private visitIOStatement(node: PrintStatement | ReadStatement) {
        node.arguments.forEach(expr => this.visitExpression(expr));
    }

    //  todo
    private visitExpression(node: ASTNode): void {

    }

    private visitUnaryExpression(node: UnaryExpression): void {
        this.visitExpression(node.base)
    }

    public getSymbolTable(): SymbolTable {
        return this.scope;
    }

    public getErrors(): DayErr[] {
        return this.errors;
    }
}