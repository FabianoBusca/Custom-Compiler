import {lexerTest} from "../utils/utils";
import {Token} from "../../src/data";

describe("Tags", () => {

    test("symbols", () => {
        const source = `+ - * / % ** -- += -= & | ! == != > < >= <= = ( ) [ ] { } , .`;

        const expected = [
            { tag: 1, value: '+', line: 1, column: 2 },
            { tag: 2, value: '-', line: 1, column: 4 },
            { tag: 3, value: '*', line: 1, column: 6 },
            { tag: 4, value: '/', line: 1, column: 8 },
            { tag: 5, value: '%', line: 1, column: 10 },
            { tag: 6, value: '**', line: 1, column: 13 },
            { tag: 9, value: '--', line: 1, column: 16 },
            { tag: 10, value: '+=', line: 1, column: 19 },
            { tag: 11, value: '-=', line: 1, column: 22 },
            { tag: 12, value: '&', line: 1, column: 24 },
            { tag: 13, value: '|', line: 1, column: 26 },
            { tag: 14, value: '!', line: 1, column: 28 },
            { tag: 15, value: '==', line: 1, column: 31 },
            { tag: 16, value: '!=', line: 1, column: 34 },
            { tag: 17, value: '>', line: 1, column: 36 },
            { tag: 18, value: '<', line: 1, column: 38 },
            { tag: 19, value: '>=', line: 1, column: 41 },
            { tag: 20, value: '<=', line: 1, column: 44 },
            { tag: 21, value: '=', line: 1, column: 46 },
            { tag: 22, value: '(', line: 1, column: 48 },
            { tag: 23, value: ')', line: 1, column: 50 },
            { tag: 24, value: '[', line: 1, column: 52 },
            { tag: 25, value: ']', line: 1, column: 54 },
            { tag: 26, value: '{', line: 1, column: 56 },
            { tag: 27, value: '}', line: 1, column: 58 },
            { tag: 28, value: ',', line: 1, column: 60 },
            { tag: 29, value: '.', line: 1, column: 62 },
            { tag: 0, value: '', line: 1, column: 62 }
        ];

        lexerTest(source, expected);
    });

    test("keywords", () => {
        const source = `num str bool randomIdentifier 7 "text" if else while for return switch case break default class this true false print read null _`;

        const expected = [
            { tag: 31, value: 'num', line: 1, column: 4 },
            { tag: 32, value: 'str', line: 1, column: 8 },
            { tag: 33, value: 'bool', line: 1, column: 13 },
            { tag: 34, value: 'randomIdentifier', line: 1, column: 30 },
            { tag: 35, value: '7', line: 1, column: 32 },
            { tag: 36, value: 'text', line: 1, column: 39 },
            { tag: 37, value: 'if', line: 1, column: 42 },
            { tag: 38, value: 'else', line: 1, column: 47 },
            { tag: 39, value: 'while', line: 1, column: 53 },
            { tag: 40, value: 'for', line: 1, column: 57 },
            { tag: 41, value: 'return', line: 1, column: 64 },
            { tag: 42, value: 'switch', line: 1, column: 71 },
            { tag: 43, value: 'case', line: 1, column: 76 },
            { tag: 44, value: 'break', line: 1, column: 82 },
            { tag: 45, value: 'default', line: 1, column: 90 },
            { tag: 46, value: 'class', line: 1, column: 96 },
            { tag: 47, value: 'this', line: 1, column: 101 },
            { tag: 48, value: 'true', line: 1, column: 106 },
            { tag: 49, value: 'false', line: 1, column: 112 },
            { tag: 50, value: 'print', line: 1, column: 118 },
            { tag: 51, value: 'read', line: 1, column: 123 },
            { tag: 52, value: 'null', line: 1, column: 128 },
            { tag: 53, value: '_', line: 1, column: 130 },
            { tag: 0, value: '', line: 1, column: 130 }
        ];

        lexerTest(source, expected);
    });
});