import {lexerTest} from "../utils/utils";

describe("Tags", () => {

    test("symbols", () => {
        const source = `+ - * / % ** -- += -= & | ! == != > < >= <= = ( ) [ ] { } , .`;

        const expected = [
            { tag: 1, value: '+', line: 1, start: 1, end: 2 },
            { tag: 2, value: '-', line: 1, start: 3, end: 4 },
            { tag: 3, value: '*', line: 1, start: 5, end: 6 },
            { tag: 4, value: '/', line: 1, start: 7, end: 8 },
            { tag: 5, value: '%', line: 1, start: 9, end: 10 },
            { tag: 6, value: '**', line: 1, start: 11, end: 13 },
            { tag: 9, value: '--', line: 1, start: 14, end: 16 },
            { tag: 10, value: '+=', line: 1, start: 17, end: 19 },
            { tag: 11, value: '-=', line: 1, start: 20, end: 22 },
            { tag: 12, value: '&', line: 1, start: 23, end: 24 },
            { tag: 13, value: '|', line: 1, start: 25, end: 26 },
            { tag: 14, value: '!', line: 1, start: 27, end: 28 },
            { tag: 15, value: '==', line: 1, start: 29, end: 31 },
            { tag: 16, value: '!=', line: 1, start: 32, end: 34 },
            { tag: 17, value: '>', line: 1, start: 35, end: 36 },
            { tag: 18, value: '<', line: 1, start: 37, end: 38 },
            { tag: 19, value: '>=', line: 1, start: 39, end: 41 },
            { tag: 20, value: '<=', line: 1, start: 42, end: 44 },
            { tag: 21, value: '=', line: 1, start: 45, end: 46 },
            { tag: 22, value: '(', line: 1, start: 47, end: 48 },
            { tag: 23, value: ')', line: 1, start: 49, end: 50 },
            { tag: 24, value: '[', line: 1, start: 51, end: 52 },
            { tag: 25, value: ']', line: 1, start: 53, end: 54 },
            { tag: 26, value: '{', line: 1, start: 55, end: 56 },
            { tag: 27, value: '}', line: 1, start: 57, end: 58 },
            { tag: 28, value: ',', line: 1, start: 59, end: 60 },
            { tag: 29, value: '.', line: 1, start: 61, end: 62 },
            { tag: 0, value: '', line: 1, start: 62, end: 62 }
        ];

        lexerTest(source, expected);
    });

    test("keywords", () => {
        const source = `num str bool randomIdentifier 7 "text" if else while for return switch case break default class this true false print read null _`;

        const expected = [
            { tag: 31, value: 'num', line: 1, start: 1, end: 4 },
            { tag: 32, value: 'str', line: 1, start: 5, end: 8 },
            { tag: 33, value: 'bool', line: 1, start: 9, end: 13 },
            { tag: 34, value: 'randomIdentifier', line: 1, start: 14, end: 30 },
            { tag: 35, value: '7', line: 1, start: 31, end: 32 },
            { tag: 36, value: 'text', line: 1, start: 33, end: 39 },
            { tag: 37, value: 'if', line: 1, start: 40, end: 42 },
            { tag: 38, value: 'else', line: 1, start: 43, end: 47 },
            { tag: 39, value: 'while', line: 1, start: 48, end: 53 },
            { tag: 40, value: 'for', line: 1, start: 54, end: 57 },
            { tag: 41, value: 'return', line: 1, start: 58, end: 64 },
            { tag: 42, value: 'switch', line: 1, start: 65, end: 71 },
            { tag: 43, value: 'case', line: 1, start: 72, end: 76 },
            { tag: 44, value: 'break', line: 1, start: 77, end: 82 },
            { tag: 45, value: 'default', line: 1, start: 83, end: 90 },
            { tag: 46, value: 'class', line: 1, start: 91, end: 96 },
            { tag: 47, value: 'this', line: 1, start: 97, end: 101 },
            { tag: 48, value: 'true', line: 1, start: 102, end: 106 },
            { tag: 49, value: 'false', line: 1, start: 107, end: 112 },
            { tag: 50, value: 'print', line: 1, start: 113, end: 118 },
            { tag: 51, value: 'read', line: 1, start: 119, end: 123 },
            { tag: 52, value: 'null', line: 1, start: 124, end: 128 },
            { tag: 53, value: '_', line: 1, start: 129, end: 130 },
            { tag: 0, value: '', line: 1, start: 130, end: 130 }
        ];

        lexerTest(source, expected);
    });
});