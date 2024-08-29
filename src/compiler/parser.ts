import {DayErr} from "../utils/dayErr";
import {
    ArrayElement,
    ArrayNode,
    BinaryExpression,
    BooleanNode, CaseStatement,
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
    NumberNode,
    PrintStatement,
    Program,
    ReadStatement,
    ReturnStatement,
    Statement,
    StringNode,
    SwitchStatement,
    Tag,
    Token,
    UnaryExpression,
    VariableAssignment,
    VariableDeclaration,
    VariableOperations,
    WhileStatement
} from "../data";
import {Location} from "../utils/location";
import assert from "assert";

export class Parser {
    // TODO: null
    private index: number = 0;

    private readonly errors: DayErr[] = [];
    private readonly ast: Program = { kind: "Program", body: [], start: { line: 1, column: 1 }, end: null };

    private static TAGS: Map<Tag, string> = new Map([
        [Tag.EOF, "\'end of file\'"],
        [Tag.PLUS, "\'+\'"],
        [Tag.MINUS, "\'-\'"],
        [Tag.TIMES, "\'*\'"],
        [Tag.DIV, "\'/\'"],
        [Tag.MOD, "\'%\'"],
        [Tag.POW, "\'**\'"],
        [Tag.INT_DIV, "\'//\'"],
        [Tag.INC, "\'++\'"],
        [Tag.DEC, "\'--\'"],
        [Tag.SELF_INC, "\'+=\'"],
        [Tag.SELF_DEC, "\'-=\'"],
        [Tag.AND, "\'&\'"],
        [Tag.OR, "\'|\'"],
        [Tag.NOT, "\'!\'"],
        [Tag.EQ, "\'==\'"],
        [Tag.NE, "\'!=\'"],
        [Tag.GT, "\'>\'"],
        [Tag.LT, "\'<\'"],
        [Tag.GE, "\'>=\'"],
        [Tag.LE, "\'<=\'"],
        [Tag.ASSIGN, "\'=\'"],
        [Tag.LRP, "\'(\'"],
        [Tag.RRP, "\')\'"],
        [Tag.LSP, "\'[\'"],
        [Tag.RSP, "\']\'"],
        [Tag.LCP, "\'{\'"],
        [Tag.RCP, "\'}\'"],
        [Tag.COMMA, "\',\'"],
        [Tag.DOT, "\'.\'"],
        [Tag.QUOTE, "\"'\""],
        [Tag.NUM, "\'num\'"],
        [Tag.STR, "\'str\'"],
        [Tag.BOOL, "\'bool\'"],
        [Tag.ID, "\'identifier\'"],
        [Tag.NUMBER, "\'number\'"],
        [Tag.TEXT, "\'text\'"],
        [Tag.IF, "\'if\'"],
        [Tag.ELSE, "\'else\'"],
        [Tag.WHILE, "\'while\'"],
        [Tag.FOR, "\'for\'"],
        [Tag.RETURN, "\'return\'"],
        [Tag.SWITCH, "\'switch\'"],
        [Tag.CASE, "\'case\'"],
        [Tag.BREAK, "\'break\'"],
        [Tag.DEFAULT, "\'default\'"],
        [Tag.CLASS, "\'class\'"],
        [Tag.THIS, "\'this\'"],
        [Tag.TRUE, "\'true\'"],
        [Tag.FALSE, "\'false\'"],
        [Tag.PRINT, "\'print\'"],
        [Tag.READ, "\'read\'"],
        [Tag.NULL, "\'null\'"],
        [Tag.UNDERSCORE, "\'_\'"],
    ]);
    constructor(private readonly tokens: Token[], private readonly source: string) {}
    parse(): boolean {
        try {
            while (!this.isEOF()) {
                this.ast.body.push(this.parseStatement());
            }
            this.ast.end = this.current().end; // EOF
        } catch (error) {
            if (error instanceof DayErr) {
                return false;
            } else {
                throw error;
            }
        }

        return true;
    }
    private isEOF(): boolean {
        return this.peek() === Tag.EOF;
    }
    private current(): Token {
        return this.tokens[this.index] || this.throwError("Unexpected end of file");
    }
    private previous(): Token {
        return this.tokens[this.index - 1] || this.throwError("Unexpected start of file");
    }
    private peek(ahead = 0): Tag {
        return this.tokens[this.index + ahead].tag || this.throwError("Unexpected end of file");
    }
    private advance(): Token {
        return this.tokens[this.index++] || this.throwError("Unexpected end of file");
    }
    private match(expected: Tag): boolean {
        if (this.isEOF() || this.peek() !== expected) return false;
        this.advance();
        return true;
    }
    private expect(expected: Tag, message?: string): Token {
        if (this.isEOF() || this.peek() !== expected) {
            this.throwExpectedError(message ? message : `Expected ${Parser.TAGS.get(expected)}`,this.index - 1);
        }
        return this.advance();
    }
    private check(...tags: Tag[]): boolean {
        return !this.isEOF() && tags.includes(this.peek());
    }
    private clamp(index: number): number {
        return Math.max(0, Math.min(index, this.tokens.length - 1));
    }
    // private setLocation(node: ASTNode, start_token: Token, end_token: Token): void {
    //     node.start = { line: start_token.line, column: start_token.start };
    //     node.end = { line: end_token.line, column: end_token.end };
    // }
    private throwError(message: string, token_index?: number): never {
        if (!token_index) token_index = this.index;
        else token_index = this.clamp(token_index);
        const token = this.tokens[token_index];
        const error = new DayErr(message, "Syntax Error", token.start.line, token.start.column, token.end.column, this.source.split('\n')[token.start.line - 1]);
        this.errors.push(error);
        this.advance();
        // TODO shouldn't be thrown here
        throw error;
    }
    private throwExpectedError(message: string, token_index: number = this.index): never {
        const token = this.tokens[token_index];
        const error = new DayErr(message, "Syntax Error", token.start.line, token.start.column, token.end.column + 1, this.source.split('\n')[token.start.line - 1]);
        this.errors.push(error);
        this.advance();
        // TODO shouldn't be thrown here
        throw error;
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

        this.throwError("Unexpected statement", this.index);
    }
    private parseDeclaration(elements: Identifier[]): Statement {
        if (this.check(Tag.STR, Tag.NUM, Tag.BOOL) || (this.check(Tag.ID) && this.peek(1) === Tag.LSP && this.peek(2) === Tag.RSP)) {
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

        return this.throwError("Unexpected character", this.index - 1);
    }
    private parseTypedDeclaration(elements: Identifier[]): Statement {
        const type = this.parseType();

        if (this.check(Tag.ID)) {
            const assignments: (VariableAssignment | VariableDeclaration)[] = this.createVariableAssignments(elements);
            const id = this.advance();
            assignments.push({
                kind: "VariableDeclaration",
                type: type.value,
                identifier: { kind: "Identifier", name: id.value, start: id.start, end: id.end },
                start: type.start,
                end: id.end
            });
            return this.parseVariableDeclaration(assignments);
        }

        if (this.check(Tag.COMMA, Tag.ASSIGN)) {
            return this.parseFunctionDeclaration(elements as Token[]);
        }

        this.throwError("Unexpected character", this.index - 1);
    }
    private parseType(): Token {
        let type = this.advance();
        while (this.match(Tag.LSP)) {
            type.value += "[]";
            type.end = this.expect(Tag.RSP).end;
        }
        return type;
    }
    private parseIdentifierDeclaration(elements: Identifier[]): Statement {
        const op: Expression = this.parseExpression()
        if (op.kind === "MemberFunctionCall" || op.kind === "UnaryExpression" || op.kind === "FunctionCall") {
            if (elements.length !== 0) this.throwError("Cannot call a function inside a declaration", this.index - 3);
            return op;
        }

        if (op.kind === "MemberAttribute" || op.kind === "ArrayElement") {
            const assignments: (VariableAssignment | VariableDeclaration)[] = this.createVariableAssignments(elements);
            assignments.push({ kind: "VariableAssignment", element: op, start: op.start, end: op.end });
            return this.parseVariableDeclaration(assignments);
        }

        if (op.kind === "Identifier") {
            if (this.check(Tag.ID)) {
                const type = (op as Identifier).name;
                const assignments: (VariableAssignment | VariableDeclaration)[] = this.createVariableAssignments(elements);
                const id = this.advance();
                assignments.push({
                    kind: "VariableDeclaration",
                    type,
                    identifier: { kind: "Identifier", name: id.value, start: id.start, end: id.end },
                    start: op.start,
                    end: id.end
                });
                return this.parseVariableDeclaration(assignments);
            }

            if (this.check(Tag.COMMA, Tag.ASSIGN, Tag.SELF_INC, Tag.SELF_DEC)) {
                if (this.check(Tag.COMMA)) this.advance();
                elements.push(op as Identifier);
                return this.parseDeclaration(elements);
            }

            this.throwError("Unexpected identifier", this.index - 2);
        }

        this.throwError("Unexpected expression");
    }
    private createVariableAssignments(identifiers: Identifier[]): VariableAssignment[] {
        const assignments: VariableAssignment[] = [];
        for (const id of identifiers) {
            const assignment: VariableAssignment = {
                kind: "VariableAssignment",
                element: id,
                start: id.start,
                end: id.end
            };
            assignments.push(assignment);
        }
        return assignments;
    }
    private parseVariableDeclaration(operations: (VariableDeclaration | VariableAssignment)[]): VariableOperations {
        const declarations: VariableOperations = {
            kind: "VariableOperations",
            operations: operations.concat(this.parseVariableOperations()),
            operator: null,
            values: [],
            start: operations[0].start,
            end: operations[operations.length - 1].end
        };

        // check if it is a declaration or an assignment
        if (this.check(Tag.ASSIGN, Tag.SELF_INC, Tag.SELF_DEC)) {
            declarations.operator = this.advance().tag;
            do {
                declarations.values.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
            declarations.end = declarations.values[declarations.values.length - 1].end
        } else {
            // if it is a declaration it can't have any assignment inside
            if (declarations.operations.some(op => op.kind === "VariableAssignment")) {
                this.throwError("Variable declaration cannot have assignments");
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
            else if (this.check(Tag.UNDERSCORE)) {
                const id = this.advance();
                declaration = {
                    kind: "VariableAssignment",
                    element: { kind: "Identifier", name: id.value, start: id.start, end: id.end } as Identifier,
                    start: id.start,
                    end: id.end
                };
            }
            else if (this.check(Tag.ID)) {
                if (this.peek(1) === Tag.LSP && this.peek(2) === Tag.RSP) declaration = this.parseTypedVariableDeclaration();
                else {
                    const token = this.advance();
                    const op = this.parsePostfixExpression({ kind: "Identifier", name: token.value, start: token.start, end: token.end } as Identifier);
                    if (op.kind === "Identifier") {
                        if (this.check(Tag.ID)) {
                            const type = (op as Identifier);
                            const id = this.advance();
                            const identifier: Identifier = { kind: "Identifier", name: id.value, start: id.start, end: id.end };
                            declaration = { kind: "VariableDeclaration", type: type.name, identifier, start: type.start, end: id.end };
                        }
                        else declaration = { kind: "VariableAssignment", element: op, start: op.start, end: op.end };
                    }
                    else if (op.kind === "MemberAttribute" || op.kind === "ArrayElement") {
                        declaration = { kind: "VariableAssignment", element: op, start: op.start, end: op.end };
                    }
                    else this.throwError("Unexpected token");
                }
            } else this.throwError("Unexpected token");
            operations.push(declaration);
        }
        return operations
    }
    private parseTypedVariableDeclaration(): VariableDeclaration {
        const type = this.parseType();
        const id = this.advance();
        const identifier: Identifier = {
            kind: "Identifier",
            name: id.value,
            start: id.start,
            end: id.end
        };
        return { kind: "VariableDeclaration", type: type.value, identifier, start: type.start, end: id.end };
    }
    private parseFunctionDeclaration(types: Token[]): FunctionDeclaration {
        const returnTypes = types.concat(this.parseReturnTypes());
        const declaration: FunctionDeclaration = {
            kind: "FunctionDeclaration",
            returnTypes: returnTypes.map(type => type.value),
            identifier: null,
            parameters: [],
            body: [],
            start: returnTypes[0].start,
            end: null
        };

        this.expect(Tag.ASSIGN);

        const id = this.expect(Tag.ID, "Expected function name")
        declaration.identifier = {
            kind: "Identifier",
            name: id.value,
            start: id.start,
            end: id.end
        };
        if (!this.match(Tag.RRP)) {
            declaration.parameters = this.parseParameters();
        }
        declaration.body = this.parseBlock();
        declaration.end = this.previous().end; // }

        return declaration;
    }
    private parseReturnTypes(): Token[] {
        const returnTypes: Token[] = [];
        while (this.match(Tag.COMMA)) {
            returnTypes.push(this.parseType())
        }
        return returnTypes;
    }
    private parseUnderscoreDeclaration(elements: Identifier[]) {
        const id = this.advance();
        elements.push({ kind: "Identifier", name: id.value, start: id.start, end: id.end });
        if (this.check(Tag.COMMA)) {
            return this.parseVariableDeclaration(this.createVariableAssignments(elements));
        }

        if (this.check(Tag.ASSIGN)) {
            if (elements.length !== 1) this.throwError("Void function cannot have multiple return types");
            return this.parseFunctionDeclaration(elements as Token[]);
        }

        return this.throwError("Unexpected token");
    }
    private parseAssignOperator(elements: Identifier[]): VariableOperations | FunctionDeclaration {
        if (!(this.peek(1) === Tag.ID || this.peek(1) === Tag.UNDERSCORE)) return this.parseVariableDeclaration(this.createVariableAssignments(elements))

        this.advance() // Skip ASSIGN

        if (this.isFunctionDeclaration()) {
            return {
                kind: "FunctionDeclaration",
                returnTypes: elements.map(el => el.name),
                identifier: {kind: "Identifier", name: this.current().value, start: this.current().start, end: this.advance().end } as Identifier,
                parameters: this.parseParameters(),
                body: this.parseBlock(),
                start: elements[0].start,
                end: this.previous().end // }
            };
        }

        const declarations: VariableOperations = {
            kind: "VariableOperations",
            operations: this.createVariableAssignments(elements),
            operator: Tag.ASSIGN,
            values: [this.parseExpression()],
            start: elements[0].start,
            end: null
        };
        declarations.end = declarations.values[declarations.values.length - 1].end;
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
                base = this.parseArrayElement(base);
            } else if (this.match(Tag.DOT)) {
                const id = this.advance()
                const identifier: Identifier = {
                    kind: "Identifier",
                    name: id.value,
                    start: id.start,
                    end: id.end
                };
                if (this.check(Tag.LRP)) {
                    const func = this.parseFunctionCall(identifier);
                    base = {
                        kind: "MemberFunctionCall",
                        member: base,
                        function: func,
                        start: base.start,
                        end: func.end
                    } as MemberFunctionCall;
                } else {
                    base = {
                        kind: "MemberAttribute",
                        member: base,
                        attribute: identifier,
                        start: base.start,
                        end: identifier.end
                    } as MemberAttribute;
                }
            } else if (this.check(Tag.INC, Tag.DEC)) {
                const operator = this.advance();
                base = {
                    kind: "UnaryExpression",
                    operator: operator.tag,
                    base,
                    start: base.start,
                    end: operator.end
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
            start: identifier.start,
            end: { line: 0, column: 0 },
        };
        this.match(Tag.LRP);
        if (!this.match(Tag.RRP)) {
            do {
                call.arguments.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
            this.expect(Tag.RRP);
        }
        call.end = this.previous().end;
        return call;
    }
    private parseParameters(): VariableDeclaration[] {
        this.expect(Tag.LRP);
        const parameters: VariableDeclaration[] = [];
        if (!this.match(Tag.RRP)) {
            do {
                const type = this.parseType();
                const id = this.expect(Tag.ID, "Expected parameter name");
                parameters.push({
                    kind: "VariableDeclaration",
                    type: type.value,
                    identifier: { kind: "Identifier", name: id.value, start: id.start, end: id.end },
                    start: type.start,
                    end: id.end
                });
            } while (this.match(Tag.COMMA));
            this.expect(Tag.RRP);
        }
        return parameters;
    }
    private parseArrayElement(base: Expression): ArrayElement {
        const element: ArrayElement = {
            kind: "ArrayElement",
            array: base,
            indexes: [],
            start: base.start,
            end: null,
        };
        while (this.match(Tag.LSP)) {
            element.indexes.push(this.parseExpression());
            element.end = this.expect(Tag.RSP).end;
        }
        assert(element.end); // should always be set
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
    // TODO: check if the iterative method works cause it's just better
    // private parseBinaryExpression(precedence: number): Expression {
    //     let left: Expression = this.parseUnaryExpression();
    //     let operatorStack: Tag[] = [];
    //     let rightStack: Expression[] = [];
    //
    //     while (true) {
    //         const operator = this.peek();
    //         const newPrecedence = this.getBinaryPrecedence(operator);
    //         if (newPrecedence <= precedence) {
    //             break;
    //         }
    //
    //         this.advance();
    //         const right = this.parseUnaryExpression();
    //
    //         while (operatorStack.length > 0 && this.getBinaryPrecedence(operatorStack[operatorStack.length - 1]) >= newPrecedence) {
    //             const prevRight = rightStack.pop()!;
    //             const prevOperator = operatorStack.pop()!;
    //             left = this.createBinaryOrLogicalExpression(left, prevOperator, prevRight);
    //         }
    //
    //         operatorStack.push(operator);
    //         rightStack.push(right);
    //     }
    //
    //     while (operatorStack.length > 0) {
    //         const right = rightStack.pop()!;
    //         const operator = operatorStack.pop()!;
    //         left = this.createBinaryOrLogicalExpression(left, operator, right);
    //     }
    //
    //     return left;
    // }
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
    private createBinaryOrLogicalExpression(left: Expression, operator: Tag, right: Expression): BinaryExpression | LogicalExpression {
        if (this.isLogicalOperator(operator))
            return {
                kind: "LogicalExpression",
                left,
                operator: operator,
                right,
                start: left.start,
                end: right.end,
            };
        return {
            kind: "BinaryExpression",
            left,
            operator: operator,
            right,
            start: left.start,
            end: right.end,
        };
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
            const op = this.advance();
            const base = this.parseUnaryExpression();

            return { kind: "UnaryExpression", operator: op.tag, base, start: op.start, end: base.end } as UnaryExpression;
        }
        return this.parsePrimaryExpression();
    }
    // TODO: check if the iterative method works cause it's just better
    // private parseUnaryExpression(): Expression {
    //     let operators: Tag[] = [];
    //     while (this.check(Tag.MINUS, Tag.NOT)) {
    //         operators.push(this.advance().tag);
    //     }
    //     let expr = this.parsePrimaryExpression();
    //     while (operators.length > 0) {
    //         const op = operators.pop()!;
    //         expr = { kind: "UnaryExpression", operator: op, base: expr, start: expr.start, end: expr.end } as UnaryExpression;
    //     }
    //     return expr;
    // }
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
            this.throwError("Unexpected token");
        }

        return this.parsePostfixExpression(expr);
    }
    private parseIdentifierOrFunctionCall(): Expression {
        const id = this.advance();
        const identifier: Identifier = {
            kind: "Identifier",
            name: id.value,
            start: id.start,
            end: id.end
        };
        if (this.check(Tag.LRP)) {
            return this.parseFunctionCall(identifier);
        }
        return identifier;
    }
    private parseNumberLiteral(): NumberNode {
        const literal = this.advance();
        return { kind: "Number", value: Number(literal.value), start: literal.start, end: literal.end };
    }
    private parseStringLiteral(): StringNode {
        const literal = this.advance();
        return { kind: "String", value: String(literal.value), start: literal.start, end: literal.end };
    }
    private parseBooleanLiteral(): BooleanNode {
        const literal = this.advance();
        return { kind: "Boolean", value: literal.value === "true", start: literal.start, end: literal.end };
    }
    private parseFString(): FString {
        const string: FString = { kind: "F-String", value: [], start: this.previous().start, end: null };
        while (!this.match(Tag.QUOTE)) {
            if (this.match(Tag.LCP)) {
                string.value.push(this.parseExpression());
                this.expect(Tag.RCP);
            } else if (this.check(Tag.TEXT)) {
                string.value.push(this.parseStringLiteral());
            } else {
                this.throwError("Unexpected token");
            }
        }
        string.end = this.previous().end; // '
        return string;
    }
    private parseArray(): ArrayNode {
        const start = this.previous().start; // [
        const elements: Expression[] = [];
        if (!this.match(Tag.RSP)) {
            do {
                elements.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
            this.expect(Tag.RSP);
        }
        
        return { kind: "Array", elements, start, end: this.previous().end }; // ]
    }
    private parseParenthesizeExpression(): Expression {
        const expr = this.parseExpression();
        this.expect(Tag.RRP);
        return expr;
    }
    private parseBuiltInFunctionCall(): Statement {
        const token = this.advance();
        if (token.tag === Tag.PRINT) {
            return this.parsePrintStatement(token.start);
        }
        if (token.tag === Tag.READ) {
            return this.parseReadStatement(token.start);
        }
        return this.parseReturnStatement(token.start);
    }
    private parsePrintStatement(start: Location): PrintStatement {
        const statement: PrintStatement = {
            kind: "PrintStatement",
            arguments: [],
            start,
            end: null,
        };
        this.expect(Tag.LRP);
        if (!this.match(Tag.RRP)) {
            do {
                statement.arguments.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
            this.expect(Tag.RRP);
        }
        statement.end = this.previous().end;
        return statement;
    }
    private parseReadStatement(start: Location): ReadStatement {
        const statement: ReadStatement = {
            kind: "ReadStatement",
            arguments: [],
            start,
            end: null,
        };
        this.match(Tag.LRP);
        do {
            if (!this.check(Tag.ID)) this.throwError("Expected identifier");
            const id = this.advance();
            statement.arguments.push(this.parsePostfixExpression({ kind: "Identifier", name: id.value, start: id.start, end: id.end } as Identifier));
        } while (this.match(Tag.COMMA));
        statement.end = this.expect(Tag.RRP).end;
        return statement;
    }
    private parseReturnStatement(start: Location): ReturnStatement {
        const statement: ReturnStatement = {
            kind: "ReturnStatement",
            values: [],
            start,
            end: null,
        };
        this.match(Tag.LRP);
        if (!this.match(Tag.RRP)) {
            do {
                statement.values.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
            this.expect(Tag.RRP);
        }
        statement.end = this.previous().end;
        return statement
    }
    // private parseIfStatement(): IfStatement {
    //     const start = this.previous().start; // IF
    //     const condition = this.parseCondition();
    //     const body = this.parseBlock();
    //     let end = this.previous().end; // }
    //
    //     let elseBody: Statement[] | null = null;
    //     if (this.match(Tag.ELSE)) {
    //         elseBody = this.parseBlock();
    //         end = this.previous().end; // }
    //     }
    //    
    //     return { kind: "IfStatement", condition, body, elseBody, start, end };
    // }
    private parseIfStatement(): IfStatement {
        const start = this.previous().start; // IF
        return {
            kind: "IfStatement",
            condition: this.parseCondition(),
            body: this.parseBlock(),
            elseBody: this.match(Tag.ELSE) ? this.parseBlock() : [],
            start,
            end: this.previous().end,
        }
    }
    private parseWhileStatement(): WhileStatement {
        const start = this.previous().start; // WHILE
        return {
            kind: "WhileStatement",
            condition: this.parseCondition(),
            body: this.parseBlock(),
            start,
            end: this.previous().end,
        }
    }
    private parseForStatement(): ForStatement {
        const start = this.previous().start; // FOR
        this.expect(Tag.LRP);
        
        const id = this.expect(Tag.ID, "Expected iterator");
        const iterator : Identifier = { kind: "Identifier", name: id.value, start: id.start, end: id.end };
        this.expect(Tag.COMMA);

        const limit = this.parseExpression();
        this.expect(Tag.RRP);

        const body = this.parseBlock();

        return { kind: "ForStatement", iterator, limit, body, start, end: this.previous().end }; // }
    }
    private parseSwitchStatement(): SwitchStatement {
        const start = this.previous().start; // SWITCH
        const statement: SwitchStatement = {
            kind: "SwitchStatement",
            expression: this.parseExpression(),
            cases: [],
            default: [],
            start,
            end: null,
        };

        this.expect(Tag.LCP);
        if (this.match(Tag.RCP)) {
            statement.end = this.previous().end; // }
            return statement;
        }

        while (this.match(Tag.CASE)) {
            const case_start = this.previous().start; // CASE
            const values = [];
            do {
                values.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
            const body = this.parseBlock();
            statement.cases.push({ kind: "CaseStatement", values, body, start: case_start, end: this.previous().end }); // }
        }

        while (!this.match(Tag.RCP)) {
            statement.default.push(this.parseStatement());
        }
        statement.end = this.previous().end; // }
        
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
        const start = this.previous().start; // CLASS
        const id = this.expect(Tag.ID, "Expected class name");
        const identifier: Identifier = {
            kind: "Identifier",
            name: id.value,
            start: id.start,
            end: id.end
        };
        const declaration: ClassDeclaration = {
            kind: "ClassDeclaration",
            identifier,
            body: [],
            start,
            end: null,
        };

        this.expect(Tag.ASSIGN);
        declaration.body = this.parseBlock();
        declaration.end = this.previous().end; // }

        return declaration;
    }
    public getAST(): Program {
        return this.ast;
    }
    public getErrors(): DayErr[] {
        return this.errors;
    }
}