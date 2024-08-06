import {Tag, Token} from "./Token";

type NodeType = 'Program' | 'Statement' | 'IfStatement' | 'WhileStatement' | 'ForStatement' | 'VariableOperations' | 'VariableDeclaration' | 'VariableAssignment' | 'Identifier' | 'FunctionDeclaration' | 'ClassDeclaration' | 'MemberFunctionCall' | 'MemberAttribute' | 'UnaryExpression' | 'ArrayElement' | 'FunctionCall' | 'LogicalExpression' | 'BinaryExpression' | 'Number' | 'String' | 'Boolean' | 'F-String' | 'Array';
interface ASTNode {
    kind: NodeType;
}
interface Statement extends ASTNode {}
interface Program extends ASTNode {
    kind: 'Program';
    body: Statement[];
}
interface IfStatement extends Statement {
    kind: 'IfStatement';
    condition: Expression;
    body: Statement[];
    elseBody: Statement[];
}
interface WhileStatement extends Statement {
    kind: 'WhileStatement';
    condition: Expression;
    body: Statement[];
}
interface ForStatement extends Statement {
    kind: 'ForStatement';
    iterator: Identifier;
    limit: Expression;
    body: Statement[];
}
interface FunctionDeclaration extends Statement {
    kind: 'FunctionDeclaration';
    returnTypes: string[];
    identifier: Identifier;
    parameters: VariableDeclaration[];
    body: Statement[];
}
interface ClassDeclaration extends Statement {
    kind: 'ClassDeclaration';
    identifier: Identifier;
    body: Statement[];
}
interface Expression extends Statement {}
interface FunctionCall extends Expression {
    kind: 'FunctionCall';
    identifier: Identifier;
    arguments: Expression[];
}
interface VariableOperations extends Statement {
    kind: 'VariableOperations';
    operations: (VariableDeclaration | VariableAssignment)[];
    operator: string;
    values: Expression[];
}
interface VariableDeclaration extends Statement {
    kind: 'VariableDeclaration';
    type: string;
    identifier: Identifier;
}
interface VariableAssignment extends Statement {
    kind: 'VariableAssignment';
    element: Expression;
}
interface Identifier extends Expression {
    kind: 'Identifier';
    name: string;
}
interface ArrayElement extends Expression {
    kind: 'ArrayElement';
    array: Identifier;
    indices: Expression[];
}
interface MemberFunctionCall extends Expression {
    kind: 'MemberFunctionCall';
    member: Identifier;
    function: FunctionCall;
}
interface MemberAttribute extends Expression {
    kind: 'MemberAttribute';
    member: Identifier;
    attribute: Expression;
}
interface UnaryExpression extends Expression {
    kind: 'UnaryExpression';
    operator: string;
    base: Expression;
}
interface LogicalExpression extends Expression {
    kind: 'LogicalExpression';
    operator: string;
    left: Expression;
    right: Expression;
}
interface BinaryExpression extends Expression {
    kind: 'BinaryExpression';
    left: Expression;
    operator: string;
    right: Expression;
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
export class Parser {
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
        const token = this.peek();
        throw new ParserError(message, token.line, token.column, this.source[token.line - 1]);
    }
    private parseStatement(): Statement {
        if (this.check(Tag.NUM, Tag.STR, Tag.BOOL, Tag.UNDERSCORE, Tag.THIS, Tag.ID)) {
            return this.parseDeclaration([]);
        }
        if (this.check(Tag.PRINT, Tag.READ, Tag.RETURN)) {
            return this.parseBuiltInFunctionCall();
        }
        if (this.check(Tag.CLASS)) {
            return this.parseClassDeclaration();
        }
        if (this.check(Tag.THIS)) {
            throw new Error("Not implemented");
        }
        if (this.check(Tag.SWITCH)) {
            throw new Error("Not implemented");
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

        this.error("Unexpected token");
    }
    private parseDeclaration(elements: String[]): Statement {
        const token: Token = this.advance();
        const tag: Tag = token.tag;
        const id: string = token.value;

        if (tag === Tag.UNDERSCORE) {
            elements.push(id);
            if (this.check(Tag.COMMA)) {
                return this.parseVariableDeclaration(this.createVariableAssignments(elements));
            }

            if (this.check(Tag.ASSIGN)) {
                this.advance(); // Skip ASSIGN
                const identifier: Identifier = { kind: "Identifier", name: this.advance().value };
                this.advance(); // Skip LRP
                return this.parseFuncDec(identifier, elements);
            }

            return this.error("Unexpected token");
        }

        if (tag === Tag.ID && this.check(Tag.LRP)) {
            return this.handleFunctionCall(id);
        }

        if (this.check(Tag.ID)) {
            return this.handleVariableDeclaration(id, elements);
        }

        if (this.check(Tag.LSP)) {
            return this.handleArrayOrFunctionDeclaration(token, elements);
        }

        if (this.check(Tag.DOT)) {
            return this.handleMemberFunctionOrVariableAssignment(token, elements);
        }

        if (this.check(Tag.COMMA)) {
            return this.handleComma(id, elements);
        }

        if (this.check(Tag.SELF_INC, Tag.SELF_DEC)) {
            return this.handleSelfAssignment(token, elements);
        }

        if (this.check(Tag.ASSIGN)) {
            elements.push(id);
            return this.handleAssignment(elements);
        }

        this.error("Unexpected token");
    }
    private parseVariableDeclaration(operations: (VariableDeclaration | VariableAssignment)[]): VariableOperations {
        const declarations: VariableOperations = {
            kind: "VariableOperations",
            operations,
            operator: null,
            values: [],
        };
        while (this.match(Tag.COMMA)) {
            let declaration: VariableDeclaration | VariableAssignment;
            if (this.check(Tag.STR, Tag.NUM, Tag.BOOL))
                declaration = this.parseTypedVariableDeclaration();
            else if (this.check(Tag.ID)) {
                let i = 1;
                while (this.peek(i).tag === Tag.LSP || this.peek(i).tag === Tag.RSP)
                    i++;
                if (this.peek(i).tag === Tag.ID)
                    declaration = this.parseTypedVariableDeclaration();
                else declaration = this.parseVariableAssignment();
            } else declaration = this.parseVariableAssignment();
            declarations.operations.push(declaration);
        }

        // check if it is a declaration or an assignment
        if (this.check(Tag.ASSIGN, Tag.SELF_INC, Tag.SELF_DEC)) {
            declarations.operator = this.advance().value;
            do {
                declarations.values.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
        } else {
            // if it is a declaration it can't have any assignment inside
            if (declarations.operations.some(op => op.kind === "VariableAssignment")) {
                throw new Error("Variable declaration cannot have assignments");
            }
        }

        return declarations;
    }
    private parseArrayType(identifier: string): string {
        while (this.peek().tag === Tag.LSP) {
            this.advance();
            if (!this.match(Tag.RSP)) {
                throw new Error("Expected ]");
            }
            identifier += "[]";
        }
        return identifier;
    }
    private parseFunctionDeclaration(elements: String[]): FunctionDeclaration {
        const declaration: FunctionDeclaration = {
            kind: "FunctionDeclaration",
            returnTypes: elements,
            identifier: null,
            parameters: [],
            body: [],
        };

        while (!this.check(Tag.ASSIGN)) {
            if (this.check(Tag.COMMA)) {
                this.advance();
            }
            if (this.check(Tag.ID)) {
                declaration.returnTypes.push(this.advance().value);
                while (this.match(Tag.LSP)) {
                    if (!this.match(Tag.RSP)) {
                        throw new Error("Expected ]");
                    }
                    declaration.returnTypes[declaration.returnTypes.length - 1] += "[]";
                }
            }
        }

        if (!this.match(Tag.ASSIGN)) {
            throw new Error("Expected assignment");
        }

        if (!this.check(Tag.ID)) {
            throw new Error("Expected identifier");
        }
        declaration.identifier = {
            kind: "Identifier",
            name: this.advance().value,
        };
        if (!this.match(Tag.LRP)) {
            throw new Error("Expected (");
        }
        if (!this.check(Tag.RRP)) {
            declaration.parameters = this.parseParameters();
        }
        if (!this.match(Tag.RRP)) {
            throw new Error("Expected )");
        }
        if (!this.match(Tag.LCP)) {
            throw new Error("Expected {");
        }
        while (!this.check(Tag.RCP)) {
            declaration.body.push(this.parseStatement());
        }
        if (!this.match(Tag.RCP)) {
            throw new Error("Expected }");
        }

        return declaration;
    }
    private parseParameters(): VariableDeclaration[] {
        const parameters: VariableDeclaration[] = [];
        do {
            if (!this.check(Tag.NUM, Tag.STR, Tag.BOOL))
                throw new Error("Expected type");
            let type = this.advance().value;
            while (this.match(Tag.LSP)) {
                type += "[]";
                if (!this.match(Tag.RSP)) {
                    throw new Error("Expected ]");
                }
            }
            if (!this.check(Tag.ID)) {
                throw new Error("Expected identifier");
            }
            parameters.push({
                kind: "VariableDeclaration",
                type,
                identifier: { kind: "Identifier", name: this.advance().value },
            });
        } while (this.match(Tag.COMMA));
        return parameters;
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
                    operator: this.advance().value,
                    base,
                } as UnaryExpression;
                break;
            } else {
                break;
            }
        }
        return base;
    }
    private parseArrayElement(identifier: Identifier): ArrayElement {
        const element: ArrayElement = {
            kind: "ArrayElement",
            array: identifier,
            indices: [],
        };
        while (this.match(Tag.LSP)) {
            element.indices.push(this.parseExpression());
            if (!this.match(Tag.RSP)) this.error("Expected ]");
        }
        return element;
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
        if (!this.match(Tag.RRP)) this.error("Expected )");
        return call;
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
            const operator = this.advance().value;
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
        } else if (this.check(Tag.QUOTE)) {
            expr = this.parseFString();
        } else if (this.check(Tag.LSP)) {
            expr = this.parseArray();
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
        this.advance(); // Skip opening quote
        const value: Expression[] = [];
        while (!this.check(Tag.QUOTE)) {
            if (this.check(Tag.LCP)) {
                this.advance();
                value.push(this.parseExpression());
                if (!this.match(Tag.RCP)) this.error("Expected }");
            } else if (this.check(Tag.TEXT)) {
                value.push(this.parseStringLiteral());
            } else {
                this.error("Unexpected token");
            }
        }
        if (!this.match(Tag.QUOTE)) throw new Error("Expected closing quote");
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
        if (!this.match(Tag.RSP)) this.error("Expected closing bracket");
        return { kind: "Array", elements };
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
            if (!this.match(Tag.RSP)) throw new Error("Expected ]");
        }
        const identifier: Identifier = {
            kind: "Identifier",
            name: this.advance().value,
        };
        return { kind: "VariableDeclaration", type, identifier };
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
    private createVariableAssignments(element: string[]): VariableAssignment[] {
        const assignments: VariableAssignment[] = [];
        for (const id of element) {
            const assignment: VariableAssignment = {
                kind: "VariableAssignment",
                element: {
                    kind: "Identifier",
                    name: id,
                } as Expression,
            };
            assignments.push(assignment);
        }
        return assignments;
    }
    private handleFunctionCall(id: string) {
        return this.parsePostfixExpression(this.parseFunctionCall({ kind: "Identifier", name: id } as Identifier));
    }
    private handleVariableDeclaration(id: string, elements: String[]): Statement {
        const operations: (VariableDeclaration | VariableAssignment)[] = this.createVariableAssignments(elements);
        operations.push({
            kind: "VariableDeclaration",
            type: id,
            identifier: { kind: "Identifier", name: this.advance().value },
        });
        return this.parseVariableDeclaration(operations);
    }
    private handleArrayOrFunctionDeclaration(token: Token, elements: String[]): Statement {
        if (this.peek(1).tag === Tag.RSP) {
            const type = this.parseArrayType(token.value);
            if (this.peek().tag === Tag.ID) {
                const operations:(VariableDeclaration | VariableAssignment)[] = this.createVariableAssignments(elements);
                operations.push({
                    kind: "VariableDeclaration",
                    type: type,
                    identifier: { kind: "Identifier", name: this.advance().value },
                });
                return this.parseVariableDeclaration(operations);
            }
            return this.parseFunctionDeclaration(elements);
        }
        if (token.tag !== Tag.ID) this.error("Invalid name");
        const operations = this.createVariableAssignments(elements);
        operations.push({
            kind: "VariableAssignment",
            element: this.parsePostfixExpression({ kind: "Identifier", name: token.value } as Identifier),
        });
        return this.parseVariableDeclaration(operations);
    }
    private handleMemberFunctionOrVariableAssignment(token: Token, elements: String[]) {
        if (!(token.tag === Tag.ID || Tag.THIS)) this.error("Invalid name");
        const m = this.parsePostfixExpression({ kind: "Identifier", name: token.value } as Identifier);
        if (m.kind === "MemberFunctionCall") {
            if (elements.length > 0) this.error("unexpected token");
            return m;
        }
        const operations = this.createVariableAssignments(elements);
        operations.push({
            kind: "VariableAssignment",
            element: m,
        });
        return this.parseVariableDeclaration(operations);
    }
    private handleComma(id: string, elements: String[]) {
        this.advance();
        elements.push(id);
        return this.parseDeclaration(elements);
    }
    private handleSelfAssignment(token: Token, elements: String[]) {
        if (token.tag !== Tag.ID) this.error("Invalid name");
        const operations = this.createVariableAssignments(elements);
        operations.push({
            kind: "VariableAssignment",
            element: this.parsePostfixExpression({ kind: "Identifier", name: token.value } as Identifier),
        });
        return this.parseVariableDeclaration(operations);
    }
    private handleAssignment(elements: String[]) {
        if (!(this.peek(1).tag === Tag.ID || Tag.UNDERSCORE)) return this.parseVariableDeclaration(this.createVariableAssignments(elements))

        return this.parseFunction(elements);
    }
    private parseVariableOperations(identifier: Identifier, elements: String[]) {
        const declarations: VariableOperations = {
            kind: "VariableOperations",
            operations: this.createVariableAssignments(elements),
            operator: "=",
            values: [this.parsePostfixExpression(identifier)],
        };
        while (this.match(Tag.COMMA)) {
            declarations.values.push(this.parseExpression());
        }
        return declarations;
    }
    private parseFunction(elements: String[]) {
        this.advance(); // Skip ASSIGN

        const identifier: Identifier = { kind: "Identifier", name: this.advance().value };

        if (!this.match(Tag.LRP)) {
            return this.parseVariableOperations(identifier, elements);
        }

        return this.parseFuncDec(identifier, elements);
    }
    private handleEmptyFunctionSignature(elements: String[], identifier: Identifier) {
        if (this.match(Tag.LCP)) {
            const body: Statement[] = [];
            while (!this.check(Tag.RCP)) {
                body.push(this.parseStatement());
            }
            if (!this.match(Tag.RCP)) throw new Error("Expected }");
            return {
                kind: "FunctionDeclaration",
                returnTypes: elements,
                identifier,
                parameters: [],
                body,
            } as FunctionDeclaration;
        }
        const call: FunctionCall = { kind: "FunctionCall", identifier, arguments: [] };
        return this.createVariableOperations(elements, call);
    }
    private createVariableOperations(elements: String[], expr: Expression) {
        const declarations: VariableOperations = {
            kind: "VariableOperations",
            operations: this.createVariableAssignments(elements),
            operator: "=",
            values: [this.parsePostfixExpression(expr)],
        };
        while (this.match(Tag.COMMA)) {
            declarations.values.push(this.parseExpression());
        }
        return declarations;
    }
    private handleNonEmptyFunctionSignature(elements: String[], identifier: Identifier) {
        if (!this.check(Tag.STR, Tag.NUM, Tag.BOOL, Tag.ID)) this.error("Expected type");
        let i = 1;
        while (this.peek(i).tag === Tag.LSP && this.peek(i + 1).tag === Tag.RSP) i += 2;
        if (this.peek(i).tag === Tag.ID) {
            return this.parseFunctionDeclarationBody(elements, identifier);
        }
        const call: FunctionCall = { kind: "FunctionCall", identifier, arguments: [] };
        if (!this.check(Tag.RRP)) {
            do {
                call.arguments.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
        }
        return this.createVariableOperations(elements, call);
    }
    private parseFunctionDeclarationBody(elements: String[], identifier: Identifier) {
        const parameters: VariableDeclaration[] = [];
        do {
            let type = this.parseArrayType(this.advance().value);
            parameters.push({
                kind: "VariableDeclaration",
                type,
                identifier: { kind: "Identifier", name: this.advance().value },
            });
        } while (this.match(Tag.COMMA));
        if (!this.match(Tag.RRP)) this.error("Expected )");
        return {
            kind: "FunctionDeclaration",
            returnTypes: elements,
            identifier,
            parameters,
            body: this.parseBlock(),
        } as FunctionDeclaration;
    }
    private parseBuiltInFunctionCall(): FunctionCall {
        const func: Identifier = { kind: "Identifier", name: this.advance().value };
        return this.parseFunctionCall(func);
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
    private parseFuncDec(identifier: Identifier, elements: String[]) {
        if (this.match(Tag.RRP)) {
            return this.handleEmptyFunctionSignature(elements, identifier);
        }

        return this.handleNonEmptyFunctionSignature(elements, identifier);
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
}