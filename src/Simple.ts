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
        if (this.check(Tag.SWITCH)) {
            // TODO
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
    private parseDeclaration(elements: Identifier[]): Statement {
        if (this.check(Tag.STR, Tag.NUM, Tag.BOOL) || (this.check(Tag.ID) && this.peek(1).tag === Tag.LSP && this.peek(1).tag === Tag.RSP)) {
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
            if (!this.match(Tag.RSP)) {
                throw new Error("Expected ]");
            }
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
            declarations.operator = this.advance().value;
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
                if (this.peek(1).tag === Tag.LSP && this.peek(2).tag === Tag.RSP) declaration = this.parseTypedVariableDeclaration();
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

        if (!this.match(Tag.ASSIGN)) {
            this.error("Expected assignment");
        }

        if (!this.check(Tag.ID)) {
            this.error("Expected identifier");
        }
        declaration.identifier = {
            kind: "Identifier",
            name: this.advance().value,
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
        if (!(this.peek(1).tag === Tag.ID || this.peek(1).tag === Tag.UNDERSCORE)) return this.parseVariableDeclaration(this.createVariableAssignments(elements))

        this.advance() // Skip ASSIGN

        if (this.isFunctionDeclaration()) return {kind: "FunctionDeclaration", returnTypes: elements.map(el => el.name), identifier: { kind: "Identifier", name: this.advance().value }, parameters: this.parseParameters(), body: this.parseBlock() } as FunctionDeclaration;

        const declarations: VariableOperations = {
            kind: "VariableOperations",
            operations: this.createVariableAssignments(elements),
            operator: "=",
            values: [this.parseExpression()],
        };
        while (this.match(Tag.COMMA)) {
            declarations.values.push(this.parseExpression());
        }
        return declarations;
    }
    private isFunctionDeclaration(): boolean {
        return (this.peek(1).tag === Tag.LRP && ((this.peek(2).tag === Tag.RRP && this.peek(3).tag === Tag.LCP) || ([Tag.STR, Tag.NUM, Tag.BOOL] as Tag[]).includes(this.peek(2).tag) || (this.peek(2).tag === Tag.ID && (this.peek(3).tag === Tag.ID || (this.peek(3).tag === Tag.LSP && this.peek(4).tag === Tag.RSP)))))
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
    private parseFunctionCall(identifier: Identifier): FunctionCall {
        const call: FunctionCall = {
            kind: "FunctionCall",
            identifier,
            arguments: [],
        };
        this.advance(); // Skip LRP
        if (!this.match(Tag.RRP)) {
            do {
                call.arguments.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
            if (!this.match(Tag.RRP)) this.error("Expected )");
        }
        return call;
    }
    private parseParameters(): VariableDeclaration[] {
        if (!this.match(Tag.LRP)) {
            this.error("Expected (");
        }
        const parameters: VariableDeclaration[] = [];
        if (!this.match(Tag.RRP)) {
            do {
                const type = this.parseType();
                if (!this.check(Tag.ID)) {
                    this.error("Expected identifier");
                }
                parameters.push({
                    kind: "VariableDeclaration",
                    type,
                    identifier: { kind: "Identifier", name: this.advance().value },
                });
            } while (this.match(Tag.COMMA));
            if (!this.match(Tag.RRP)) this.error("Expected )");
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
            if (!this.match(Tag.RSP)) this.error("Expected ]");
        }
        return element;
    }
    private parseExpression(): Expression {
        // TODO decide how operator are handled
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
        } else if (this.check(Tag.LRP)) {
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
    private parseParenthesizeExpression(): Expression {
        this.advance(); // Skip opening parenthesis
        const expr = this.parseExpression();
        if (!this.match(Tag.RRP)) this.error("Expected )");
        return expr;
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

        const iterator : Identifier = { kind: "Identifier", name: this.advance().value };
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
        if (!this.match(Tag.LCP)) this.error("Expected {");

        const body: Statement[] = [];
        while (!this.check(Tag.RCP)) {
            body.push(this.parseStatement());
        }

        if (!this.match(Tag.RCP)) this.error("Expected }");

        return body;
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