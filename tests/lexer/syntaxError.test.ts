import {lexerTest} from "../utils/utils";
import {DayErr} from "../../src/utils/dayErr";

describe("Syntax errors", () => {

    test("Unexpected character", () => {
        const source = `num x = 10 @ 5`;
        const expected = [
            { tag: 31, value: 'num', line: 1, column: 4 },
            { tag: 34, value: 'x', line: 1, column: 6 },
            { tag: 21, value: '=', line: 1, column: 8 },
            { tag: 35, value: '10', line: 1, column: 11 }
        ];
        const errors: DayErr[] = [new DayErr("Unexpected character: @", "Syntax Error", 1, 11, "num x = 10 @ 5")];

        lexerTest(source, expected, errors);
    });

    test("Unterminated F-string", () => {
        const source = `str s = 'Hello, World! {9 + 9}`;
        const expected = [
            { tag: 32, value: 'str', line: 1, column: 4 },
            { tag: 34, value: 's', line: 1, column: 6 },
            { tag: 21, value: '=', line: 1, column: 8 },
            { tag: 30, value: "'", line: 1, column: 10 },
            { tag: 36, value: 'Hello, World! ', line: 1, column: 24 },
            { tag: 26, value: '{', line: 1, column: 24 },
            { tag: 35, value: '9', line: 1, column: 26 },
            { tag: 1, value: '+', line: 1, column: 28 },
            { tag: 35, value: '9', line: 1, column: 30 },
            { tag: 27, value: '}', line: 1, column: 31 }
        ];
        const errors: DayErr[] = [new DayErr("Unterminated f-string", "Syntax Error", 1, 30, "str s = 'Hello, World! {9 + 9}")];

        lexerTest(source, expected, errors);
    });

    test("Unterminated string", () => {
        const source = `str s = "Hello, World!`;
        const expected = [
            { tag: 32, value: 'str', line: 1, column: 4 },
            { tag: 34, value: 's', line: 1, column: 6 },
            { tag: 21, value: '=', line: 1, column: 8 },
        ];
        const errors: DayErr[] = [new DayErr("Unterminated string", "Syntax Error", 1, 22, 'str s = "Hello, World!')];

        lexerTest(source, expected, errors);
    });

    test("Unterminated multi-line comment", () => {
        const source = `<< num x`;
        const expected = [];
        const errors: DayErr[] = [new DayErr("Unterminated multi-line comment", "Syntax Error", 1, 8, '<< num x')];

        lexerTest(source, expected, errors);
    });
});