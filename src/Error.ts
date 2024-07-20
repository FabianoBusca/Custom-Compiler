export enum ErrorType {
    ERROR_NONE = 0,
    ERROR_READ = 1
}

export class Error {
    type: ErrorType;
    message: string;

    constructor(type: ErrorType, message: string) {
        this.type = type;
        this.message = message;
    }
}