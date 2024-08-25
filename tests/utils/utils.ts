import {Lexer, Parser, SymbolTableBuilder, TypeChecker} from "../../src/compiler";
import {DayErr} from "../../src/utils/dayErr";
import {Token} from "../../src/data";

export function lexerTest(source: string, expected: Token[], errors?: DayErr[]) {
    const lexer = new Lexer(source);
    lexer.tokenize();

    const lexerErrors = lexer.getErrors();
    if (errors) expect(lexerErrors).toEqual((errors))

    const tokens = lexer.getTokens();
    expect(tokens).toEqual(expected);
}

export function parserTest(source: string, expected: string) {
    const lexer = new Lexer(source);
    lexer.tokenize();
    const tokens = lexer.getTokens();
    const parser = new Parser(tokens, source.split("\n"));
    const ast = parser.parse();

    expect(ast).toEqual(expected.toString());
}

export function typeCheckerTest(source: string, expected: string) {
    const lexer = new Lexer(source);
    lexer.tokenize();
    const tokens = lexer.getTokens();
    const parser = new Parser(tokens, source.split("\n"));
    const ast = parser.parse();
    const symbolTableBuilder = new SymbolTableBuilder(ast);
    const symbolTable = symbolTableBuilder.build();
    const typeChecker = new TypeChecker(ast, symbolTable);

    expect(typeChecker.check()).toEqual(expected);
}