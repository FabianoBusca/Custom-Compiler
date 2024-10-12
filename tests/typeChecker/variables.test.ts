import {ASTFactory} from "../../src/utils/ASTFactory";
import {typeCheckerTest} from "../utils";

describe("Variables", () => {
  test("Variable declaration - 1", () => {
    const source = "num x = 5";
    
    const ast = ASTFactory.createProgram([
        ASTFactory.createVariableOperations(
          [ASTFactory.createVariableDeclaration(
            ASTFactory.createType("num", 0, {line: 1, column: 1}, {line: 1, column: 3}),
            ASTFactory.createIdentifier({tag: 34, value: "x", start: {line: 1, column: 5}, end: {line: 1, column: 6}}),
          )],
          21,
          [ASTFactory.createNumberNode({tag: 35, value: "5", start: {line: 1, column: 8}, end: {line: 1, column: 9}})],
          {line: 1, column: 1},
          {line: 1, column: 9}
        )
      ], {line: 1, column: 1},
      {line: 1, column: 9}
    );
    
    typeCheckerTest(source, ast);
  });
});