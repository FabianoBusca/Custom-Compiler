export class DayErr extends Error {
    public readonly kind: string;
    public readonly line: number;
    public readonly column: number;
    public readonly sourceLine: string;

    constructor(message: string, kind: string, line: number, column: number, sourceLine: string) {
        super(message);
        this.name = "DayError";
        this.kind = kind;
        this.line = line;
        this.column = column;
        this.sourceLine = sourceLine;
    }

    toString(): string {
        return `${this.kind}: ${this.message} at line ${this.line}, column ${this.column}\n` +
            `${this.sourceLine}\n` +
            `${' '.repeat(this.column)}^`;
    }
}
