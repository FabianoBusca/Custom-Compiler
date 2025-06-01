import {Lexer, Optimizer, Parser, SymbolTableBuilder, TypeChecker} from "@src/compiler";
import {DayErr} from "@src/utils";
import {Program, SymbolTable, Token} from "@src/data";

export function lexerTest(source: string, expected: Token[], errors?: DayErr[]) {
    const lexer = new Lexer(source);
    lexer.tokenize();

    const lexerErrors = lexer.getErrors();
    if (errors) {
        expect(lexerErrors.length).toEqual(errors.length);
        for (let i = 0; i < errors.length; i++) {
            expect(lexerErrors[i].message).toEqual(errors[i].message);
            expect(lexerErrors[i].kind).toEqual(errors[i].kind);
            expect(lexerErrors[i].line).toEqual(errors[i].line);
            expect(lexerErrors[i].start).toEqual(errors[i].start);
            expect(lexerErrors[i].end).toEqual(errors[i].end);
            expect(lexerErrors[i].sourceLine).toEqual(errors[i].sourceLine);
        }
    } else {
        expect(lexerErrors.length).toEqual(0);
    }

    const tokens = lexer.getTokens();
    expect(tokens).toEqual(expected);
}

export function parserTest(source: string, expected: Program, errors?: DayErr[]) {
    const lexer = new Lexer(source);
    lexer.tokenize();
    if (lexer.getErrors().length > 0) {
        throw new Error("Lexer failed with errors")
    }
    const parser = new Parser(lexer.getTokens(), source);
    parser.parse();

    const parserErrors = parser.getErrors();
    if (errors) {
        expect(parserErrors.length).toEqual(errors.length);
        for (let i = 0; i < errors.length; i++) {
            expect(parserErrors[i].message).toEqual(errors[i].message);
            expect(parserErrors[i].kind).toEqual(errors[i].kind);
            expect(parserErrors[i].line).toEqual(errors[i].line);
            expect(parserErrors[i].start).toEqual(errors[i].start);
            expect(parserErrors[i].end).toEqual(errors[i].end);
            expect(parserErrors[i].sourceLine).toEqual(errors[i].sourceLine);
        }
    } else {
        expect(parserErrors.length).toEqual(0);
    }

    const ast = parser.getAST();
    expect(ast).toEqual(expected);
}

export function symbolTableBuilderTest(source: string, expected: SymbolTable, errors?: DayErr[]) {
    const lexer = new Lexer(source);
    lexer.tokenize();
    if (lexer.getErrors().length > 0) {
        throw new Error("Lexer failed with errors")
    }
    const parser = new Parser(lexer.getTokens(), source);
    parser.parse();
    if (parser.getErrors().length > 0) {
        throw new Error("Parser failed with errors")
    }
    const ast = parser.getAST();
    const symbolTableBuilder = new SymbolTableBuilder(ast, source);
    symbolTableBuilder.build();
    const symbolTable = symbolTableBuilder.getSymbolTable();

    const symbolTableBuilderErrors = symbolTableBuilder.getErrors();
    if (errors) {
        expect(symbolTableBuilderErrors.length).toEqual(errors.length);
        for (let i = 0; i < errors.length; i++) {
            expect(symbolTableBuilderErrors[i].message).toEqual(errors[i].message);
            expect(symbolTableBuilderErrors[i].kind).toEqual(errors[i].kind);
            expect(symbolTableBuilderErrors[i].line).toEqual(errors[i].line);
            expect(symbolTableBuilderErrors[i].start).toEqual(errors[i].start);
            expect(symbolTableBuilderErrors[i].end).toEqual(errors[i].end);
            expect(symbolTableBuilderErrors[i].sourceLine).toEqual(errors[i].sourceLine);
        }
    } else {
        expect(symbolTableBuilderErrors.length).toEqual(0);
    }

    expect(symbolTable.toString()).toBe(expected.toString());
}

export function typeCheckerTest(source: string, errors?: DayErr[]) {
    const lexer = new Lexer(source);
    lexer.tokenize();
    if (lexer.getErrors().length > 0) {
        throw new Error("Lexer failed with errors")
    }
    const parser = new Parser(lexer.getTokens(), source);
    parser.parse();
    if (parser.getErrors().length > 0) {
        throw new Error("Parser failed with errors")
    }
    const ast = parser.getAST();
    const symbolTableBuilder = new SymbolTableBuilder(ast, source);
    symbolTableBuilder.build();
    if (symbolTableBuilder.getErrors().length > 0) {
        throw new Error("SymbolTableBuilder failed with errors")
    }
    const typeChecker = new TypeChecker(ast, symbolTableBuilder.getSymbolTable(), source);
    typeChecker.check();

    const typeCheckerErrors = typeChecker.getErrors();
    if (errors) {
        expect(typeCheckerErrors.length).toEqual(errors.length);
        for (let i = 0; i < errors.length; i++) {
            expect(typeCheckerErrors[i].message).toEqual(errors[i].message);
            expect(typeCheckerErrors[i].kind).toEqual(errors[i].kind);
            expect(typeCheckerErrors[i].line).toEqual(errors[i].line);
            expect(typeCheckerErrors[i].start).toEqual(errors[i].start);
            expect(typeCheckerErrors[i].end).toEqual(errors[i].end);
            expect(typeCheckerErrors[i].sourceLine).toEqual(errors[i].sourceLine);
        }
    } else {
        expect(typeCheckerErrors.length).toEqual(0);
    }
}

export function optimizerTest(source: string, expected: Program) {
    const lexer = new Lexer(source);
    lexer.tokenize();
    if (lexer.getErrors().length > 0) {
        throw new Error("Lexer failed with errors")
    }
    const parser = new Parser(lexer.getTokens(), source);
    parser.parse();
    if (parser.getErrors().length > 0) {
        throw new Error("Parser failed with errors")
    }
    const ast = parser.getAST();
    const symbolTableBuilder = new SymbolTableBuilder(ast, source);
    symbolTableBuilder.build();
    if (symbolTableBuilder.getErrors().length > 0) {
        throw new Error("Symbol Table Builder failed with errors")
    }
    const typeChecker = new TypeChecker(ast, symbolTableBuilder.getSymbolTable(), source);
    typeChecker.check();
    if (symbolTableBuilder.getErrors().length > 0) {
        throw new Error("Type Checker failed with errors")
    }
    const optimizer = new Optimizer(ast);
    optimizer.optimize();

    const optimizedAST = optimizer.getOptimizedAST();
    expect(optimizedAST).toEqual(expected);
}