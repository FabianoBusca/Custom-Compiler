import {ASTNode, ClassDeclaration, FunctionDeclaration, Program, SymbolTable, VariableOperations} from "../data";
import {DayError} from "../utils";

export class SymbolTableBuilder {
    private scope: SymbolTable;

    constructor(private readonly ast: Program) {
        this.scope = new SymbolTable();
    }

    build(): SymbolTable {
        this.visitProgram(this.ast);
        return this.scope;
    }

    private error(message: string): never {
        throw DayError.semanticError(message);
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
        }
    }

    private visitVariableOperations(node: VariableOperations) {
        node.operations.forEach(operation => {
            if (operation.kind === 'VariableDeclaration') {
                const declaration = operation;
                if (!this.scope.addVariable(declaration.identifier.name, declaration.type)) this.error(`Symbol '${declaration.identifier.name}' is already declared in the current scope.`);
            }
        });
    }

    private visitFunctionDeclaration(node: FunctionDeclaration) {
        const declaration = node;
        const newScope = this.scope.createChildScope();
        if (!this.scope.addFunction(declaration.identifier.name, declaration.returnTypes, declaration.parameters.map(parameter => ({type: parameter.type, name: parameter.identifier.name})), newScope)) this.error(`Symbol '${declaration.identifier.name}' is already declared in the current scope.`);
        this.scope = newScope;
        declaration.parameters.forEach(parameter => {
            if (!this.scope.addVariable(parameter.identifier.name, parameter.type)) this.error(`Symbol '${parameter.identifier.name}' is already declared in the current scope.`);
        });
        declaration.body.forEach(statement => this.visitNode(statement));
        this.scope = this.scope.getParentScope();
    }

    private visitClassDeclaration(node: ClassDeclaration) {
        const declaration = node;
        const newScope = this.scope.createChildScope();
        if (!this.scope.addClass(declaration.identifier.name, newScope)) this.error(`Symbol '${declaration.identifier.name}' is already declared in the current scope.`);
        this.scope = newScope;
        declaration.body.forEach(statement => this.visitNode(statement));
        this.scope = this.scope.getParentScope();
    }
}