import {Tag, Token} from "./Token";

// TODO unclosed comments are weird
class LexerError extends Error {
    constructor(message: string, public line_number: number, public column: number, public line: string) {
        super(`${message} at line ${line_number}, column ${column}:\n${line_number}: ${line}\n` + ' '.repeat(column + String(line_number).length + 2) + '~');
    }
}

export class Lexer {
    // TODO: source as string[]
    // TODO: extract error class
    private readonly source: string;
    private position: number = 0;
    private isString: boolean = false;
    private line: number = 1;
    private column: number = 1;
    private tokens: Token[] = [];

    private static KEYWORDS: Map<string, Tag> = new Map([
        ['if', Tag.IF], ['else', Tag.ELSE], ['while', Tag.WHILE],
        ['for', Tag.FOR], ['return', Tag.RETURN], ['switch', Tag.SWITCH],
        ['case', Tag.CASE], ['break', Tag.BREAK], ['default', Tag.DEFAULT],
        ['class', Tag.CLASS], ['this', Tag.THIS], ['true', Tag.TRUE],
        ['false', Tag.FALSE], ['print', Tag.PRINT], ['read', Tag.READ],
        ['null', Tag.NULL], ['num', Tag.NUM], ['str', Tag.STR],
        ['bool', Tag.BOOL], ['arr', Tag.ARR], ['_', Tag.UNDERSCORE]
    ]);

    constructor(source: string) {
        this.source = source;
    }

    tokenize(): Token[] {
        while (!this.isEOF()) {
            this.skipWhitespace();
            if (this.isEOF()) break;

            const char = this.peek();
            switch (char) {
                case '%': this.addToken(Tag.MOD, this.advance()); break;
                case '&': this.addToken(Tag.AND, this.advance()); break;
                case '|': this.addToken(Tag.OR, this.advance()); break;
                case '(': this.addToken(Tag.LRP, this.advance()); break;
                case ')': this.addToken(Tag.RRP, this.advance()); break;
                case '[': this.addToken(Tag.LSP, this.advance()); break;
                case ']': this.addToken(Tag.RSP, this.advance()); break;
                case '{': this.addToken(Tag.LCP, this.advance()); break;
                case '}': this.lexRCP(); break;
                case ',': this.addToken(Tag.COMMA, this.advance()); break;
                case '.': this.addToken(Tag.DOT, this.advance()); break;
                case '+': this.lexPlus(); break;
                case '-': this.lexMinus(); break;
                case '*': this.lexStar(); break;
                case '/': this.lexSlash(); break;
                case '>': this.lexGreater(); break;
                case '<': this.lexLess(); break;
                case '=': this.lexEqual(); break;
                case '!': this.lexNot(); break;
                case '"': this.lexString(); break;
                case "'": this.lexFString(); break;
                case '#': this.ignoreSingleComment(); break;
                default:
                    if (this.isDigit(char)) this.lexNumber();
                    else if (this.isAlpha(char)) this.lexIdentifierOrKeyword();
                    else this.error(`Unexpected character: ${char}`);
            }
        }

        this.addToken(Tag.EOF);
        return this.tokens;
    }

    private addToken(tag: Tag, value: string = ''): void {
        this.tokens.push({ tag, value, line: this.line, column: this.column });
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
                    this.column = 1;
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

    private error(message: string): never {
        throw new LexerError(message, this.line, this.column - 2, this.source.split('\n')[this.line - 1]);
    }

    private lexRCP(): void {
        this.addToken(Tag.RCP, this.advance());
        if (!this.isString) return;

        this.lexText();
    }

    private lexText(): void {
        let value = '';
        while (this.peek() !== "'" && this.peek() !== '{' && !this.isEOF()) {
            if (this.peek() === '\n') this.line++;
            value += this.advance();
        }

        if (this.isEOF()) {
            this.error('Unterminated f-string');
        }

        if (value.length > 0) {
            this.addToken(Tag.TEXT, value);
        }
    }

    private lexPlus(): void {
        this.advance();
        if (this.match('+')) {
            this.addToken(Tag.INC, '++');
        }
        else if (this.match('=')) {
            this.addToken(Tag.SELF_INC, '+=');
        }
        else this.addToken(Tag.PLUS, '+');
    }

    private lexMinus(): void {
        this.advance();
        if (this.match('-')) {
            this.addToken(Tag.DEC, '--');
        }
        else if (this.match('=')) {
            this.addToken(Tag.SELF_DEC, '-=');
        }
        else this.addToken(Tag.MINUS, '-');
    }

    private lexStar(): void {
        this.advance();
        if (this.match('*')) {
            this.addToken(Tag.POW, '**');
        }
        else this.addToken(Tag.TIMES, '*');
    }

    private lexSlash(): void {
        this.advance();
        if (this.match('/')) {
            this.addToken(Tag.INT_DIV, '//');
        }
        else this.addToken(Tag.DIV, '/');
    }

    private lexGreater(): void {
        this.advance();
        if (this.match('=')) {
            this.addToken(Tag.GE, '>=');
        }
        else this.addToken(Tag.GT, '>');
    }

    private lexLess(): void {
        this.advance();
        if (this.match('=')) {
            this.addToken(Tag.LE, '<=');
        }
        else if (this.match('<')) this.ignoreMultiComment();
        else this.addToken(Tag.LT, '<');
    }

    private lexEqual(): void {
        this.advance();
        if (this.match('=')) {
            this.addToken(Tag.EQ, '==');
        }
        else this.addToken(Tag.ASSIGN, '=');
    }

    private lexNot(): void {
        this.advance();
        if (this.match('=')) {
            this.addToken(Tag.NE, '!=');
        }
        else this.addToken(Tag.NOT, this.advance());
    }

    private lexString(): void {
        this.advance()
        let value = '';
        while (this.peek() !== '"' && !this.isEOF()) {
            if (this.peek() === '\n') this.line++;
            value += this.advance();
        }

        if (this.isEOF()) {
            this.error('Unterminated string');
        }

        // Consume the closing "
        this.advance();

        this.addToken(Tag.TEXT, value);
    }

    private lexFString(): void {
        this.addToken(Tag.QUOTE, this.advance());

        if (this.isString) {
            this.isString = false;
            return
        }

        this.lexText();

        if (this.peek() === '{') {
            this.addToken(Tag.LCP, '{');
            this.advance();
        }

        this.isString = true;
    }

    private lexNumber(): void {
        let value = '';
        while (this.isDigit(this.peek())) value += this.advance();

        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            value += this.advance();

            while (this.isDigit(this.peek())) value += this.advance();
        }

        this.addToken(Tag.NUMBER, value);
    }

    private lexIdentifierOrKeyword(): void {
        let value = '';
        while (this.isAlphaNumeric(this.peek())) value += this.advance();

        const tag = Lexer.KEYWORDS.get(value) || Tag.ID;
        this.addToken(tag, value);
    }

    private ignoreMultiComment(): void {
        while (!this.isEOF() && !(this.peek() === '>' && this.peekNext() === '>')) {
            if (this.peek() === '\n') this.line++;
            this.advance();
        }

        if (this.isEOF()) {
            this.error('Unterminated multi-line comment');
        }

        // Consume the closing >>
        this.advance();
        this.advance();
    }

    private ignoreSingleComment(): void {
        while (this.peek() !== '\n' && !this.isEOF()) this.advance();
    }
}