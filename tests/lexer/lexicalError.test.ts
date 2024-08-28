import {lexerTest} from "../utils/utils";
import {DayErr} from "../../src/utils/dayErr";

describe("Lexical Errors", () => {

    test("Unexpected character", () => {
        const source = `num x = 10 @ 5`;
        const expected = [
            { tag: 31, value: 'num', line: 1, start: 1, end: 4 },
            { tag: 34, value: 'x', line: 1, start: 5, end: 6 },
            { tag: 21, value: '=', line: 1, start: 7, end: 8 },
            { tag: 35, value: '10', line: 1, start: 9, end: 11 }
        ];
        const errors: DayErr[] = [new DayErr("Unexpected character: @", "Lexical Error", 1, 11, 12, "num x = 10 @ 5")];

        lexerTest(source, expected, errors);
    });

    test("Unterminated F-string", () => {
        const source = `str s = 'Hello, World! {9 + 9}`;
        const expected = [
            { tag: 32, value: 'str', line: 1, start: 1, end: 4 },
            { tag: 34, value: 's', line: 1, start: 5, end: 6 },
            { tag: 21, value: '=', line: 1, start: 7, end: 8 },
            { tag: 30, value: "'", line: 1, start: 9, end: 10 },
            { tag: 36, value: 'Hello, World! ', line: 1, start: 10, end: 24 },
            { tag: 26, value: '{', line: 1, start: 24, end: 25 },
            { tag: 35, value: '9', line: 1, start: 25, end: 26 },
            { tag: 1, value: '+', line: 1, start: 27, end: 28 },
            { tag: 35, value: '9', line: 1, start: 29, end: 30 },
            { tag: 27, value: '}', line: 1, start: 30, end: 31 }
        ];
        const errors: DayErr[] = [new DayErr("Unterminated f-string", "Lexical Error", 1, 30, 31, "str s = 'Hello, World! {9 + 9}")];

        lexerTest(source, expected, errors);
    });

    test("Unterminated string", () => {
        const source = `str s = "Hello, World!`;
        const expected = [
            { tag: 32, value: 'str', line: 1, start: 1, end: 4 },
            { tag: 34, value: 's', line: 1, start: 5, end: 6 },
            { tag: 21, value: '=', line: 1, start: 7, end: 8 }
        ];
        const errors: DayErr[] = [new DayErr("Unterminated string", "Lexical Error", 1, 22, 23, 'str s = "Hello, World!')];

        lexerTest(source, expected, errors);
    });

    test("Unterminated multi-line comment", () => {
        const source = `<< num x`;
        const expected = [];
        const errors: DayErr[] = [new DayErr("Unterminated multi-line comment", "Lexical Error", 1, 8, 9, '<< num x')];

        lexerTest(source, expected, errors);
    });
});