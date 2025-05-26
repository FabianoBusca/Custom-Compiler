import {lexerTest} from "@tests/utils";
import {DayErr} from "@src/utils";
import {createToken} from "@src/data";

describe("Lexical Errors", () => {

    test("Unexpected character", () => {
        const source = `num x = 10 @ 5`;
        const expected = [
            createToken(31, 'num', {line: 1, column: 1}, {line: 1, column: 4}),
            createToken(34, 'x', {line: 1, column: 5}, {line: 1, column: 6}),
            createToken(21, '=', {line: 1, column: 7}, {line: 1, column: 8}),
            createToken(35, '10', {line: 1, column: 9}, {line: 1, column: 11})
        ];
        const errors: DayErr[] = [
            new DayErr("Unexpected character: @", "Lexical Error", 1, 11, 12, "num x = 10 @ 5")
        ];

        lexerTest(source, expected, errors);
    });

    test("Unterminated F-string", () => {
        const source = `str s = 'Hello, World! {9 + 9}`;
        const expected = [
            createToken(32, 'str', {line: 1, column: 1}, {line: 1, column: 4}),
            createToken(34, 's', {line: 1, column: 5}, {line: 1, column: 6}),
            createToken(21, '=', {line: 1, column: 7}, {line: 1, column: 8}),
            createToken(30, "'", {line: 1, column: 9}, {line: 1, column: 10}),
            createToken(36, 'Hello, World! ', {line: 1, column: 10}, {line: 1, column: 24}),
            createToken(26, '{', {line: 1, column: 24}, {line: 1, column: 25}),
            createToken(35, '9', {line: 1, column: 25}, {line: 1, column: 26}),
            createToken(1, '+', {line: 1, column: 27}, {line: 1, column: 28}),
            createToken(35, '9', {line: 1, column: 29}, {line: 1, column: 30}),
            createToken(27, '}', {line: 1, column: 30}, {line: 1, column: 31})
        ];
        const errors: DayErr[] = [
            new DayErr("Unterminated f-string", "Lexical Error", 1, 30, 31, "str s = 'Hello, World! {9 + 9}")
        ];

        lexerTest(source, expected, errors);
    });

    test("Unterminated string", () => {
        const source = `str s = "Hello, World!`;
        const expected = [
            createToken(32, 'str', {line: 1, column: 1}, {line: 1, column: 4}),
            createToken(34, 's', {line: 1, column: 5}, {line: 1, column: 6}),
            createToken(21, '=', {line: 1, column: 7}, {line: 1, column: 8})
        ];
        const errors: DayErr[] = [
            new DayErr("Unterminated string", "Lexical Error", 1, 22, 23, 'str s = "Hello, World!')
        ];

        lexerTest(source, expected, errors);
    });

    test("Unterminated multi-line comment", () => {
        const source = `<< num x`;
        const expected: any[] = []; // no tokens emitted due to early block comment
        const errors: DayErr[] = [
            new DayErr("Unterminated multi-line comment", "Lexical Error", 1, 8, 9, '<< num x')
        ];

        lexerTest(source, expected, errors);
    });
});