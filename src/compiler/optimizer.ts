import {
    ArrayElement,
    ArrayNode,
    BinaryExpression,
    BooleanNode,
    ClassDeclaration,
    createToken,
    Expression,
    ForStatement,
    FString,
    FunctionCall,
    FunctionDeclaration,
    IfStatement,
    LogicalExpression,
    MemberAttribute,
    MemberFunctionCall,
    NumberNode,
    PrintStatement,
    Program,
    ReadStatement,
    ReturnStatement,
    Statement,
    SwitchStatement,
    Tag,
    UnaryExpression,
    VariableOperations,
    WhileStatement
} from "@src/data";
import {ASTFactory} from "@src/utils";

export class Optimizer {
    private readonly optimizedAst: Program

    constructor(private readonly ast: Program) {
        this.optimizedAst = ASTFactory.cloneProgram(ast)
    }

    optimize(): void {
        this.visitProgram(this.optimizedAst);
    }

    private visitProgram(program: Program) {
        program.body = this.visitStatementBlock(program.body);
    }

    private visitStatementBlock(statements: Statement[]): Statement[] {
        const result: Statement[] = [];

        for (const stmt of statements) {
            const optimized = this.visitStatement(stmt);
            result.push(...optimized);

            if (optimized.some(s => s.kind === 'ReturnStatement')) {
                break;
            }
        }

        return result;
    }

    private visitStatement(node: Statement): Statement[] {
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
                throw new Error(`Unexpected statement type '${node.kind}'`);
        }
    }

    private visitVariableOperations(node: VariableOperations): VariableOperations[] {
        node.operations = node.operations.map(operation => {
            if (operation.kind === 'VariableAssignment') {
                operation.element = this.visitExpression(operation.element);
            }
            return operation;
        });

        node.values = node.values.map(value => this.visitExpression(value));
        return [node];
    }

    private visitFunctionDeclaration(node: FunctionDeclaration): FunctionDeclaration[] {
        node.body = this.visitStatementBlock(node.body);
        return [node];
    }

    private visitClassDeclaration(node: ClassDeclaration): ClassDeclaration[] {
        node.body = this.visitStatementBlock(node.body);
        return [node];
    }

    private visitIfStatement(node: IfStatement): Statement[] {
        node.condition = this.visitExpression(node.condition);

        if (node.condition.kind === 'Boolean') {
            const conditionValue = (node.condition as BooleanNode).value;
            return conditionValue
                ? this.visitStatementBlock(node.body)
                : this.visitStatementBlock(node.elseBody);
        }

        node.body = this.visitStatementBlock(node.body);
        node.elseBody = this.visitStatementBlock(node.elseBody);

        return [node];
    }

    private visitWhileStatement(node: WhileStatement): Statement[] {
        node.condition = this.visitExpression(node.condition);
        if (node.condition.kind === 'Boolean' && !(node.condition as BooleanNode).value) {
            return [];
        }
        node.body = this.visitStatementBlock(node.body);
        return [node];
    }

    private visitForStatement(node: ForStatement): Statement[] {
        node.limit = this.visitExpression(node.limit);

        if (node.limit.kind === 'Number') {
            const limitValue = (node.limit as NumberNode).value;
            if (limitValue <= 0) {
                return [];
            }
            if (limitValue === 1) {
                node.body = this.visitStatementBlock(node.body);
                return [node];
            }
        }

        node.body = this.visitStatementBlock(node.body);
        return [node];
    }

    private visitSwitchStatement(node: SwitchStatement): Statement[] {
        node.expression = this.visitExpression(node.expression);

        if (['Number', 'String', 'Boolean'].includes(node.expression.kind)) {
            const value = (node.expression as any).value;

            for (const caseStatement of node.cases) {
                for (const caseValue of caseStatement.values) {
                    const evaluatedValue = this.visitExpression(caseValue);
                    if (evaluatedValue.kind === node.expression.kind &&
                        (evaluatedValue as any).value === value) {
                        return this.visitStatementBlock(caseStatement.body)
                    }
                }
            }

            if (node.default.length > 0) {
                return this.visitStatementBlock(node.default);
            }

            return [];
        }

        for (const caseStatement of node.cases) {
            caseStatement.values = caseStatement.values.map(value => this.visitExpression(value));
            caseStatement.body = this.visitStatementBlock(caseStatement.body);
        }

        node.default = this.visitStatementBlock(node.default);
        return [node];
    }

    private visitReturnStatement(node: ReturnStatement): ReturnStatement[] {
        node.values = node.values.flatMap(value => this.visitExpression(value));
        return [node];
    }

    private visitIOStatement(node: PrintStatement | ReadStatement): (PrintStatement | ReadStatement)[] {
        node.arguments = node.arguments.flatMap(value => this.visitExpression(value));
        return [node];
    }

    private visitFunctionCall(node: FunctionCall): FunctionCall[] {
        node.arguments = node.arguments.flatMap(arg => this.visitExpression(arg));
        return [node];
    }

    private visitMemberFunctionCall(node: MemberFunctionCall): MemberFunctionCall[] {
        node.member = this.visitExpression(node.member);
        node.function = this.visitFunctionCall(node.function)[0];
        return [node];
    }

    private visitUnaryExpression(node: UnaryExpression): Expression[] {
        node.base = this.visitExpression(node.base);

        if (node.base.kind === 'Number' && node.operator === Tag.MINUS) {
            const value = -(node.base as NumberNode).value;
            return [ASTFactory.createNumberNode(
                createToken(Tag.NUMBER, `${value}`, node.start, node.end)
            )];
        }

        if (node.base.kind === 'Boolean' && node.operator === Tag.NOT) {
            const value = !(node.base as BooleanNode).value;
            return [ASTFactory.createBooleanNode(
                createToken(Tag.BOOL, `${value}`, node.start, node.end)
            )];
        }

        return [node];
    }

    private visitExpression(node: Expression): Expression {
        switch (node.kind) {
            case "FunctionCall":
                return this.visitFunctionCall(node as FunctionCall)[0];
            case "MemberFunctionCall":
                return this.visitMemberFunctionCall(node as MemberFunctionCall)[0];
            case "MemberAttribute":
                return this.visitMemberAttribute(node as MemberAttribute);
            case "UnaryExpression":
                return this.visitUnaryExpression(node as UnaryExpression)[0];
            case "LogicalExpression":
            case "BinaryExpression":
                return this.visitBinaryExpression(node as LogicalExpression | BinaryExpression);
            case "Identifier":
            case "Number":
            case "String":
            case "Boolean":
                return node;
            case "F-String":
                return this.visitFString(node as FString);
            case "Array":
                return this.visitArray(node as ArrayNode);
            case "ArrayElement":
                return this.visitArrayElement(node as ArrayElement);
            default:
                throw new Error(`Unexpected node type '${node.kind}' in expression.`);
        }
    }

    private visitMemberAttribute(node: MemberAttribute): MemberAttribute {
        node.member = this.visitExpression(node.member);
        return node;
    }

    private visitBinaryExpression(node: LogicalExpression | BinaryExpression): Expression {
        node.left = this.visitExpression(node.left);
        node.right = this.visitExpression(node.right);

        // Constant folding
        if (node.left.kind === 'Number' && node.right.kind === 'Number') {
            const left = (node.left as NumberNode).value;
            const right = (node.right as NumberNode).value;
            let result: number | boolean;

            switch (node.operator) {
                case Tag.PLUS:
                    result = left + right;
                    break;
                case Tag.MINUS:
                    result = left - right;
                    break;
                case Tag.TIMES:
                    result = left * right;
                    break;
                case Tag.DIV:
                    result = left / right;
                    break;
                case Tag.INT_DIV:
                    result = Math.floor(left / right);
                    break;
                case Tag.POW:
                    result = Math.pow(left, right);
                    break;
                case Tag.MOD:
                    result = left % right;
                    break;
                case Tag.EQ:
                    result = left === right;
                    break;
                case Tag.NE:
                    result = left !== right;
                    break;
                case Tag.GT:
                    result = left > right;
                    break;
                case Tag.LT:
                    result = left < right;
                    break;
                case Tag.GE:
                    result = left >= right;
                    break;
                case Tag.LE:
                    result = left <= right;
                    break;
                default:
                    throw new Error(`Unsupported numeric operator '${node.operator}'`);
            }

            return typeof result === 'number'
                ? ASTFactory.createNumberNode(createToken(Tag.NUMBER, `${result}`, node.start, node.end))
                : ASTFactory.createBooleanNode(createToken(Tag.BOOL, `${result}`, node.start, node.end));
        }

        if (node.left.kind === 'Boolean' && node.right.kind === 'Boolean') {
            const left = (node.left as BooleanNode).value;
            const right = (node.right as BooleanNode).value;
            let result: boolean;

            switch (node.operator) {
                case Tag.AND:
                    result = left && right;
                    break;
                case Tag.OR:
                    result = left || right;
                    break;
                default:
                    throw new Error(`Unsupported logical operator '${node.operator}'`);
            }

            return ASTFactory.createBooleanNode(createToken(Tag.BOOL, `${result}`, node.start, node.end));
        }

        // Algebraic simplification
        if (node.left.kind === "Number") {
            const left = (node.left as NumberNode).value;

            if (node.operator === Tag.PLUS && left === 0) return node.right;
            if (node.operator === Tag.TIMES && left === 1) return node.right;
            if (node.operator === Tag.TIMES && left === 0) {
                return ASTFactory.createNumberNode(createToken(Tag.NUMBER, "0", node.start, node.end));
            }
            if (node.operator === Tag.POW && left === 1) return node.left;
            if (node.operator === Tag.MINUS && left === 0) {
                return ASTFactory.createUnaryExpression(Tag.MINUS, node.right, node.start, node.end);
            }
        }

        if (node.right.kind === "Number") {
            const right = (node.right as NumberNode).value;

            if ((node.operator === Tag.PLUS || node.operator === Tag.MINUS) && right === 0) return node.left;
            if (node.operator === Tag.TIMES && right === 1) return node.left;
            if (node.operator === Tag.TIMES && right === 0) {
                return ASTFactory.createNumberNode(createToken(Tag.NUMBER, "0", node.start, node.end));
            }
            if ((node.operator === Tag.DIV || node.operator === Tag.INT_DIV) && right === 1) return node.left;
            if (node.operator === Tag.POW && right === 1) return node.left;
            if (node.operator === Tag.POW && right === 0) {
                return ASTFactory.createNumberNode(createToken(Tag.NUMBER, "1", node.start, node.end));
            }
        }

        if (node.left.kind === "Boolean") {
            const left = (node.left as BooleanNode).value;

            if (node.operator === Tag.AND && left) return node.right;
            if (node.operator === Tag.AND && !left) {
                return ASTFactory.createBooleanNode(createToken(Tag.BOOL, "false", node.start, node.end));
            }
            if (node.operator === Tag.OR && !left) return node.right;
            if (node.operator === Tag.OR && left) {
                return ASTFactory.createBooleanNode(createToken(Tag.BOOL, "true", node.start, node.end));
            }
        }

        if (node.right.kind === "Boolean") {
            const right = (node.right as BooleanNode).value;

            if (node.operator === Tag.AND && right) return node.left;
            if (node.operator === Tag.AND && !right) {
                return ASTFactory.createBooleanNode(createToken(Tag.BOOL, "false", node.start, node.end));
            }
            if (node.operator === Tag.OR && !right) return node.left;
            if (node.operator === Tag.OR && right) {
                return ASTFactory.createBooleanNode(createToken(Tag.BOOL, "true", node.start, node.end));
            }
        }

        return node;
    }

    private visitFString(node: FString) {
        node.expressions = node.expressions.map(expr => this.visitExpression(expr));
        return node;
    }

    private visitArray(node: ArrayNode) {
        node.elements = node.elements.map(element => this.visitExpression(element));
        return node;
    }

    private visitArrayElement(node: ArrayElement) {
        node.array = this.visitExpression(node.array);
        node.indexes = node.indexes.map(idx => this.visitExpression(idx));
        return node;
    }

    public getAST(): Program {
        return this.ast;
    }

    public getOptimizedAST(): Program {
        return this.optimizedAst;
    }
}