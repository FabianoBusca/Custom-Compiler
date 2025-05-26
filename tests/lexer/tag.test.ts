import {lexerTest} from "@tests/utils";
import {createToken} from "@src/data";

describe("Tags", () => {

    test("symbols", () => {
        const source = `+ - * / % ** -- += -= & | ! == != > < >= <= = ( ) [ ] { } , .`;

        const expected = [
            createToken(1, '+', {line: 1, column: 1}, {line: 1, column: 2}),
            createToken(2, '-', {line: 1, column: 3}, {line: 1, column: 4}),
            createToken(3, '*', {line: 1, column: 5}, {line: 1, column: 6}),
            createToken(4, '/', {line: 1, column: 7}, {line: 1, column: 8}),
            createToken(5, '%', {line: 1, column: 9}, {line: 1, column: 10}),
            createToken(6, '**', {line: 1, column: 11}, {line: 1, column: 13}),
            createToken(9, '--', {line: 1, column: 14}, {line: 1, column: 16}),
            createToken(10, '+=', {line: 1, column: 17}, {line: 1, column: 19}),
            createToken(11, '-=', {line: 1, column: 20}, {line: 1, column: 22}),
            createToken(12, '&', {line: 1, column: 23}, {line: 1, column: 24}),
            createToken(13, '|', {line: 1, column: 25}, {line: 1, column: 26}),
            createToken(14, '!', {line: 1, column: 27}, {line: 1, column: 28}),
            createToken(15, '==', {line: 1, column: 29}, {line: 1, column: 31}),
            createToken(16, '!=', {line: 1, column: 32}, {line: 1, column: 34}),
            createToken(17, '>', {line: 1, column: 35}, {line: 1, column: 36}),
            createToken(18, '<', {line: 1, column: 37}, {line: 1, column: 38}),
            createToken(19, '>=', {line: 1, column: 39}, {line: 1, column: 41}),
            createToken(20, '<=', {line: 1, column: 42}, {line: 1, column: 44}),
            createToken(21, '=', {line: 1, column: 45}, {line: 1, column: 46}),
            createToken(22, '(', {line: 1, column: 47}, {line: 1, column: 48}),
            createToken(23, ')', {line: 1, column: 49}, {line: 1, column: 50}),
            createToken(24, '[', {line: 1, column: 51}, {line: 1, column: 52}),
            createToken(25, ']', {line: 1, column: 53}, {line: 1, column: 54}),
            createToken(26, '{', {line: 1, column: 55}, {line: 1, column: 56}),
            createToken(27, '}', {line: 1, column: 57}, {line: 1, column: 58}),
            createToken(28, ',', {line: 1, column: 59}, {line: 1, column: 60}),
            createToken(29, '.', {line: 1, column: 61}, {line: 1, column: 62}),
            createToken(0, '', {line: 1, column: 62}, {line: 1, column: 62})
        ];

        lexerTest(source, expected);
    });

    test("keywords", () => {
        const source = `num str bool randomIdentifier 7 "text" if else while for return switch case break default class this true false print read null _`;

        const expected = [
            createToken(31, 'num', {line: 1, column: 1}, {line: 1, column: 4}),
            createToken(32, 'str', {line: 1, column: 5}, {line: 1, column: 8}),
            createToken(33, 'bool', {line: 1, column: 9}, {line: 1, column: 13}),
            createToken(34, 'randomIdentifier', {line: 1, column: 14}, {line: 1, column: 30}),
            createToken(35, '7', {line: 1, column: 31}, {line: 1, column: 32}),
            createToken(36, 'text', {line: 1, column: 33}, {line: 1, column: 39}),
            createToken(37, 'if', {line: 1, column: 40}, {line: 1, column: 42}),
            createToken(38, 'else', {line: 1, column: 43}, {line: 1, column: 47}),
            createToken(39, 'while', {line: 1, column: 48}, {line: 1, column: 53}),
            createToken(40, 'for', {line: 1, column: 54}, {line: 1, column: 57}),
            createToken(41, 'return', {line: 1, column: 58}, {line: 1, column: 64}),
            createToken(42, 'switch', {line: 1, column: 65}, {line: 1, column: 71}),
            createToken(43, 'case', {line: 1, column: 72}, {line: 1, column: 76}),
            createToken(44, 'break', {line: 1, column: 77}, {line: 1, column: 82}),
            createToken(45, 'default', {line: 1, column: 83}, {line: 1, column: 90}),
            createToken(46, 'class', {line: 1, column: 91}, {line: 1, column: 96}),
            createToken(47, 'this', {line: 1, column: 97}, {line: 1, column: 101}),
            createToken(48, 'true', {line: 1, column: 102}, {line: 1, column: 106}),
            createToken(49, 'false', {line: 1, column: 107}, {line: 1, column: 112}),
            createToken(50, 'print', {line: 1, column: 113}, {line: 1, column: 118}),
            createToken(51, 'read', {line: 1, column: 119}, {line: 1, column: 123}),
            createToken(52, 'null', {line: 1, column: 124}, {line: 1, column: 128}),
            createToken(53, '_', {line: 1, column: 129}, {line: 1, column: 130}),
            createToken(0, '', {line: 1, column: 130}, {line: 1, column: 130})
        ];

        lexerTest(source, expected);
    });
});