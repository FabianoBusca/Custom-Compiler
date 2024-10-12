import {ASTFactory} from "../../src/utils/ASTFactory";
import {symbolTableBuilderTest} from "../utils";
import {SymbolTable} from "../../src/data";

describe("Variables", () => {
  test("Variable declaration - 1", () => {
    const source = "num x = 6";
    
    const ast = ASTFactory.createProgram([
        ASTFactory.createVariableOperations(
          [ASTFactory.createVariableDeclaration(
            ASTFactory.createType("num", 0, {line: 1, column: 1}, {line: 1, column: 3}),
            ASTFactory.createIdentifier({tag: 34, value: "x", start: {line: 1, column: 5}, end: {line: 1, column: 6}}),
          )],
          21,
          [ASTFactory.createNumberNode({tag: 35, value: "6", start: {line: 1, column: 8}, end: {line: 1, column: 9}})],
          {line: 1, column: 1},
          {line: 1, column: 9}
        )
      ], {line: 1, column: 1},
      {line: 1, column: 9}
    );
    
    const symbolTable = new SymbolTable();
    symbolTable.addVariable("x", ASTFactory.createType("num", 0, {line: 1, column: 1}, {line: 1, column: 3}));
    
    symbolTableBuilderTest(source, ast, symbolTable);
  });
  
  test("Variable declaration - 2", () => {
    const source = "str s = 'hello {x}'";
    
    const ast = ASTFactory.createProgram([
        ASTFactory.createVariableOperations(
          [ASTFactory.createVariableDeclaration(
            ASTFactory.createType("str", 0, {line: 1, column: 1}, {line: 1, column: 3}),
            ASTFactory.createIdentifier({tag: 34, value: "s", start: {line: 1, column: 5}, end: {line: 1, column: 6}}),
          )],
          21,
          [ASTFactory.createFString([
              ASTFactory.createStringNode({
                tag: 36,
                value: "hello ",
                start: {line: 1, column: 9},
                end: {line: 1, column: 14}
              }),
              ASTFactory.createIdentifier({tag: 34, value: "x", start: {line: 1, column: 16}, end: {line: 1, column: 17}})],
            {line: 1, column: 9},
            {line: 1, column: 20}
          )],
          {line: 1, column: 1},
          {line: 1, column: 20}
        )
      ], {line: 1, column: 1},
      {line: 1, column: 20}
    );
    
    const symbolTable = new SymbolTable();
    symbolTable.addVariable("s", ASTFactory.createType("str", 0, {line: 1, column: 1}, {line: 1, column: 3}));
    
    symbolTableBuilderTest(source, ast, symbolTable);
  });
  
  test("Variable declaration - 3", () => {
    const source = "bool b = true";
    
    const ast = ASTFactory.createProgram([
        ASTFactory.createVariableOperations(
          [ASTFactory.createVariableDeclaration(
            ASTFactory.createType("bool", 0, {line: 1, column: 1}, {line: 1, column: 4}),
            ASTFactory.createIdentifier({tag: 34, value: "b", start: {line: 1, column: 6}, end: {line: 1, column: 7}}),
          )],
          21,
          [ASTFactory.createBooleanNode({
            tag: 37,
            value: "true",
            start: {line: 1, column: 10},
            end: {line: 1, column: 14}
          })],
          {line: 1, column: 1},
          {line: 1, column: 14}
        )
      ], {line: 1, column: 1},
      {line: 1, column: 14}
    );
    
    const symbolTable = new SymbolTable();
    symbolTable.addVariable("b", ASTFactory.createType("bool", 0, {line: 1, column: 1}, {line: 1, column: 4}));
    
    symbolTableBuilderTest(source, ast, symbolTable);
  });
  
  test("Variable declaration - 4", () => {
    const source =
      "class Dog = {}\n" +
      "Dog d";
    
    const ast = ASTFactory.createProgram([
        ASTFactory.createClassDeclaration(
          ASTFactory.createIdentifier({tag: 34, value: "Dog", start: {line: 1, column: 7}, end: {line: 1, column: 10}}),
          [],
          {line: 1, column: 1},
          {line: 1, column: 11}
        ),
        ASTFactory.createVariableOperations(
          [ASTFactory.createVariableDeclaration(
            ASTFactory.createType("Dog", 0, {line: 2, column: 1}, {line: 2, column: 3}),
            ASTFactory.createIdentifier({tag: 34, value: "d", start: {line: 2, column: 5}, end: {line: 2, column: 6}}),
          )],
          21,
          [],
          {line: 2, column: 1},
          {line: 2, column: 6}
        )
      ], {line: 1, column: 1},
      {line: 2, column: 6}
    );
    
    const symbolTable = new SymbolTable();
    symbolTable.addClass("Dog", new SymbolTable());
    symbolTable.addVariable("d", ASTFactory.createType("Dog", 0, {line: 2, column: 1}, {line: 2, column: 3}));
    
    symbolTableBuilderTest(source, ast, symbolTable);
  });
});