export class DayErr extends Error {
    public readonly kind: string;
    public readonly line: number;
    public readonly start: number;
    public readonly end: number;
    public readonly sourceLine: string;

    constructor(message: string, kind: string, line: number, start: number, end: number, sourceLine: string) {
        super(message);
        this.name = "DayError";
        this.kind = kind;
        this.line = line;
        this.start = start;
        this.end = end;
        this.sourceLine = sourceLine;
    }

    toString(): string {
        const err =  `${this.kind}: ${this.message} at line ${this.line}, column ${this.start}\n` +
            `${this.sourceLine}\n` +
            `${' '.repeat(this.start - 1)}`;
        if (this.end - this.start > 1) return err + `${'~'.repeat(this.end - this.start)}`;
        return err + "^";
    }
}
