import {
    ArrayElement,
    ArrayNode,
    BinaryExpression,
    BooleanNode,
    ClassDeclaration,
    Expression,
    ForStatement,
    FString,
    FunctionCall,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    LogicalExpression,
    LogicalOperator,
    MemberAttribute,
    MemberFunctionCall,
    NumberNode,
    Operator,
    Program,
    Statement,
    StringNode,
    UnaryExpression,
    VariableAssignment,
    VariableDeclaration,
    VariableOperations,
    WhileStatement,
} from "./AST";
import { Tag, Token } from "./Token";

class ParserError extends Error {
    constructor(
        message: string,
        public line_number: number,
        public column: number,
        public line: string,
    ) {
        super(
            `${message} at line ${line_number}, column ${column}:\n${line_number}: ${line}\n` +
            " ".repeat(column + String(line_number).length + 2) +
            "~",
        );
    }
}

export class Parser {
    private index: number = 0;

    constructor(private readonly tokens: Token[]) {}

    parse(): Program {
        const program: Program = { kind: "Program", body: [] };
        while (!this.isEOF()) {
            program.body.push(this.parseStatement());
        }
        return program;
    }

    private isEOF(): boolean {
        return this.peek().tag === Tag.EOF;
    }

    private peek(ahead = 0): Token {
        return this.tokens[this.index + ahead];
    }

    private advance(): Token {
        return this.tokens[this.index++];
    }

    private match(expected: Tag): boolean {
        if (this.isEOF() || this.peek().tag !== expected) return false;
        this.advance();
        return true;
    }

    private check(...tags: Tag[]): boolean {
        return !this.isEOF() && tags.includes(this.peek().tag);
    }

    private error(message: string): never {
        const { line, column, value } = this.peek();
        throw new ParserError(message, line, column, value);
    }

    private parseStatement(): Statement {
        if (this.check(Tag.NUM, Tag.STR, Tag.BOOL, Tag.UNDERSCORE, Tag.CLASS)) {
            return this.parseDeclaration();
        }
        if (this.check(Tag.PRINT, Tag.READ, Tag.RETURN)) {
            return this.parseBuiltInFunctionCall();
        }
        if (this.check(Tag.ID)) {
            return this.parseIdentifierBasedStatement();
        }
        if (this.check(Tag.THIS)) {
            return this.parseThisStatement();
        }
        if (this.check(Tag.IF)) {
            return this.parseIfStatement();
        }
        if (this.check(Tag.WHILE)) {
            return this.parseWhileStatement();
        }
        if (this.check(Tag.FOR)) {
            return this.parseForStatement();
        }

        return this.error("Unexpected token");
    }

    private parseIdentifierBasedStatement(): Statement {
        let i = 1;
        while (this.peek(i).tag === Tag.LSP || this.peek(i).tag === Tag.RSP) i++;
        let nextTag = this.peek(i).tag;
        switch (nextTag) {
            case Tag.ASSIGN:
            case Tag.SELF_INC:
            case Tag.SELF_DEC:
            case Tag.COMMA:
            case Tag.ID:
                return this.parseDeclaration();
            default:
                return this.parseExpression();
        }
    }

    private parseBuiltInFunctionCall(): FunctionCall {
        const func: Identifier = { kind: "Identifier", name: this.advance().value };
        return this.parseFunctionCall(func);
    }

    private parseDeclaration(): Statement {
        if (this.check(Tag.UNDERSCORE)) {
            return this.parseUnderscoreDeclaration();
        }
        if (this.check(Tag.CLASS)) {
            return this.parseClassDeclaration();
        }
        let i = 0;
        while (true) {
            const tag = this.peek(i).tag;
            // case (custom) typed declaration
            // ID ID
            if (
                tag === Tag.ID ||
                tag === Tag.NUM ||
                tag === Tag.STR ||
                tag === Tag.BOOL
            ) {
                let j = i + 1;
                // skip array brackets
                while (this.peek(j).tag === Tag.LSP || this.peek(j).tag === Tag.RSP) {
                    j++;
                }
                if (this.peek(j).tag === Tag.ID) {
                    return this.parseVariableDeclaration();
                }
            }
            if (tag === Tag.ASSIGN || Tag === Tag.EOF) break;
            i++;
        }
        // skip equal
        i++;
        // case assignment
        // ... = 5
        if (this.peek(i).tag !== Tag.ID && this.peek(i).tag !== Tag.UNDERSCORE) {
            return this.parseVariableDeclaration();
        }
        // skip identifier
        i++;
        // case assignment to identifier
        // ... = x
        if (this.peek(i).tag !== Tag.LRP) {
            return this.parseVariableDeclaration();
        }
        while (this.peek(i).tag !== Tag.RRP) {
            i++;
        }
        // skip closing bracket
        i++;
        // case assignment to function
        // ... = foo()
        if (this.peek(i).tag !== Tag.LCP) {
            return this.parseVariableDeclaration();
        }
        // case function declaration
        // ... = foo() {}
        return this.parseFunctionDeclaration();
    }
    private parseUnderscoreDeclaration(): Statement {
        if (this.peek(1).tag === Tag.ASSIGN) {
            return this.parseFunctionDeclaration();
        }
        if (this.peek(1).tag === Tag.COMMA) {
            return this.parseVariableDeclaration();
        }
        return this.error("Unexpected token after underscore");
    }

    private parseClassDeclaration(): ClassDeclaration {
        this.advance(); // Skip CLASS
        if (!this.check(Tag.ID)) this.error("Expected class name");
        const identifier: Identifier = {
            kind: "Identifier",
            name: this.advance().value,
        };
        const declaration: ClassDeclaration = {
            kind: "ClassDeclaration",
            identifier,
            body: [],
        };

        if (!this.match(Tag.ASSIGN)) this.error("Expected equal sign");
        declaration.body = this.parseBlock();

        return declaration;
    }

    private parseVariableDeclaration(): VariableOperations {
        const declarations: VariableOperations = {
            kind: "VariableOperations",
            operations: [],
            operator: null,
            values: [],
        };

        do {
            let declaration: VariableDeclaration | VariableAssignment;
            if (this.check(Tag.STR, Tag.NUM, Tag.BOOL))
                declaration = this.parseTypedVariableDeclaration();
            else if (!this.check(Tag.UNDERSCORE) && this.check(Tag.ID)) {
                let i = 1;
                while (this.peek(i).tag === Tag.LSP || this.peek(i).tag === Tag.RSP)
                    i++;
                if (this.peek(i).tag === Tag.ID)
                    declaration = this.parseTypedVariableDeclaration();
                else declaration = this.parseVariableAssignment();
            } else declaration = this.parseVariableAssignment();
            declarations.operations.push(declaration);
        } while (this.match(Tag.COMMA));

        if (this.check(Tag.ASSIGN, Tag.SELF_INC, Tag.SELF_DEC)) {
            declarations.operator = this.advance().value as Operator;
            do {
                declarations.values.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
        }

        return declarations;
    }

    private parseVariableAssignment(): VariableAssignment {
        const element = this.check(Tag.UNDERSCORE)
            ? { kind: "Identifier", name: this.advance().value }
            : this.parseArrayOrIdentifier();

        return { kind: "VariableAssignment", element } as VariableAssignment;
    }

    private parseTypedVariableDeclaration(): VariableDeclaration {
        let type = this.advance().value;
        while (this.match(Tag.LSP)) {
            type += "[]";
            if (!this.match(Tag.RSP)) this.error("Expected closing square bracket");
        }
        const identifier: Identifier = {
            kind: "Identifier",
            name: this.advance().value,
        };
        return { kind: "VariableDeclaration", type, identifier };
    }

    private parseFunctionDeclaration(): FunctionDeclaration {
        const returnTypes = this.parseReturnTypes();
        if (!this.match(Tag.ASSIGN)) this.error("Expected equal sign");
        if (!this.check(Tag.ID, Tag.UNDERSCORE)) this.error("Expected identifier");

        const identifier: Identifier = {
            kind: "Identifier",
            name: this.advance().value,
        };
        if (!this.match(Tag.LRP)) this.error("Expected opening parenthesis");

        const parameters = this.check(Tag.RRP) ? [] : this.parseParameters();
        if (!this.match(Tag.RRP)) this.error("Expected closing parenthesis");
        if (!this.match(Tag.LCP)) this.error("Expected opening curly brace");

        const body: Statement[] = this.parseFunctionBody();

        if (!this.match(Tag.RCP)) this.error("Expected closing curly brace");

        return {
            kind: "FunctionDeclaration",
            returnTypes,
            identifier,
            parameters,
            body,
        };
    }

    private parseReturnTypes(): string[] {
        if (this.check(Tag.UNDERSCORE)) {
            return [this.advance().value];
        }

        const returnTypes: string[] = [];
        do {
            if (!this.check(Tag.NUM, Tag.STR, Tag.BOOL, Tag.ID))
                this.error("Expected return type");
            let type = this.advance().value;
            while (this.match(Tag.LSP)) {
                type += "[]";
                if (!this.match(Tag.RSP)) this.error("Expected closing square bracket");
            }
            returnTypes.push(type);
        } while (this.match(Tag.COMMA));
        return returnTypes;
    }

    private parseParameters(): VariableDeclaration[] {
        const parameters: VariableDeclaration[] = [];
        do {
            if (!this.check(Tag.NUM, Tag.STR, Tag.BOOL))
                this.error("Expected parameter type");
            let type = this.advance().value;
            while (this.match(Tag.LSP)) {
                type += "[]";
                if (!this.match(Tag.RSP)) this.error("Expected closing square bracket");
            }
            if (!this.check(Tag.ID)) this.error("Expected identifier");
            parameters.push({
                kind: "VariableDeclaration",
                type,
                identifier: { kind: "Identifier", name: this.advance().value },
            });
        } while (this.match(Tag.COMMA));
        return parameters;
    }

    private parseFunctionBody(): Statement[] {
        const body: Statement[] = [];
        while (!this.check(Tag.RCP)) {
            body.push(this.parseStatement());
        }
        return body;
    }

    private parseExpression(): Expression {
        return this.parseBinaryExpression(0);
    }

    private parseBinaryExpression(precedence: number): Expression {
        let left: Expression = this.parseUnaryExpression();

        while (true) {
            const operator = this.peek().tag;
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

    private createBinaryOrLogicalExpression(
        left: Expression,
        operator: Tag,
        right: Expression,
    ): BinaryExpression | LogicalExpression {
        if (this.isLogicalOperator(operator))
            return {
                kind: "LogicalExpression",
                left,
                operator: operator as LogicalOperator,
                right,
            } as LogicalExpression;
        return {
            kind: "BinaryExpression",
            left,
            operator: operator as Operator,
            right,
        } as BinaryExpression;
    }

    private parseUnaryExpression(): Expression {
        if (this.check(Tag.MINUS, Tag.NOT)) {
            const operator = this.advance().tag as Operator;
            const base = this.parseUnaryExpression();
            return { kind: "UnaryExpression", operator, base } as UnaryExpression;
        }
        return this.parsePrimaryExpression();
    }

    private parsePrimaryExpression(): Expression {
        let expr: Expression;

        if (this.check(Tag.ID, Tag.UNDERSCORE, Tag.PRINT, Tag.READ, Tag.RETURN)) {
            expr = this.parseIdentifierOrFunctionCall();
        } else if (this.check(Tag.NUMBER)) {
            expr = this.parseNumberLiteral();
        } else if (this.check(Tag.TEXT)) {
            expr = this.parseStringLiteral();
        } else if (this.check(Tag.TRUE, Tag.FALSE)) {
            expr = this.parseBooleanLiteral();
        } else if (this.check(Tag.QUOTE)) {
            expr = this.parseFString();
        } else if (this.check(Tag.LSP)) {
            expr = this.parseArray();
        } else if (this.check(Tag.LRP)) {
            expr = this.parseParenthesizedExpression();
        } else {
            return this.error("Unexpected token");
        }

        return this.parsePostfixExpression(expr);
    }

    private parsePostfixExpression(base: Expression): Expression {
        while (true) {
            if (this.check(Tag.LSP)) {
                base = this.parseArrayElement(base as Identifier);
            } else if (this.check(Tag.DOT)) {
                this.advance(); // Skip DOT
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
                        object: base,
                        attribute: identifier,
                    } as MemberAttribute;
                }
            } else if (this.check(Tag.INC, Tag.DEC)) {
                base = {
                    kind: "UnaryExpression",
                    operator: this.advance().tag as Operator,
                    base,
                } as UnaryExpression;
                break;
            } else {
                break;
            }
        }
        return base;
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

    private parseFunctionCall(identifier: Identifier): FunctionCall {
        const call: FunctionCall = {
            kind: "FunctionCall",
            identifier,
            arguments: [],
        };
        this.advance(); // Skip LRP
        if (!this.check(Tag.RRP)) {
            do {
                call.arguments.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
        }
        if (!this.match(Tag.RRP)) this.error("Expected closing parenthesis");
        return call;
    }

    private parseArrayElement(identifier: Identifier): ArrayElement {
        const element: ArrayElement = {
            kind: "ArrayElement",
            array: identifier,
            indices: [],
        };
        while (this.match(Tag.LSP)) {
            element.indices.push(this.parseExpression());
            if (!this.match(Tag.RSP)) this.error("Expected closing square bracket");
        }
        return element;
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
        this.advance(); // Skip opening quote
        const value: Expression[] = [];
        while (!this.check(Tag.QUOTE)) {
            if (this.check(Tag.LCP)) {
                this.advance();
                value.push(this.parseExpression());
                if (!this.match(Tag.RCP)) this.error("Expected closing curly brace");
            } else if (this.check(Tag.TEXT)) {
                value.push(this.parseStringLiteral());
            } else {
                this.error("Unexpected token in f-string");
            }
        }
        if (!this.match(Tag.QUOTE)) this.error("Expected closing quote");
        return { kind: "F-String", value };
    }

    private parseArray(): ArrayNode {
        this.advance(); // Skip opening bracket
        const elements: Expression[] = [];
        if (!this.check(Tag.RSP)) {
            do {
                elements.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
        }
        if (!this.match(Tag.RSP)) this.error("Expected closing square bracket");
        return { kind: "Array", elements };
    }

    private parseParenthesizedExpression(): Expression {
        this.advance(); // Skip opening parenthesis
        const expression = this.parseExpression();
        if (!this.match(Tag.RRP)) this.error("Expected closing parenthesis");
        return expression;
    }

    private parseArrayOrIdentifier(): Expression {
        const identifier: Identifier = {
            kind: "Identifier",
            name: this.advance().value,
        };
        if (this.check(Tag.LSP)) {
            return this.parseArrayElement(identifier);
        }
        return identifier;
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

    private parseIfStatement(): IfStatement {
        this.advance(); // Skip IF
        const condition = this.parseCondition();
        const body = this.parseBlock();

        let elseBody: Statement[] | null = null;
        if (this.match(Tag.ELSE)) {
            elseBody = this.parseBlock();
        }

        return { kind: "IfStatement", condition, body, elseBody };
    }

    private parseWhileStatement(): WhileStatement {
        this.advance(); // Skip WHILE
        const condition = this.parseCondition();
        const body = this.parseBlock();

        return { kind: "WhileStatement", condition, body };
    }

    private parseForStatement(): ForStatement {
        this.advance(); // Skip FOR
        if (!this.match(Tag.LRP)) this.error("Expected opening parenthesis");

        const iterator = this.parseArrayOrIdentifier() as Identifier;
        if (!this.match(Tag.COMMA)) this.error("Expected comma");

        const limit = this.parseExpression();
        if (!this.match(Tag.RRP)) this.error("Expected closing parenthesis");

        const body = this.parseBlock();

        return { kind: "ForStatement", iterator, limit, body };
    }

    private parseCondition(): Expression {
        if (!this.match(Tag.LRP)) this.error("Expected opening parenthesis");
        const condition = this.parseExpression();
        if (!this.match(Tag.RRP)) this.error("Expected closing parenthesis");
        return condition;
    }

    private parseBlock(): Statement[] {
        if (!this.match(Tag.LCP)) this.error("Expected opening curly brace");

        const body: Statement[] = [];
        while (!this.check(Tag.RCP)) {
            body.push(this.parseStatement());
        }

        if (!this.match(Tag.RCP)) this.error("Expected closing curly brace");

        return body;
    }

    private parseThisStatement() {
        return undefined;
    }
}
