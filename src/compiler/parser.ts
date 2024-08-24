import {Tag, Token} from "../data";
import {
    Expression,
    Identifier,
    Statement,
    Program,
    VariableDeclaration,
    VariableAssignment,
    VariableOperations,
    FunctionDeclaration,
    MemberFunctionCall,
    MemberAttribute,
    ArrayElement,
    UnaryExpression,
    BinaryExpression,
    LogicalExpression,
    NumberNode,
    StringNode,
    BooleanNode,
    FString,
    ArrayNode,
    IfStatement,
    WhileStatement,
    ForStatement,
    ClassDeclaration,
    FunctionCall,
    SwitchStatement
} from "../data";
import {DayError} from "../utils/error";

export class Parser {
    // TODO: null
    private index: number = 0;
    constructor(private readonly tokens: Token[], private readonly source: string[]) {}
    parse(): Program {
        const program: Program = { kind: "Program", body: [] };
        while (!this.isEOF()) {
            program.body.push(this.parseStatement());
        }
        return program;
    }
    private isEOF(): boolean {
        return this.peek() === Tag.EOF;
    }
    private peek(ahead = 0): Tag {
        return this.tokens[this.index + ahead].tag;
    }
    private advance(): Token {
        return this.tokens[this.index++];
    }
    private match(expected: Tag): boolean {
        if (this.isEOF() || this.peek() !== expected) return false;
        this.advance();
        return true;
    }
    private expect(expected: Tag, message?: string): Token {
        if (this.isEOF() || this.peek() !== expected) {
            this.error(message ? message : `Expected ${Tag[expected]}`);
        }
        return this.advance();
    }
    private check(...tags: Tag[]): boolean {
        return !this.isEOF() && tags.includes(this.peek());
    }
    private error(message: string): never {
        const token = this.tokens[this.index];
        throw DayError.syntaxError(message, token.line, token.column, this.source[token.line - 1]);
    }
    private parseStatement(): Statement {
        if (this.check(Tag.NUM, Tag.STR, Tag.BOOL, Tag.UNDERSCORE, Tag.THIS, Tag.ID)) {
            return this.parseDeclaration([]);
        }
        if (this.check(Tag.PRINT, Tag.READ, Tag.RETURN)) {
            return this.parseBuiltInFunctionCall();
        }
        if (this.match(Tag.CLASS)) {
            return this.parseClassDeclaration();
        }
        if (this.match(Tag.IF)) {
            return this.parseIfStatement();
        }
        if (this.match(Tag.WHILE)) {
            return this.parseWhileStatement();
        }
        if (this.match(Tag.FOR)) {
            return this.parseForStatement();
        }
        if (this.match(Tag.SWITCH)) {
            return this.parseSwitchStatement();
        }

        this.error("Unexpected token");
    }
    private parseDeclaration(elements: Identifier[]): Statement {
        if (this.check(Tag.STR, Tag.NUM, Tag.BOOL) || (this.check(Tag.ID) && this.peek(1) === Tag.LSP && this.peek(1) === Tag.RSP)) {
            return this.parseTypedDeclaration(elements);
        }

        if (this.check(Tag.UNDERSCORE)) {
            return this.parseUnderscoreDeclaration(elements);
        }

        if (this.check(Tag.ID, Tag.THIS)) {
            return this.parseIdentifierDeclaration(elements);
        }

        if (this.check(Tag.SELF_INC, Tag.SELF_DEC)) {
            return this.parseVariableDeclaration(this.createVariableAssignments(elements));
        }

        if (this.check(Tag.ASSIGN)) {
            return this.parseAssignOperator(elements);
        }

        return this.error("Unexpected token");
    }
    private parseTypedDeclaration(elements: Identifier[]): Statement {
        const type = this.parseType();

        if (this.check(Tag.ID)) {
            const assignments: (VariableAssignment | VariableDeclaration)[] = this.createVariableAssignments(elements);
            assignments.push({
                kind: "VariableDeclaration",
                type,
                identifier: { kind: "Identifier", name: this.advance().value },
            } as VariableDeclaration);
            return this.parseVariableDeclaration(assignments);
        }

        if (this.check(Tag.COMMA, Tag.ASSIGN)) {
            const returnTypes: string[] = [];
            for (const el: Identifier of elements) {
                returnTypes.push(el.name);
            }
            returnTypes.push(type);
            return this.parseFunctionDeclaration(returnTypes);
        }

        this.error("Unexpected token");
    }
    private parseType(): string {
        let type = this.advance().value;
        while (this.match(Tag.LSP)) {
            type += "[]";
            this.expect(Tag.RSP);
        }
        return type;
    }
    private parseIdentifierDeclaration(elements: Identifier[]): Statement {
        const op: Expression = this.parseExpression()//this.parsePostfixExpression({ kind: "Identifier", name: this.advance().value } as Identifier);
        if (op.kind === "MemberFunctionCall" || op.kind === "UnaryExpression" || op.kind === "FunctionCall") {
            if (elements.length !== 0) this.error("Cannot call a function inside a declaration");
            return op;
        }

        if (op.kind === "MemberAttribute" || op.kind === "ArrayElement") {
            const assignments: (VariableAssignment | VariableDeclaration)[] = this.createVariableAssignments(elements);
            assignments.push({ kind: "VariableAssignment", element: op } as VariableAssignment);
            return this.parseVariableDeclaration(assignments);
        }

        if (op.kind === "Identifier") {
            if (this.check(Tag.ID)) {
                const type = (op as Identifier).name;
                const assignments: (VariableAssignment | VariableDeclaration)[] = this.createVariableAssignments(elements);
                assignments.push({
                    kind: "VariableDeclaration",
                    type,
                    identifier: { kind: "Identifier", name: this.advance().value },
                } as VariableDeclaration);
                return this.parseVariableDeclaration(assignments);
            }

            if (this.check(Tag.COMMA, Tag.ASSIGN)) {
                if (this.check(Tag.COMMA)) this.advance();
                elements.push(op as Identifier);
                return this.parseDeclaration(elements);
            }

            this.error("Unexpected token");
        }

        this.error("Unexpected expression");
    }
    private createVariableAssignments(identifiers: Identifier[]): VariableAssignment[] {
        const assignments: VariableAssignment[] = [];
        for (const id of identifiers) {
            const assignment: VariableAssignment = {
                kind: "VariableAssignment",
                element: id
            };
            assignments.push(assignment);
        }
        return assignments;
    }
    private parseVariableDeclaration(operations: (VariableDeclaration | VariableAssignment)[]): VariableOperations {
        const declarations: VariableOperations = {
            kind: "VariableOperations",
            operations: null,
            operator: null,
            values: [],
        };
        declarations.operations = operations.concat(this.parseVariableOperations())

        // check if it is a declaration or an assignment
        if (this.check(Tag.ASSIGN, Tag.SELF_INC, Tag.SELF_DEC)) {
            declarations.operator = this.advance().tag;
            do {
                declarations.values.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
        } else {
            // if it is a declaration it can't have any assignment inside
            if (declarations.operations.some(op => op.kind === "VariableAssignment")) {
                this.error("Variable declaration cannot have assignments");
            }
        }

        return declarations;
    }
    private parseVariableOperations(): (VariableDeclaration | VariableAssignment)[] {
        let operations: (VariableDeclaration | VariableAssignment)[]= [];
        while (this.match(Tag.COMMA)) {
            let declaration: VariableDeclaration | VariableAssignment;
            if (this.check(Tag.STR, Tag.NUM, Tag.BOOL))
                declaration = this.parseTypedVariableDeclaration();
            else if (this.check(Tag.UNDERSCORE))
                declaration = { kind: "VariableAssignment", element: { kind: "Identifier", name: this.advance().value } } as VariableAssignment;
            else if (this.check(Tag.ID)) {
                if (this.peek(1) === Tag.LSP && this.peek(2) === Tag.RSP) declaration = this.parseTypedVariableDeclaration();
                else {
                    const op = this.parsePostfixExpression({ kind: "Identifier", name: this.advance().value } as Identifier);
                    if (op.kind === "Identifier") {
                        if (this.check(Tag.ID)) {
                            const type = (op as Identifier).name;
                            const identifier: Identifier = { kind: "Identifier", name: this.advance().value };
                            declaration = {kind: "VariableDeclaration", type, identifier} as VariableDeclaration;
                        }
                        else declaration = {kind: "VariableAssignment", element: op} as VariableAssignment;
                    }
                    else if (op.kind === "MemberAttribute" || op.kind === "ArrayElement") {
                        declaration = { kind: "VariableAssignment", element: op } as VariableAssignment;
                    }
                    else this.error("Unexpected token");
                }
            } else this.error("Unexpected token");
            operations.push(declaration);
        }
        return operations
    }
    private parseTypedVariableDeclaration(): VariableDeclaration {
        const type = this.parseType();
        const identifier: Identifier = {
            kind: "Identifier",
            name: this.advance().value,
        };
        return { kind: "VariableDeclaration", type, identifier };
    }
    private parseFunctionDeclaration(returnTypes: String[]): FunctionDeclaration {
        const declaration: FunctionDeclaration = {
            kind: "FunctionDeclaration",
            returnTypes: returnTypes.concat(this.parseReturnTypes()),
            identifier: null,
            parameters: [],
            body: [],
        };

        this.expect(Tag.ASSIGN);

        declaration.identifier = {
            kind: "Identifier",
            name: this.expect(Tag.ID, "Expected function name").value,
        };
        if (!this.match(Tag.RRP)) {
            declaration.parameters = this.parseParameters();
        }
        declaration.body = this.parseBlock();

        return declaration;
    }
    private parseReturnTypes(): string[] {
        const returnTypes: string[] = [];
        while (this.match(Tag.COMMA)) {
            returnTypes.push(this.parseType())
        }
        return returnTypes;
    }
    private parseUnderscoreDeclaration(elements: Identifier[]) {
        elements.push({ kind: "Identifier", name: this.advance().value });
        if (this.check(Tag.COMMA)) {
            return this.parseVariableDeclaration(this.createVariableAssignments(elements));
        }

        if (this.check(Tag.ASSIGN)) {
            if (elements.length !== 1) this.error("Void function cannot have multiple return types");
            return this.parseFunctionDeclaration(["_"]);
        }

        return this.error("Unexpected token");
    }
    private parseAssignOperator(elements: Identifier[]) {
        if (!(this.peek(1) === Tag.ID || this.peek(1) === Tag.UNDERSCORE)) return this.parseVariableDeclaration(this.createVariableAssignments(elements))

        this.advance() // Skip ASSIGN

        if (this.isFunctionDeclaration()) return {kind: "FunctionDeclaration", returnTypes: elements.map(el => el.name), identifier: { kind: "Identifier", name: this.advance().value }, parameters: this.parseParameters(), body: this.parseBlock() } as FunctionDeclaration;

        const declarations: VariableOperations = {
            kind: "VariableOperations",
            operations: this.createVariableAssignments(elements),
            operator: Tag.ASSIGN,
            values: [this.parseExpression()],
        };
        while (this.match(Tag.COMMA)) {
            declarations.values.push(this.parseExpression());
        }
        return declarations;
    }
    private isFunctionDeclaration(): boolean {
        return (this.peek(1) === Tag.LRP && ((this.peek(2) === Tag.RRP && this.peek(3) === Tag.LCP) || ([Tag.STR, Tag.NUM, Tag.BOOL] as Tag[]).includes(this.peek(2)) || (this.peek(2) === Tag.ID && (this.peek(3) === Tag.ID || (this.peek(3) === Tag.LSP && this.peek(4) === Tag.RSP)))))
    }
    private parsePostfixExpression(base: Expression): Expression {
        while (true) {
            if (this.check(Tag.LSP)) {
                base = this.parseArrayElement(base as Identifier);
            } else if (this.match(Tag.DOT)) {
                const identifier: Identifier = {
                    kind: "Identifier",
                    name: this.advance().value,
                };
                if (this.check(Tag.LRP)) {
                    base = {
                        kind: "MemberFunctionCall",
                        member: base,
                        function: this.parseFunctionCall(identifier),
                    } as MemberFunctionCall;
                } else {
                    base = {
                        kind: "MemberAttribute",
                        member: base,
                        attribute: identifier,
                    } as MemberAttribute;
                }
            } else if (this.check(Tag.INC, Tag.DEC)) {
                base = {
                    kind: "UnaryExpression",
                    operator: this.advance().tag,
                    base,
                } as UnaryExpression;
                break;
            } else {
                break;
            }
        }
        return base;
    }
    private parseFunctionCall(identifier: Identifier): FunctionCall {
        const call: FunctionCall = {
            kind: "FunctionCall",
            identifier,
            arguments: [],
        };
        this.match(Tag.LRP);
        if (!this.match(Tag.RRP)) {
            do {
                call.arguments.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
            this.expect(Tag.RRP);
        }
        return call;
    }
    private parseParameters(): VariableDeclaration[] {
        this.expect(Tag.LRP);
        const parameters: VariableDeclaration[] = [];
        if (!this.match(Tag.RRP)) {
            do {
                const type = this.parseType();
                parameters.push({
                    kind: "VariableDeclaration",
                    type,
                    identifier: { kind: "Identifier", name: this.expect(Tag.ID, "Expected parameter name").value },
                });
            } while (this.match(Tag.COMMA));
            this.expect(Tag.RRP);
        }
        return parameters;
    }
    private parseArrayElement(identifier: Identifier): ArrayElement {
        const element: ArrayElement = {
            kind: "ArrayElement",
            array: identifier,
            indices: [],
        };
        while (this.match(Tag.LSP)) {
            element.indices.push(this.parseExpression());
            this.expect(Tag.RSP);
        }
        return element;
    }
    private parseExpression(): Expression {
        return this.parseBinaryExpression(0);
    }
    private parseBinaryExpression(precedence: number): Expression {
        let left: Expression = this.parseUnaryExpression();

        while (true) {
            const operator = this.peek();
            const newPrecedence = this.getBinaryPrecedence(operator);
            if (newPrecedence <= precedence) {
                break;
            }

            this.advance();
            const right = this.parseBinaryExpression(newPrecedence);
            left = this.createBinaryOrLogicalExpression(left, operator, right);
        }

        return left;
    }
    private getBinaryPrecedence(operator: Tag): number {
        switch (operator) {
            case Tag.OR:
                return 1;
            case Tag.AND:
                return 2;
            case Tag.EQ:
            case Tag.NE:
                return 3;
            case Tag.GT:
            case Tag.LT:
            case Tag.GE:
            case Tag.LE:
                return 4;
            case Tag.PLUS:
            case Tag.MINUS:
                return 5;
            case Tag.TIMES:
            case Tag.DIV:
            case Tag.INT_DIV:
            case Tag.MOD:
                return 6;
            case Tag.POW:
                return 7;
            default:
                return 0;
        }
    }
    private createBinaryOrLogicalExpression(
        left: Expression,
        operator: Tag,
        right: Expression,
    ): BinaryExpression | LogicalExpression {
        if (this.isLogicalOperator(operator))
            return {
                kind: "LogicalExpression",
                left,
                operator: operator,
                right,
            } as LogicalExpression;
        return {
            kind: "BinaryExpression",
            left,
            operator: operator,
            right,
        } as BinaryExpression;
    }
    private isLogicalOperator(operator: Tag): boolean {
        const logicalOperators: Tag[] = [
            Tag.AND,
            Tag.OR,
            Tag.EQ,
            Tag.NE,
            Tag.GT,
            Tag.LT,
            Tag.GE,
            Tag.LE,
        ];
        return logicalOperators.includes(operator);
    }
    private parseUnaryExpression(): Expression {
        if (this.check(Tag.MINUS, Tag.NOT)) {
            const operator = this.advance().tag;
            const base = this.parseUnaryExpression();
            return { kind: "UnaryExpression", operator, base } as UnaryExpression;
        }
        return this.parsePrimaryExpression();
    }
    private parsePrimaryExpression(): Expression {
        let expr: Expression;

        if (this.check(Tag.ID, Tag.UNDERSCORE, Tag.THIS, Tag.PRINT, Tag.READ, Tag.RETURN)) {
            expr = this.parseIdentifierOrFunctionCall();
        } else if (this.check(Tag.NUMBER)) {
            expr = this.parseNumberLiteral();
        } else if (this.check(Tag.TEXT)) {
            expr = this.parseStringLiteral();
        } else if (this.check(Tag.TRUE, Tag.FALSE)) {
            expr = this.parseBooleanLiteral();
        } else if (this.match(Tag.QUOTE)) {
            expr = this.parseFString();
        } else if (this.match(Tag.LSP)) {
            expr = this.parseArray();
        } else if (this.match(Tag.LRP)) {
            expr = this.parseParenthesizeExpression();
        }
        else {
            this.error("Unexpected token");
        }

        return this.parsePostfixExpression(expr);
    }
    private parseIdentifierOrFunctionCall(): Expression {
        const identifier: Identifier = {
            kind: "Identifier",
            name: this.advance().value,
        };
        if (this.check(Tag.LRP)) {
            return this.parseFunctionCall(identifier);
        }
        return identifier;
    }
    private parseNumberLiteral(): NumberNode {
        return { kind: "Number", value: Number(this.advance().value) };
    }
    private parseStringLiteral(): StringNode {
        return { kind: "String", value: String(this.advance().value) };
    }
    private parseBooleanLiteral(): BooleanNode {
        return { kind: "Boolean", value: this.advance().value === "true" };
    }
    private parseFString(): FString {
        const value: Expression[] = [];
        while (!this.match(Tag.QUOTE)) {
            if (this.match(Tag.LCP)) {
                value.push(this.parseExpression());
                this.expect(Tag.RCP);
            } else if (this.check(Tag.TEXT)) {
                value.push(this.parseStringLiteral());
            } else {
                this.error("Unexpected token");
            }
        }
        return { kind: "F-String", value };
    }
    private parseArray(): ArrayNode {
        const elements: Expression[] = [];
        if (!this.match(Tag.RSP)) {
            do {
                elements.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
            this.expect(Tag.RSP);
        }
        return { kind: "Array", elements };
    }
    private parseParenthesizeExpression(): Expression {
        const expr = this.parseExpression();
        this.expect(Tag.RRP);
        return expr;
    }
    private parseBuiltInFunctionCall(): FunctionCall {
        const func: Identifier = { kind: "Identifier", name: this.advance().value };
        return this.parseFunctionCall(func);
    }
    private parseIfStatement(): IfStatement {
        const condition = this.parseCondition();
        const body = this.parseBlock();

        let elseBody: Statement[] | null = null;
        if (this.match(Tag.ELSE)) {
            elseBody = this.parseBlock();
        }

        return { kind: "IfStatement", condition, body, elseBody };
    }
    private parseWhileStatement(): WhileStatement {
        const condition = this.parseCondition();
        const body = this.parseBlock();

        return { kind: "WhileStatement", condition, body };
    }
    private parseForStatement(): ForStatement {
        this.expect(Tag.LRP);

        const iterator : Identifier = { kind: "Identifier", name: this.expect(Tag.ID, "Expected iterator").value };
        this.expect(Tag.COMMA);

        const limit = this.parseExpression();
        this.expect(Tag.RRP);

        const body = this.parseBlock();

        return { kind: "ForStatement", iterator, limit, body };
    }
    private parseSwitchStatement(): SwitchStatement {
        const statement: SwitchStatement = {
            kind: "SwitchStatement",
            expression: this.parseExpression(),
            cases: [],
            default: [],
        };

        this.expect(Tag.LCP);
        if (this.match(Tag.RCP)) return statement;

        while (this.match(Tag.CASE)) {
            const values = [];
            do {
                values.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
            const body = this.parseBlock();
            statement.cases.push({ kind: "CaseStatement", values, body });
        }

        while (!this.match(Tag.RCP)) {
            statement.default.push(this.parseStatement());
        }

        return statement;
    }
    private parseCondition(): Expression {
        this.expect(Tag.LRP);
        const condition = this.parseExpression();
        this.expect(Tag.RRP);
        return condition;
    }
    private parseBlock(): Statement[] {
        this.expect(Tag.LCP);

        const body: Statement[] = [];
        while (!this.match(Tag.RCP)) {
            body.push(this.parseStatement());
        }

        return body;
    }
    private parseClassDeclaration(): ClassDeclaration {
        const identifier: Identifier = {
            kind: "Identifier",
            name: this.expect(Tag.ID, "Expected class name").value,
        };
        const declaration: ClassDeclaration = {
            kind: "ClassDeclaration",
            identifier,
            body: [],
        };

        this.expect(Tag.ASSIGN);
        declaration.body = this.parseBlock();

        return declaration;
    }
}