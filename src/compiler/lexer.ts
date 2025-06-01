import {DayErr} from "@src/utils";
import {Tag, Token} from "@src/data";

export class Lexer {
    private readonly source: string;
    private position: number = 0;
    private isString: boolean = false;
    private line: number = 1;
    private column: number = 1;

    private readonly errors: DayErr[] = [];
    private readonly tokens: Token[] = [];

    private static KEYWORDS: Map<string, Tag> = new Map([
        ['if', Tag.IF], ['else', Tag.ELSE], ['while', Tag.WHILE],
        ['for', Tag.FOR], ['return', Tag.RETURN], ['switch', Tag.SWITCH],
        ['case', Tag.CASE], ['break', Tag.BREAK], ['default', Tag.DEFAULT],
        ['class', Tag.CLASS], ['this', Tag.THIS], ['true', Tag.TRUE],
        ['false', Tag.FALSE], ['print', Tag.PRINT], ['read', Tag.READ],
        ['null', Tag.NULL], ['num', Tag.NUM], ['str', Tag.STR],
        ['bool', Tag.BOOL], ['_', Tag.UNDERSCORE]
    ]);

    constructor(source: string) {
        this.source = source;
    }

    tokenize(): boolean {
        try {
            this.lexProgram();
        } catch (error) {
            if (error instanceof DayErr) {
                return false;
            }
            throw error;
        }

        this.addToken(Tag.EOF, this.column, '');
        return true;
    }

    private addToken(tag: Tag, start_column: number, value: string = '', end_column: number = this.column): void {
        this.tokens.push({
            tag,
            value,
            start: {line: this.line, column: start_column},
            end: {line: this.line, column: end_column}
        });
    }

    private advance(): string {
        this.column++;
        return this.source[this.position++];
    }

    private peek(): string {
        return this.source[this.position];
    }

    private peekNext(): string {
        return this.position + 1 >= this.source.length ? '\0' : this.source[this.position + 1];
    }

    private isEOF(): boolean {
        return this.position >= this.source.length;
    }

    private match(expected: string): boolean {
        if (this.isEOF() || this.source[this.position] !== expected) return false;
        this.position++;
        this.column++;
        return true;
    }

    private skipWhitespace(): void {
        while (!this.isEOF()) {
            const char = this.peek();
            switch (char) {
                case ' ':
                case '\r':
                case '\t':
                    this.advance();
                    break;
                case '\n':
                    this.line++;
                    this.column = 0;
                    this.advance();
                    break;
                default:
                    return;
            }
        }
    }

    private isDigit(char: string): boolean {
        return char >= '0' && char <= '9';
    }

    private isAlpha(char: string): boolean {
        return (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z') ||
            char === '_';
    }

    private isAlphaNumeric(char: string): boolean {
        return this.isAlpha(char) || this.isDigit(char);
    }

    private throwError(message: string): void {
        const error = new DayErr(message, "Lexical Error", this.line, this.column - 1, this.column, this.source.split('\n')[this.line - 1]);
        this.errors.push(error);
        this.advance();
        // TODO shouldn't be thrown here
        throw error;
    }

    private lexProgram() {
        while (!this.isEOF()) {
            this.skipWhitespace();
            if (this.isEOF()) break;

            const char = this.peek();
            switch (char) {
                case '%':
                    this.addToken(Tag.MOD, this.column, this.advance());
                    break;
                case '&':
                    this.addToken(Tag.AND, this.column, this.advance());
                    break;
                case '|':
                    this.addToken(Tag.OR, this.column, this.advance());
                    break;
                case '(':
                    this.addToken(Tag.LRP, this.column, this.advance());
                    break;
                case ')':
                    this.addToken(Tag.RRP, this.column, this.advance());
                    break;
                case '[':
                    this.addToken(Tag.LSP, this.column, this.advance());
                    break;
                case ']':
                    this.addToken(Tag.RSP, this.column, this.advance());
                    break;
                case '{':
                    this.addToken(Tag.LCP, this.column, this.advance());
                    break;
                case '}':
                    this.lexRCP();
                    break;
                case ',':
                    this.addToken(Tag.COMMA, this.column, this.advance());
                    break;
                case '.':
                    this.addToken(Tag.DOT, this.column, this.advance());
                    break;
                case '+':
                    this.lexPlus();
                    break;
                case '-':
                    this.lexMinus();
                    break;
                case '*':
                    this.lexStar();
                    break;
                case '/':
                    this.lexSlash();
                    break;
                case '>':
                    this.lexGreater();
                    break;
                case '<':
                    this.lexLess();
                    break;
                case '=':
                    this.lexEqual();
                    break;
                case '!':
                    this.lexNot();
                    break;
                case '"':
                    this.lexString();
                    break;
                case "'":
                    this.lexFString();
                    break;
                case '#':
                    this.ignoreSingleComment();
                    break;
                default:
                    if (this.isDigit(char)) this.lexNumber();
                    else if (this.isAlpha(char)) this.lexIdentifierOrKeyword();
                    else this.throwError(`Unexpected character: ${char}`);
            }
        }
    }

    private lexRCP(): void {
        this.addToken(Tag.RCP, this.column, this.advance());
        if (!this.isString) return;

        this.lexText();
    }

    private lexText(): void {
        let value = '';
        const column = this.column;
        while (this.peek() !== "'" && this.peek() !== '{' && !this.isEOF()) {
            if (this.peek() === '\n') {
                this.line++;
                this.column = 0;
            }
            value += this.advance();
        }

        if (this.isEOF()) {
            this.throwError('Unterminated f-string');
        }

        if (value.length > 0) {
            this.addToken(Tag.TEXT, column, value);
        }
    }

    private lexPlus(): void {
        const column = this.column;
        this.advance();
        if (this.match('+')) {
            this.addToken(Tag.INC, this.column, '++');
        } else if (this.match('=')) {
            this.addToken(Tag.SELF_INC, column, '+=');
        } else this.addToken(Tag.PLUS, column, '+');
    }

    private lexMinus(): void {
        const column = this.column;
        this.advance();
        if (this.match('-')) {
            this.addToken(Tag.DEC, column, '--');
        } else if (this.match('=')) {
            this.addToken(Tag.SELF_DEC, column, '-=');
        } else this.addToken(Tag.MINUS, column, '-');
    }

    private lexStar(): void {
        const column = this.column;
        this.advance();
        if (this.match('*')) {
            this.addToken(Tag.POW, column, '**');
        } else this.addToken(Tag.TIMES, column, '*');
    }

    private lexSlash(): void {
        const column = this.column;
        this.advance();
        if (this.match('/')) {
            this.addToken(Tag.INT_DIV, column, '//');
        } else this.addToken(Tag.DIV, column, '/');
    }

    private lexGreater(): void {
        const column = this.column;
        this.advance();
        if (this.match('=')) {
            this.addToken(Tag.GE, column, '>=');
        } else this.addToken(Tag.GT, column, '>');
    }

    private lexLess(): void {
        const column = this.column;
        this.advance();
        if (this.match('=')) {
            this.addToken(Tag.LE, column, '<=');
        } else if (this.match('<')) this.ignoreMultiComment();
        else this.addToken(Tag.LT, column, '<');
    }

    private lexEqual(): void {
        const column = this.column;
        this.advance();
        if (this.match('=')) {
            this.addToken(Tag.EQ, column, '==');
        } else this.addToken(Tag.ASSIGN, column, '=');
    }

    private lexNot(): void {
        const column = this.column;
        this.advance();
        if (this.match('=')) {
            this.addToken(Tag.NE, column, '!=');
        } else this.addToken(Tag.NOT, column, '!');
    }

    private lexString(): void {
        const column = this.column;
        this.advance()
        let value = '';
        while (this.peek() !== '"' && !this.isEOF()) {
            if (this.peek() === '\n') this.line++;
            value += this.advance();
        }

        if (this.isEOF()) {
            this.throwError('Unterminated string');
        }

        // Consume the closing "
        this.advance();

        this.addToken(Tag.TEXT, column, value);
    }

    private lexFString(): void {
        this.addToken(Tag.QUOTE, this.column, this.advance());

        if (this.isString) {
            this.isString = false;
            return
        }

        this.lexText();

        if (this.peek() === '{') {
            this.addToken(Tag.LCP, this.column, this.advance());
        }

        this.isString = true;
    }

    private lexNumber(): void {
        const column = this.column;
        let value = '';
        while (this.isDigit(this.peek())) value += this.advance();

        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            value += this.advance();

            while (this.isDigit(this.peek())) value += this.advance();
        }

        this.addToken(Tag.NUMBER, column, value);
    }

    private lexIdentifierOrKeyword(): void {
        const column = this.column;
        let value = '';
        while (this.isAlphaNumeric(this.peek())) value += this.advance();

        const tag = Lexer.KEYWORDS.get(value) || Tag.ID;
        this.addToken(tag, column, value);
    }

    private ignoreMultiComment(): void {
        while (!this.isEOF() && !(this.peek() === '>' && this.peekNext() === '>')) {
            if (this.peek() === '\n') {
                this.line++;
                this.column = 0;
            }
            this.advance();
        }

        if (this.isEOF()) {
            this.throwError('Unterminated multi-line comment');
        }

        // Consume the closing >>
        this.advance();
        this.advance();
    }

    private ignoreSingleComment(): void {
        while (this.peek() !== '\n' && !this.isEOF()) this.advance();
    }

    public getTokens(): Token[] {
        return this.tokens;
    }

    public getErrors(): DayErr[] {
        return this.errors;
    }
}