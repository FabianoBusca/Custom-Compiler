import {Lexer, Parser, SymbolTableBuilder, TypeChecker} from "../../src/compiler";
import {DayErr} from "../../src/utils";
import {Program, SymbolTable, Token} from "../../src/data";

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

// export function parserTest(source_path: string, expected: Program, errors?: DayErr[]) {
//     const source = (fs.readFileSync(path.join(TEST_FOLDER, PARSER_FOLDER, source_path), 'utf8')).replace('\n\r', '\n');
//     const lexer = new Lexer(source);
//     lexer.tokenize();
//     const tokens = lexer.getTokens();
//     const parser = new Parser(tokens, source);
//     parser.parse();
//
//     const parserErrors = parser.getErrors();
//     if (errors) {
//         expect(parserErrors.length).toEqual(errors.length);
//         for (let i = 0; i < errors.length; i++) {
//             expect(parserErrors[i].message).toEqual(errors[i].message);
//             expect(parserErrors[i].kind).toEqual(errors[i].kind);
//             expect(parserErrors[i].line).toEqual(errors[i].line);
//             expect(parserErrors[i].start).toEqual(errors[i].start);
//             expect(parserErrors[i].end).toEqual(errors[i].end);
//             expect(parserErrors[i].sourceLine).toEqual(errors[i].sourceLine);
//         }
//     } else {
//         expect(parserErrors.length).toEqual(0);
//     }
//
//     const ast = parser.getAST();
//     expect(ast).toEqual(expected);
// }

export function parserTestt(source: string, tokens: Token[], expected: Program, errors?: DayErr[]) {
  const parser = new Parser(tokens, source);
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

// export function parserTest(source: string, expected: string) {
//     const lexer = new Lexer(source);
//     lexer.tokenize();
//     const tokens = lexer.getTokens();
//     const parser = new Parser(tokens, source.split("\n"));
//     const ast = parser.parse();
//
//     expect(ast).toEqual(expected.toString());
// }

export function symbolTableBuilderTest(source: string, ast: Program, expected: SymbolTable, errors?: DayErr[]) {
  const symbolTableBuilder = new SymbolTableBuilder(ast);
  const symbolTable = symbolTableBuilder.build();
  
  if (errors) {
    const symbolTableBuilderErrors = symbolTableBuilder.getErrors();
    expect(symbolTableBuilderErrors.length).toEqual(errors.length);
    for (let i = 0; i < errors.length; i++) {
      expect(symbolTableBuilderErrors[i].message).toEqual(errors[i].message);
      expect(symbolTableBuilderErrors[i].kind).toEqual(errors[i].kind);
      expect(symbolTableBuilderErrors[i].line).toEqual(errors[i].line);
      expect(symbolTableBuilderErrors[i].start).toEqual(errors[i].start);
      expect(symbolTableBuilderErrors[i].end).toEqual(errors[i].end);
      expect(symbolTableBuilderErrors[i].sourceLine).toEqual(errors[i].sourceLine);
    }
  }
  
  expect(symbolTable.toString()).toBe(expected.toString());
}

export function typeCheckerTest(source: string, ast: Program, errors?: DayErr[]) {
  const symbolTableBuilder = new SymbolTableBuilder(ast);
  const symbolTable = symbolTableBuilder.build();
  const typeChecker = new TypeChecker(ast, symbolTable);
  
  if (errors) {
    const typeCheckerErrors = typeChecker.getErrors();
    expect(typeCheckerErrors.length).toEqual(errors.length);
    for (let i = 0; i < errors.length; i++) {
      expect(typeCheckerErrors[i].message).toEqual(errors[i].message);
      expect(typeCheckerErrors[i].kind).toEqual(errors[i].kind);
      expect(typeCheckerErrors[i].line).toEqual(errors[i].line);
      expect(typeCheckerErrors[i].start).toEqual(errors[i].start);
      expect(typeCheckerErrors[i].end).toEqual(errors[i].end);
      expect(typeCheckerErrors[i].sourceLine).toEqual(errors[i].sourceLine);
    }
  }
  
  expect(typeChecker.check());
}