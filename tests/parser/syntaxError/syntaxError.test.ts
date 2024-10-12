import {ASTFactory} from "../../../src/utils/ASTFactory";
import {DayErr} from "../../../src/utils";
import {parserTest, parserTestt} from "../../utils";
import {Program} from "../../../src/data";

//TODO
describe("Syntax errors", () => {
  
  test("Expected character - 1", () => {
    const source = "num[][ x";
    
    const tokens = [
      {
        tag: 31,
        value: 'num',
        start: {line: 1, column: 1},
        end: {line: 1, column: 4}
      },
      {
        tag: 24,
        value: '[',
        start: {line: 1, column: 4},
        end: {line: 1, column: 5}
      },
      {
        tag: 25,
        value: ']',
        start: {line: 1, column: 5},
        end: {line: 1, column: 6}
      },
      {
        tag: 24,
        value: '[',
        start: {line: 1, column: 6},
        end: {line: 1, column: 7}
      },
      {
        tag: 34,
        value: 'x',
        start: {line: 1, column: 8},
        end: {line: 1, column: 9}
      },
      {
        tag: 0,
        value: '',
        start: {line: 1, column: 9},
        end: {line: 1, column: 9}
      }
    ];
    
    const expected = ASTFactory.createProgram([], {line: 1, column: 1}, {line: 1, column: 9});
    
    const errors: DayErr[] = [new DayErr("Expected ']'", "Syntax Error", 1, 7, 8, "num[][ x")];
    
    parserTestt(source, tokens, expected, errors);
  });
  
  test("Expected character - 2", () => {
    const source = `print z`;
    const expected = {kind: "Program", body: []} as Program;
    const errors: DayErr[] = [new DayErr("Expected '('", "Syntax Error", 1, 6, 7, "print z")];
    
    parserTest(source, expected, errors);
  });
  
  test("Unexpected character - 1", () => {
    const source = `x,`;
    const expected = {kind: "Program", body: []} as Program;
    const errors: DayErr[] = [new DayErr("Unexpected character", "Syntax Error", 1, 2, 3, "x,")];
    
    parserTest(source, expected, errors);
  });
  
  test("Unexpected character - 2", () => {
    const source = `bool this`;
    const expected = {kind: "Program", body: []} as Program;
    const errors: DayErr[] = [new DayErr("Unexpected character", "Syntax Error", 1, 6, 10, "bool this")];
    
    parserTest(source, expected, errors);
  });
  
  test("Unexpected statement", () => {
    const source = `print(9)\n` +
      `"Hello, World!"`;
    const expected = {
      kind: "Program",
      body: [
        {
          kind: "PrintStatement",
          arguments: [
            {
              kind: "Number",
              value: 9
            }
          ]
        }
      ]
    } as Program;
    const errors: DayErr[] = [new DayErr("Unexpected statement", "Syntax Error", 2, 1, 16, "\"Hello, World!\"")];
    
    parserTest(source, expected, errors);
  });
});