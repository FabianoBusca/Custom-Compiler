import {DayErr, Location} from "../utils";
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
    Token, Type,
    UnaryExpression,
    VariableAssignment,
    VariableDeclaration,
    VariableOperations,
    WhileStatement
} from "../data";
import assert from "assert";
import {ASTFactory} from "../utils/ASTFactory";

export class Parser {
    // TODO: null
    private index: number = 0;

    private readonly errors: DayErr[] = [];
    private readonly ast: Program = ASTFactory.createProgram([], { line: 1, column: 1 }, null);

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
            if (this.ast.body.length > 0) this.ast.start = this.ast.body[0].start;
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
        return this.tokens[this.index] || ((): never => { throw new Error("Unexpected end of file"); })();
    }
    private previous(): Token {
        return this.tokens[this.index - 1] || ((): never => { throw new Error("Unexpected start of file"); })();
    }
    private peek(ahead = 0): Tag {
        return (this.tokens[this.index + ahead].tag !== undefined) ? this.tokens[this.index + ahead].tag : ((): never => { throw new Error("Unexpected end of file"); })();
    }
    private advance(): Token {
        return this.tokens[this.index++] || ((): never => { throw new Error("Unexpected end of file"); })();
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
            assignments.push(ASTFactory.createVariableDeclaration(type, ASTFactory.createIdentifier(id)));
            return this.parseVariableDeclaration(assignments);
        }

        if (this.check(Tag.COMMA, Tag.ASSIGN)) {
            const types = elements.map(el => ASTFactory.createType(el.name, 0, el.start, el.end));
            types.push(type);
            return this.parseFunctionDeclaration(types);
        }

        this.throwError("Unexpected character", this.index - 1);
    }
    private parseType(): Type {
        const token = this.advance();
        let depth = 0;
        let end = token.end;
        while (this.match(Tag.LSP)) {
            depth++;
            end = this.expect(Tag.RSP).end;
        }
        return ASTFactory.createType(token.value, depth, token.start, end);
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
                const type = ASTFactory.createType((op as Identifier).name, 0, op.start, op.end);
                const assignments: (VariableAssignment | VariableDeclaration)[] = this.createVariableAssignments(elements);
                const id = this.advance();
                assignments.push(ASTFactory.createVariableDeclaration(type, ASTFactory.createIdentifier(id)));
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
            const assignment: VariableAssignment = ASTFactory.createVariableAssignment(id);
            assignments.push(assignment);
        }
        return assignments;
    }
    private parseVariableDeclaration(operations: (VariableDeclaration | VariableAssignment)[]): VariableOperations {
        const declarations = ASTFactory.createVariableOperations(operations.concat(this.parseVariableOperations()), null, [], operations[0].start, operations[operations.length - 1].end);

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
                declaration = ASTFactory.createVariableAssignment(ASTFactory.createIdentifier(id));
            }
            else if (this.check(Tag.ID)) {
                if (this.peek(1) === Tag.LSP && this.peek(2) === Tag.RSP) declaration = this.parseTypedVariableDeclaration();
                else {
                    const op = this.parsePostfixExpression(ASTFactory.createIdentifier(this.advance()));
                    if (op.kind === "Identifier") {
                        if (this.check(Tag.ID)) {
                            const type = ASTFactory.createType((op as Identifier).name, 0, op.start, op.end);
                            const id = this.advance();
                            const identifier = ASTFactory.createIdentifier(id);
                            declaration = ASTFactory.createVariableDeclaration(type, identifier);
                        }
                        else declaration = ASTFactory.createVariableAssignment(op);
                    }
                    else if (op.kind === "MemberAttribute" || op.kind === "ArrayElement") {
                        declaration = ASTFactory.createVariableAssignment(op);
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
        const identifier = ASTFactory.createIdentifier(id);
        return ASTFactory.createVariableDeclaration(type, identifier);
    }
    private parseFunctionDeclaration(types: Type[]): FunctionDeclaration {
        types = types.concat(this.parseReturnTypes());
        const declaration = ASTFactory.createFunctionDeclaration(types, null, [], [], types[0].start, null);

        this.expect(Tag.ASSIGN);

        const id = this.expect(Tag.ID, "Expected function name")
        declaration.identifier = ASTFactory.createIdentifier(id);
        if (!this.match(Tag.RRP)) {
            declaration.parameters = this.parseParameters();
        }
        declaration.body = this.parseBlock();
        declaration.end = this.previous().end; // }

        return declaration;
    }
    private parseReturnTypes(): Type[] {
        const returnTypes = [];
        while (this.match(Tag.COMMA)) {
            returnTypes.push(this.parseType())
        }
        return returnTypes;
    }
    private parseUnderscoreDeclaration(elements: Identifier[]) {
        elements.push(ASTFactory.createIdentifier(this.advance()));
        if (this.check(Tag.COMMA)) {
            return this.parseVariableDeclaration(this.createVariableAssignments(elements));
        }

        if (this.check(Tag.ASSIGN)) {
            if (elements.length !== 1) this.throwError("Void function cannot have multiple return types");
            return this.parseFunctionDeclaration(elements.map(el => ASTFactory.createType(el.name, 0, el.start, el.end)));
        }

        return this.throwError("Unexpected token");
    }
    private parseAssignOperator(elements: Identifier[]): VariableOperations | FunctionDeclaration {
        if (!(this.peek(1) === Tag.ID || this.peek(1) === Tag.UNDERSCORE)) return this.parseVariableDeclaration(this.createVariableAssignments(elements))

        this.advance() // Skip ASSIGN

        if (this.isFunctionDeclaration()) {
            return ASTFactory.createFunctionDeclaration(elements.map(el => ASTFactory.createType(el.name, 0, el.start, el.end)), ASTFactory.createIdentifier(this.advance()), this.parseParameters(), this.parseBlock(), elements[0].start, this.previous().end); // }
        }
        
        const declarations = ASTFactory.createVariableOperations(this.createVariableAssignments(elements), Tag.ASSIGN, [this.parseExpression()], elements[0].start, elements[0].start);
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
                const identifier = ASTFactory.createIdentifier(id);
                if (this.check(Tag.LRP)) {
                    const func = this.parseFunctionCall(identifier);
                    base = ASTFactory.createMemberFunctionCall(base as Identifier, func);
                } else {
                    base = ASTFactory.createMemberAttribute(base as Identifier, identifier);
                }
            } else if (this.check(Tag.INC, Tag.DEC)) {
                const operator = this.advance();
                base = ASTFactory.createUnaryExpression(operator.tag, base, base.start, operator.end);
                break;
            } else {
                break;
            }
        }
        return base;
    }
    private parseFunctionCall(identifier: Identifier): FunctionCall {
        const call = ASTFactory.createFunctionCall(identifier, [], identifier.start, null);
        this.match(Tag.LRP);
        if (!this.match(Tag.RRP)) {
            do {
                call.arguments.push(this.parseExpression());
            } while (this.match(Tag.COMMA));
            this.expect(Tag.RRP);
        }
        call.end = this.previous().end; // )
        return call;
    }
    private parseParameters(): VariableDeclaration[] {
        this.expect(Tag.LRP);
        const parameters: VariableDeclaration[] = [];
        if (!this.match(Tag.RRP)) {
            do {
                const type = this.parseType();
                const id = this.expect(Tag.ID, "Expected parameter name");
                parameters.push(ASTFactory.createVariableDeclaration(type, ASTFactory.createIdentifier(id)));
            } while (this.match(Tag.COMMA));
            this.expect(Tag.RRP);
        }
        return parameters;
    }
    private parseArrayElement(base: Expression): ArrayElement {
        const element = ASTFactory.createArrayElement(base, [], base.start, null);
        this.advance(); // [
        do {
            element.indexes.push(this.parseExpression());
            element.end = this.expect(Tag.RSP).end;
        } while (this.match(Tag.LSP))

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
            return ASTFactory.createLogicalExpression(left, operator, right);
        return ASTFactory.createBinaryExpression(left, operator, right);
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

            return ASTFactory.createUnaryExpression(op.tag, base, op.start, base.end);
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
        const identifier = ASTFactory.createIdentifier(id);
        if (this.check(Tag.LRP)) {
            return this.parseFunctionCall(identifier);
        }
        return identifier;
    }
    private parseNumberLiteral(): NumberNode {
        return ASTFactory.createNumberNode(this.advance());
    }
    private parseStringLiteral(): StringNode {
        return ASTFactory.createStringNode(this.advance());
    }
    private parseBooleanLiteral(): BooleanNode {
        return ASTFactory.createBooleanNode(this.advance());
    }
    private parseFString(): FString {
        const string: FString = ASTFactory.createFString([], this.previous().start, null); // '
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
        
        return ASTFactory.createArrayNode(elements, start, this.previous().end); // ]
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
        const statement = ASTFactory.createPrintStatement([], start, null);
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
        // TODO: declaration inside read statement?
        const statement = ASTFactory.createReadStatement([], start, null);
        this.match(Tag.LRP);
        do {
            const expr = this.parseExpression();
            if (expr.kind === "FunctionCall" || expr.kind === "MemberFunctionCall") this.throwError("Cannot call a function inside a read statement");
            statement.arguments.push(expr);
        } while (this.match(Tag.COMMA));
        statement.end = this.expect(Tag.RRP).end;
        return statement;
    }
    private parseReturnStatement(start: Location): ReturnStatement {
        const statement = ASTFactory.createReturnStatement([], start, null);
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
        return ASTFactory.createIfStatement(this.parseCondition(), this.parseBlock(), this.match(Tag.ELSE) ? this.parseBlock() : [], start, this.previous().end);
    }
    private parseWhileStatement(): WhileStatement {
        const start = this.previous().start; // WHILE
        return ASTFactory.createWhileStatement(this.parseCondition(), this.parseBlock(), start, this.previous().end);
    }
    private parseForStatement(): ForStatement {
        const start = this.previous().start; // FOR
        this.expect(Tag.LRP);
        
        const id = this.expect(Tag.ID, "Expected iterator");
        const iterator : Identifier = ASTFactory.createIdentifier(id);
        this.expect(Tag.COMMA);

        const limit = this.parseExpression();
        this.expect(Tag.RRP);

        const body = this.parseBlock();

        return ASTFactory.createForStatement(iterator, limit, body, start, this.previous().end); // }
    }
    private parseSwitchStatement(): SwitchStatement {
        const start = this.previous().start; // SWITCH
        const statement = ASTFactory.createSwitchStatement(this.parseExpression(), [], [], start, null);

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
            statement.cases.push(ASTFactory.createCaseStatement(values, body, case_start, this.previous().end)); // }
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
        const identifier = ASTFactory.createIdentifier(id);
        const declaration: ClassDeclaration = ASTFactory.createClassDeclaration(identifier, [], start, null);

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