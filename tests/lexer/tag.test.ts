import {lexerTest} from "../utils/utils";

describe("Tags", () => {

    test("symbols", () => {
        const source = `+ - * / % ** -- += -= & | ! == != > < >= <= = ( ) [ ] { } , .`;

        const expected = [
            { tag: 1, value: '+', start: { line: 1, column: 1 }, end: { line: 1, column: 2 } },
            { tag: 2, value: '-', start: { line: 1, column: 3 }, end: { line: 1, column: 4 } },
            { tag: 3, value: '*', start: { line: 1, column: 5 }, end: { line: 1, column: 6 } },
            { tag: 4, value: '/', start: { line: 1, column: 7 }, end: { line: 1, column: 8 } },
            { tag: 5, value: '%', start: { line: 1, column: 9 }, end: { line: 1, column: 10 } },
            { tag: 6, value: '**', start: { line: 1, column: 11 }, end: { line: 1, column: 13 } },
            { tag: 9, value: '--', start: { line: 1, column: 14 }, end: { line: 1, column: 16 } },
            { tag: 10, value: '+=', start: { line: 1, column: 17 }, end: { line: 1, column: 19 } },
            { tag: 11, value: '-=', start: { line: 1, column: 20 }, end: { line: 1, column: 22 } },
            { tag: 12, value: '&', start: { line: 1, column: 23 }, end: { line: 1, column: 24 } },
            { tag: 13, value: '|', start: { line: 1, column: 25 }, end: { line: 1, column: 26 } },
            { tag: 14, value: '!', start: { line: 1, column: 27 }, end: { line: 1, column: 28 } },
            { tag: 15, value: '==', start: { line: 1, column: 29 }, end: { line: 1, column: 31 } },
            { tag: 16, value: '!=', start: { line: 1, column: 32 }, end: { line: 1, column: 34 } },
            { tag: 17, value: '>', start: { line: 1, column: 35 }, end: { line: 1, column: 36 } },
            { tag: 18, value: '<', start: { line: 1, column: 37 }, end: { line: 1, column: 38 } },
            { tag: 19, value: '>=', start: { line: 1, column: 39 }, end: { line: 1, column: 41 } },
            { tag: 20, value: '<=', start: { line: 1, column: 42 }, end: { line: 1, column: 44 } },
            { tag: 21, value: '=', start: { line: 1, column: 45 }, end: { line: 1, column: 46 } },
            { tag: 22, value: '(', start: { line: 1, column: 47 }, end: { line: 1, column: 48 } },
            { tag: 23, value: ')', start: { line: 1, column: 49 }, end: { line: 1, column: 50 } },
            { tag: 24, value: '[', start: { line: 1, column: 51 }, end: { line: 1, column: 52 } },
            { tag: 25, value: ']', start: { line: 1, column: 53 }, end: { line: 1, column: 54 } },
            { tag: 26, value: '{', start: { line: 1, column: 55 }, end: { line: 1, column: 56 } },
            { tag: 27, value: '}', start: { line: 1, column: 57 }, end: { line: 1, column: 58 } },
            { tag: 28, value: ',', start: { line: 1, column: 59 }, end: { line: 1, column: 60 } },
            { tag: 29, value: '.', start: { line: 1, column: 61 }, end: { line: 1, column: 62 } },
            { tag: 0, value: '', start: { line: 1, column: 62 }, end: { line: 1, column: 62 } }
        ];

        lexerTest(source, expected);
    });

    test("keywords", () => {
        const source = `num str bool randomIdentifier 7 "text" if else while for return switch case break default class this true false print read null _`;

        const expected = [
            { tag: 31, value: 'num', start: { line: 1, column: 1 }, end: { line: 1, column: 4 } },
            { tag: 32, value: 'str', start: { line: 1, column: 5 }, end: { line: 1, column: 8 } },
            { tag: 33, value: 'bool', start: { line: 1, column: 9 }, end: { line: 1, column: 13 } },
            { tag: 34, value: 'randomIdentifier', start: { line: 1, column: 14 }, end: { line: 1, column: 30 } },
            { tag: 35, value: '7', start: { line: 1, column: 31 }, end: { line: 1, column: 32 } },
            { tag: 36, value: 'text', start: { line: 1, column: 33 }, end: { line: 1, column: 39 } },
            { tag: 37, value: 'if', start: { line: 1, column: 40 }, end: { line: 1, column: 42 } },
            { tag: 38, value: 'else', start: { line: 1, column: 43 }, end: { line: 1, column: 47 } },
            { tag: 39, value: 'while', start: { line: 1, column: 48 }, end: { line: 1, column: 53 } },
            { tag: 40, value: 'for', start: { line: 1, column: 54 }, end: { line: 1, column: 57 } },
            { tag: 41, value: 'return', start: { line: 1, column: 58 }, end: { line: 1, column: 64 } },
            { tag: 42, value: 'switch', start: { line: 1, column: 65 }, end: { line: 1, column: 71 } },
            { tag: 43, value: 'case', start: { line: 1, column: 72 }, end: { line: 1, column: 76 } },
            { tag: 44, value: 'break', start: { line: 1, column: 77 }, end: { line: 1, column: 82 } },
            { tag: 45, value: 'default', start: { line: 1, column: 83 }, end: { line: 1, column: 90 } },
            { tag: 46, value: 'class', start: { line: 1, column: 91 }, end: { line: 1, column: 96 } },
            { tag: 47, value: 'this', start: { line: 1, column: 97 }, end: { line: 1, column: 101 } },
            { tag: 48, value: 'true', start: { line: 1, column: 102 }, end: { line: 1, column: 106 } },
            { tag: 49, value: 'false', start: { line: 1, column: 107 }, end: { line: 1, column: 112 } },
            { tag: 50, value: 'print', start: { line: 1, column: 113 }, end: { line: 1, column: 118 } },
            { tag: 51, value: 'read', start: { line: 1, column: 119 }, end: { line: 1, column: 123 } },
            { tag: 52, value: 'null', start: { line: 1, column: 124 }, end: { line: 1, column: 128 } },
            { tag: 53, value: '_', start: { line: 1, column: 129 }, end: { line: 1, column: 130 } },
            { tag: 0, value: '', start: { line: 1, column: 130 }, end: { line: 1, column: 130 } }
        ];

        lexerTest(source, expected);
    });
});