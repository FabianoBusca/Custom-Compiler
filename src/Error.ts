export class DayError extends Error {
    constructor(message: string, public line_number: number, public column: number, public line: string) {
        super(`${message} at line ${line_number}, column ${column}:\n${line_number}: ${line}\n` + ' '.repeat(column + String(line_number).length + 2) + '~');
    }
}