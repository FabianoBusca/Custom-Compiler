import { Lexer } from "../src/Lexer";
import { Parser } from "../src/Parser";

export function parserTest(source: string, expected: string) {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens, source.split("\n"));
    const ast = parser.parse();

    expect(ast).toEqual(expected);
}