import {
    ArrayElement,
    ArrayNode,
    BinaryExpression,
    BooleanNode,
    Expression,
    FString,
    FunctionCall,
    FunctionDeclaration,
    Identifier,
    LogicalExpression,
    LogicalOperator, NodeType,
    NumberNode,
    Operator,
    Program,
    Statement,
    StringNode,
    UnaryExpression,
    VariableAssignment,
    VariableDeclaration,
    VariableDeclarations
} from "./AST";
import { Tag, Token } from "./Token";

// Custom error class for parser errors with detailed message formatting
class ParserError extends Error {
    constructor(message: string, public line_number: number, public column: number, public line: string) {
        super(`${message} at line ${line_number}, column ${column}:\n${line_number}: ${line}\n` + ' '.repeat(column + String(line_number).length + 2) + '~');
    }
}

export class Parser {
    private index: number = 0;

    constructor(private readonly tokens: Token[]) {}

    // Main parsing function
    parse(): Program {
        const program: Program = { kind: 'Program', body: [] };
        while (!this.isEOF()) {
            program.body.push(this.parseStatement());
        }
        return program;
    }

    // Utility functions for token handling
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

    // Statement parsing functions
    private parseStatement(): Statement {
        if (this.check(Tag.NUM, Tag.STR, Tag.BOOL, Tag.UNDERSCORE)) {
            return this.parseDeclaration();
        }
        if (this.check(Tag.ID)) {
            return this.parseIdentifierBasedStatement();
        }
        return this.error('Unexpected token');
    }

    private parseIdentifierBasedStatement(): Statement {
        switch (this.peek(1).tag) {
            case Tag.ASSIGN:
            case Tag.SELF_INC:
            case Tag.SELF_DEC:
            case Tag.COMMA:
            case Tag.LSP:
                return this.parseDeclaration();
            default:
                return this.parseExpression();
        }
    }

    private parseDeclaration(): Statement {
        if (this.check(Tag.UNDERSCORE)) {
            return this.peek(1).tag === Tag.ASSIGN ? this.parseFunctionDeclaration() : this.parseVariableDeclaration();
        }

        let i = 0;
        while (true) {
            const token = this.peek(i);
            if (token.tag === Tag.ID) return this.parseVariableDeclaration();
            if (token.tag === Tag.COMMA) break;
            if (token.tag === Tag.EOF) return this.error('Unexpected end of file');
            i++;
        }
        return this.parseFunctionDeclaration();
    }

    private parseVariableDeclaration(): Statement {
        const declarations: VariableDeclarations = { kind: 'VariableDeclarations', declarations: [], operator: null, values: [] };

        do {
            const declaration: VariableAssignment | VariableDeclaration = this.check(Tag.ID, Tag.UNDERSCORE)
                ? this.parseVariableAssignment()
                : this.parseTypedVariableDeclaration();
            declarations.declarations.push(declaration);
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
            ? { kind: 'Identifier', name: this.advance().value }
            : this.parseArrayOrIdentifier();

        return { kind: 'VariableAssignment', element } as VariableAssignment;
    }

    private parseTypedVariableDeclaration(): VariableDeclaration {
        let type = this.advance().value;
        while (this.match(Tag.LSP)) {
            type += '[]';
            if (!this.match(Tag.RSP)) this.error('Expected closing square bracket');
        }
        const identifier: Identifier = { kind: 'Identifier', name: this.advance().value };
        return { kind: 'VariableDeclaration', type, identifier };
    }

    private parseFunctionDeclaration(): FunctionDeclaration {
        const returnTypes = this.check(Tag.UNDERSCORE) ? [this.advance().value] : this.parseReturnTypes();
        if (!this.match(Tag.ASSIGN)) this.error('Expected equal sign');
        if (!this.check(Tag.ID)) this.error('Expected identifier');

        const identifier: Identifier = { kind: 'Identifier', name: this.advance().value };
        if (!this.match(Tag.LRP)) this.error('Expected opening parenthesis');

        const parameters = this.check(Tag.RRP) ? [] : this.parseParameters();
        if (!this.match(Tag.RRP)) this.error('Expected closing parenthesis');
        if (!this.match(Tag.LCP)) this.error('Expected opening curly brace');

        const body: Statement[] = [];
        while (!this.check(Tag.RCP)) {
            body.push(this.parseStatement());
        }

        if (!this.match(Tag.RCP)) this.error('Expected closing curly brace');

        return { kind: 'FunctionDeclaration', returnTypes, identifier, parameters, body };
    }

    private parseReturnTypes(): string[] {
        const returnTypes: string[] = [];
        do {
            if (!this.check(Tag.NUM, Tag.STR, Tag.BOOL)) this.error('Expected return type');
            let type = this.advance().value;
            while (this.match(Tag.LSP)) {
                type += '[]';
                if (!this.match(Tag.RSP)) this.error('Expected closing square bracket');
            }
            returnTypes.push(type);
        } while (this.match(Tag.COMMA));
        return returnTypes;
    }

    private parseParameters(): VariableDeclaration[] {
        const parameters: VariableDeclaration[] = [];
        do {
            if (!this.check(Tag.NUM, Tag.STR, Tag.BOOL)) this.error('Expected parameter type');
            let type = this.advance().value;
            while (this.match(Tag.LSP)) {
                type += '[]';
                if (!this.match(Tag.RSP)) this.error('Expected closing square bracket');
            }
            if (!this.check(Tag.ID)) this.error('Expected identifier');
            parameters.push({ kind: 'VariableDeclaration', type, identifier: { kind: 'Identifier', name: this.advance().value } });
        } while (this.match(Tag.COMMA));
        return parameters;
    }

    // Expression parsing functions
    private parseExpression(): Expression {
        return this.parseExpr(this.parseLogicalExpression, 'LogicalExpression', [Tag.OR]);
    }

    private parseLogicalExpression(): Expression {
        return this.parseExpr(this.parseEqualityExpression, 'LogicalExpression', [Tag.AND]);
    }

    private parseEqualityExpression(): Expression {
        return this.parseExpr(this.parseRelationalExpression, 'LogicalExpression',[Tag.EQ, Tag.NE]);
    }

    private parseRelationalExpression(): Expression {
        return this.parseExpr(this.parseAdditiveExpression, 'BinaryExpression',[Tag.GT, Tag.LT, Tag.GE, Tag.LE]);
    }

    private parseAdditiveExpression(): Expression {
        return this.parseExpr(this.parseTerm, 'BinaryExpression',[Tag.PLUS, Tag.MINUS]);
    }

    private parseTerm(): Expression {
        return this.parseExpr(this.parseFactor, 'BinaryExpression',[Tag.TIMES, Tag.DIV, Tag.INT_DIV, Tag.MOD]);
    }

    private parseFactor(): Expression {
        return this.parseExpr(this.parsePrimary, 'BinaryExpression',[Tag.POW]);
    }

    private parseExpr(parseFunc: () => Expression, kind: NodeType, operators: Tag[]): Expression {
        let left = parseFunc.call(this);
        while (this.check(...operators)) {
            left = {
                kind: kind,
                left,
                operator: this.advance().tag as Operator,
                right: parseFunc.call(this)
            };
        }
        return left;
    }

    private parseIdentifier(): Expression {
        const identifier = { kind: 'Identifier', name: this.advance().value } as Identifier;
        if (this.check(Tag.LRP)) {
            return this.parseFunctionCall(identifier);
        }
        if (this.check(Tag.INC, Tag.DEC, Tag.LSP)) {
            return this.parsePostfix(identifier);
        }
        return identifier;
    }

    private parseFunctionCall(identifier: Identifier): FunctionCall {
        const call: FunctionCall = { kind: 'FunctionCall', identifier, arguments: [] };
        this.advance();
        if (this.check(Tag.RRP)) {
            this.advance();
            return call;
        }
        do {
            call.arguments.push(this.parseExpression());
        } while (this.match(Tag.COMMA));
        if (!this.match(Tag.RRP)) this.error('Expected closing parenthesis');
        return call;
    }

    private parsePostfix(identifier: Identifier): Expression {
        if (this.check(Tag.LSP)) {
            return this.parseArrayElement(identifier);
        }
        return {
            kind: 'UnaryExpression',
            operator: this.advance().tag as Operator,
            base: identifier
        } as UnaryExpression;
    }

    private parseArrayElement(identifier: Identifier): ArrayElement {
        const element: ArrayElement = { kind: 'ArrayElement', array: identifier, indices: [] };
        while (this.match(Tag.LSP)) {
            element.indices.push(this.parseExpression());
            if (!this.match(Tag.RSP)) this.error('Expected closing square bracket');
        }
        return element;
    }

    private parsePrimary(): Expression {
        if (this.check(Tag.ID)) return this.parseIdentifier();
        if (this.check(Tag.NUMBER)) return { kind: 'Number', value: Number(this.advance().value) } as NumberNode;
        if (this.check(Tag.TEXT)) return { kind: 'String', value: String(this.advance().value) } as StringNode;
        if (this.check(Tag.TRUE, Tag.FALSE)) return { kind: 'Boolean', value: this.advance().value } as BooleanNode;
        if (this.check(Tag.QUOTE)) return this.parseFString();
        if (this.check(Tag.LSP)) return this.parseArray();
        if (this.check(Tag.LRP)) {
            this.advance();
            const expression = this.parseExpression();
            if (!this.match(Tag.RRP)) this.error('Expected closing parenthesis');
            return expression;
        }
        return this.error('Unexpected token');
    }

    private parseFString(): FString {
        this.advance(); // Skip opening quote
        const value: Expression[] = [];
        while (!this.check(Tag.QUOTE)) {
            if (this.check(Tag.LCP)) {
                this.advance();
                value.push(this.parseExpression());
                if (!this.match(Tag.RCP)) this.error('Expected closing curly brace');
            } else if (this.check(Tag.TEXT)) {
                value.push({ kind: 'String', value: this.advance().value } as StringNode);
            } else {
                this.error('Unexpected token');
            }
        }
        if (!this.match(Tag.QUOTE)) this.error('Expected closing quote');
        return { kind: 'F-String', value };
    }

    private parseArray(): ArrayNode {
        this.advance(); // Skip opening bracket
        const elements: Expression[] = [];
        while (!this.check(Tag.RSP)) {
            elements.push(this.parseExpression());
            if (!this.match(Tag.COMMA)) break;
        }
        if (!this.match(Tag.RSP)) this.error('Expected closing square bracket');
        return { kind: 'Array', elements };
    }

    private parseArrayOrIdentifier(): Expression {
        const identifier = { kind: 'Identifier', name: this.advance().value } as Identifier;
        if (this.check(Tag.LSP)) {
            return this.parseArrayElement(identifier);
        }
        return identifier;
    }
}
