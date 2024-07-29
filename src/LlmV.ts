// Node Types
import {Tag, Token} from "./Token";

type NodeType =
    | 'Program'
    | 'Statement'
    | 'VariableOperations'
    | 'VariableDeclaration'
    | 'VariableAssignment'
    | 'FunctionDeclaration'
    | 'SelfAssignment'
    | 'Expression'
    | 'LogicalExpression'
    | 'BinaryExpression'
    | 'UnaryExpression'
    | 'FunctionCall'
    | 'ReturnStatement'
    | 'Identifier'
    | 'Number'
    | 'String'
    | 'Boolean'
    | 'F-String'
    | 'Array'
    | 'ArrayElement';

type Operator =
    | '+' | '-' | '*' | '/' | '//' | '%' | '**' | '++' | '--' | '!';

type LogicalOperator =
    | '&' | '|' | '==' | '!=' | '>' | '<' | '>=' | '<=' | '!';

interface ASTNode {
    kind: NodeType;
}

interface Statement extends ASTNode {}

interface Program extends ASTNode {
    kind: 'Program';
    body: Statement[];
}

interface VariableOperations extends Statement {
    kind: 'VariableOperations';
    operations: (VariableDeclaration | VariableAssignment)[];
    operator: Operator;
    values: Expression[];
}

interface VariableDeclaration extends Statement {
    kind: 'VariableDeclaration';
    type: string;
    identifier: Identifier;
}

interface VariableAssignment extends Statement {
    kind: 'VariableAssignment';
    element: Identifier | ArrayElement;
}

interface FunctionDeclaration extends Statement {
    kind: 'FunctionDeclaration';
    returnTypes: string[];
    identifier: Identifier;
    parameters: VariableDeclaration[];
    body: Statement[];
}

interface Expression extends Statement {}

interface LogicalExpression extends Expression {
    kind: 'LogicalExpression';
    operator: LogicalOperator;
    left: Expression;
    right: Expression;
}

interface BinaryExpression extends Expression {
    kind: 'BinaryExpression';
    left: Expression;
    operator: Operator;
    right: Expression;
}

interface UnaryExpression extends Expression {
    kind: 'UnaryExpression';
    operator: Operator;
    base: Expression;
}

interface FunctionCall extends Expression {
    kind: 'FunctionCall';
    identifier: Identifier;
    arguments: Expression[];
}

interface ReturnStatement extends Statement {
    kind: 'ReturnStatement';
    arguments: Expression[];
}

interface Identifier extends Expression {
    kind: 'Identifier';
    name: string;
}

interface NumberNode extends Expression {
    kind: 'Number';
    value: number;
}

interface StringNode extends Expression {
    kind: 'String';
    value: string;
}

interface BooleanNode extends Expression {
    kind: 'Boolean';
    value: boolean;
}

interface FString extends Expression {
    kind: 'F-String';
    value: Expression[];
}

interface ArrayNode extends Expression {
    kind: 'Array';
    elements: Expression[];
}

interface ArrayElement extends Expression {
    kind: 'ArrayElement';
    array: Identifier;
    indices: Expression[];
}

class ParserError extends Error {
    constructor(message: string, public line_number: number, public column: number, public line: string) {
        super(`${message} at line ${line_number}, column ${column}:\n${line_number}: ${line}\n` + ' '.repeat(column + String(line_number).length + 2) + '~');
    }
}

class Parser {
    private index: number = 0;

    constructor(private readonly tokens: Token[]) {}

    parse(): Program {
        const program: Program = { kind: 'Program', body: [] };
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
        if (this.check(Tag.NUM, Tag.STR, Tag.BOOL, Tag.UNDERSCORE)) {
            return this.parseDeclaration();
        }
        if (this.check(Tag.PRINT, Tag.READ, Tag.RETURN)) {
            return this.parseBuiltInFunctionCall();
        }
        if (this.check(Tag.ID)) {
            return this.parseIdentifierBasedStatement();
        }
        return this.error('Unexpected token');
    }

    private parseIdentifierBasedStatement(): Statement {
        const nextTag = this.peek(1).tag;
        switch (nextTag) {
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

    private parseBuiltInFunctionCall(): FunctionCall {
        const func: Identifier = { kind: 'Identifier', name: this.advance().value };
        return this.parseFunctionCall(func);
    }

    private parseDeclaration(): Statement {
        if (this.check(Tag.UNDERSCORE)) {
            return this.parseUnderscoreDeclaration();
        }

        if (this.isMultipleDeclaration()) {
            return this.parseFunctionDeclaration();
        }

        return this.parseVariableDeclaration();
    }

    private isMultipleDeclaration(): boolean {
        let i = 0;
        while (true) {
            const token = this.peek(i);
            if (token.tag === Tag.ID) return false;
            if (token.tag === Tag.COMMA) return true;
            if (token.tag === Tag.EOF) return false;
            i++;
        }
    }

    private parseUnderscoreDeclaration(): Statement {
        this.advance(); // Skip underscore
        if (this.check(Tag.ASSIGN)) {
            return this.parseVariableAssignment();
        }
        if (this.check(Tag.COMMA)) {
            return this.parseVariableDeclaration();
        }
        return this.error('Unexpected token after underscore');
    }

    private parseVariableDeclaration(): VariableOperations {
        const declarations: VariableOperations = { kind: 'VariableOperations', operations: [], operator: null, values: [] };

        do {
            const declaration = this.check(Tag.ID, Tag.UNDERSCORE)
                ? this.parseVariableAssignment()
                : this.parseTypedVariableDeclaration();
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
        const returnTypes = this.parseReturnTypes();
        if (!this.match(Tag.ASSIGN)) this.error('Expected equal sign');
        if (!this.check(Tag.ID)) this.error('Expected identifier');

        const identifier: Identifier = { kind: 'Identifier', name: this.advance().value };
        if (!this.match(Tag.LRP)) this.error('Expected opening parenthesis');

        const parameters = this.check(Tag.RRP) ? [] : this.parseParameters();
        if (!this.match(Tag.RRP)) this.error('Expected closing parenthesis');
        if (!this.match(Tag.LCP)) this.error('Expected opening curly brace');

        const body: Statement[] = this.parseFunctionBody();

        if (!this.match(Tag.RCP)) this.error('Expected closing curly brace');

        return { kind: 'FunctionDeclaration', returnTypes, identifier, parameters, body };
    }

    private parseReturnTypes(): string[] {
        if (this.check(Tag.UNDERSCORE)) {
            return [this.advance().value];
        }

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
            left = {
                kind: this.isLogicalOperator(operator) ? 'LogicalExpression' : 'BinaryExpression',
                left,
                operator: operator as Operator | LogicalOperator,
                right
            } as BinaryExpression | LogicalExpression;
        }

        return left;
    }

    private parseUnaryExpression(): Expression {
        if (this.check(Tag.MINUS, Tag.NOT)) {
            const operator = this.advance().tag as Operator;
            const base = this.parseUnaryExpression();
            return { kind: 'UnaryExpression', operator, base } as UnaryExpression;
        }
        return this.parsePrimaryExpression();
    }

    private parsePrimaryExpression(): Expression {
        if (this.check(Tag.ID, Tag.PRINT, Tag.READ, Tag.RETURN)) return this.parseIdentifierOrFunctionCall();
        if (this.check(Tag.NUMBER)) return this.parseNumberLiteral();
        if (this.check(Tag.TEXT)) return this.parseStringLiteral();
        if (this.check(Tag.TRUE, Tag.FALSE)) return this.parseBooleanLiteral();
        if (this.check(Tag.QUOTE)) return this.parseFString();
        if (this.check(Tag.LSP)) return this.parseArray();
        if (this.check(Tag.LRP)) return this.parseParenthesizedExpression();
        return this.error('Unexpected token');
    }

    private parseIdentifierOrFunctionCall(): Expression {
        const identifier: Identifier = { kind: 'Identifier', name: this.advance().value };
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
        this.advance(); // Skip LRP
        if (!this.check(Tag.RRP)) {
            do {
                call.arguments.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
        }
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

    private parseNumberLiteral(): NumberNode {
        return { kind: 'Number', value: Number(this.advance().value) };
    }

    private parseStringLiteral(): StringNode {
        return { kind: 'String', value: String(this.advance().value) };
    }

    private parseBooleanLiteral(): BooleanNode {
        return { kind: 'Boolean', value: this.advance().value === 'true' };
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
                value.push(this.parseStringLiteral());
            } else {
                this.error('Unexpected token in f-string');
            }
        }
        if (!this.match(Tag.QUOTE)) this.error('Expected closing quote');
        return { kind: 'F-String', value };
    }

    private parseArray(): ArrayNode {
        this.advance(); // Skip opening bracket
        const elements: Expression[] = [];
        if (!this.check(Tag.RSP)) {
            do {
                elements.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
        }
        if (!this.match(Tag.RSP)) this.error('Expected closing square bracket');
        return { kind: 'Array', elements };
    }

    private parseParenthesizedExpression(): Expression {
        this.advance(); // Skip opening parenthesis
        const expression = this.parseExpression();
        if (!this.match(Tag.RRP)) this.error('Expected closing parenthesis');
        return expression;
    }

    private parseArrayOrIdentifier(): Expression {
        const identifier: Identifier = { kind: 'Identifier', name: this.advance().value };
        if (this.check(Tag.LSP)) {
            return this.parseArrayElement(identifier);
        }
        return identifier;
    }

    private getBinaryPrecedence(operator: Tag): number {
        switch (operator) {
            case Tag.OR: return 1;
            case Tag.AND: return 2;
            case Tag.EQ:
            case Tag.NE: return 3;
            case Tag.GT:
            case Tag.LT:
            case Tag.GE:
            case Tag.LE: return 4;
            case Tag.PLUS:
            case Tag.MINUS: return 5;
            case Tag.TIMES:
            case Tag.DIV:
            case Tag.INT_DIV:
            case Tag.MOD: return 6;
            case Tag.POW: return 7;
            default: return 0;
        }
    }

    private isLogicalOperator(operator: Tag): boolean {
        const logicalOperators : Tag[] = [Tag.AND, Tag.OR, Tag.EQ, Tag.NE, Tag.GT, Tag.LT, Tag.GE, Tag.LE];
        return logicalOperators.includes(operator);
    }
}