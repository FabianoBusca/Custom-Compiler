export class DayError {
    constructor() {}

    static syntaxError(message: string, line_number: number, column: number, line: string): never {
        throw new Error(`${message} at line ${line_number}, column ${column}:\n${line_number}: ${line}\n` + ' '.repeat(column + String(line_number).length + 2) + '~');
    }

    static semanticError(message: string) {
        throw new Error(message);
    }
}