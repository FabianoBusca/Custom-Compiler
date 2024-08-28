import {lexerTest, parserTest} from "../utils/utils";
import {DayErr} from "../../src/utils/dayErr";
import {Program} from "../../src/data";

describe("Syntax errors", () => {

    test("Expected character - 1", () => {
        const source = `num[][ x`;
        const expected = { kind: "Program", body: [] } as Program;
        const errors: DayErr[] = [new DayErr("Expected ']'", "Syntax Error", 1, 7, 8, "num[][ x")];

        parserTest(source, expected, errors);
    });

    test("Expected character - 2", () => {
        const source = `print z`;
        const expected = { kind: "Program", body: [] } as Program;
        const errors: DayErr[] = [new DayErr("Expected '('", "Syntax Error", 1, 6, 7, "print z")];

        parserTest(source, expected, errors);
    });

    test("Unexpected character - 1", () => {
        const source = `x,`;
        const expected = { kind: "Program", body: [] } as Program;
        const errors: DayErr[] = [new DayErr("Unexpected character", "Syntax Error", 1, 2, 3, "x,")];

        parserTest(source, expected, errors);
    });

    test("Unexpected character - 2", () => {
        const source = `bool this`;
        const expected = { kind: "Program", body: [] } as Program;
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