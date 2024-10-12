import {lexerTest} from "../utils";
import {DayErr} from "../../src/utils";

describe("Lexical Errors", () => {
  
  test("Unexpected character", () => {
    const source = `num x = 10 @ 5`;
    const expected = [
      {tag: 31, value: 'num', start: {line: 1, column: 1}, end: {line: 1, column: 4}},
      {tag: 34, value: 'x', start: {line: 1, column: 5}, end: {line: 1, column: 6}},
      {tag: 21, value: '=', start: {line: 1, column: 7}, end: {line: 1, column: 8}},
      {tag: 35, value: '10', start: {line: 1, column: 9}, end: {line: 1, column: 11}}
    ];
    const errors: DayErr[] = [new DayErr("Unexpected character: @", "Lexical Error", 1, 11, 12, "num x = 10 @ 5")];
    
    lexerTest(source, expected, errors);
  });
  
  test("Unterminated F-string", () => {
    const source = `str s = 'Hello, World! {9 + 9}`;
    const expected = [
      {tag: 32, value: 'str', start: {line: 1, column: 1}, end: {line: 1, column: 4}},
      {tag: 34, value: 's', start: {line: 1, column: 5}, end: {line: 1, column: 6}},
      {tag: 21, value: '=', start: {line: 1, column: 7}, end: {line: 1, column: 8}},
      {tag: 30, value: "'", start: {line: 1, column: 9}, end: {line: 1, column: 10}},
      {tag: 36, value: 'Hello, World! ', start: {line: 1, column: 10}, end: {line: 1, column: 24}},
      {tag: 26, value: '{', start: {line: 1, column: 24}, end: {line: 1, column: 25}},
      {tag: 35, value: '9', start: {line: 1, column: 25}, end: {line: 1, column: 26}},
      {tag: 1, value: '+', start: {line: 1, column: 27}, end: {line: 1, column: 28}},
      {tag: 35, value: '9', start: {line: 1, column: 29}, end: {line: 1, column: 30}},
      {tag: 27, value: '}', start: {line: 1, column: 30}, end: {line: 1, column: 31}}
    ];
    const errors: DayErr[] = [new DayErr("Unterminated f-string", "Lexical Error", 1, 30, 31, "str s = 'Hello, World! {9 + 9}")];
    
    lexerTest(source, expected, errors);
  });
  
  test("Unterminated string", () => {
    const source = `str s = "Hello, World!`;
    const expected = [
      {tag: 32, value: 'str', start: {line: 1, column: 1}, end: {line: 1, column: 4}},
      {tag: 34, value: 's', start: {line: 1, column: 5}, end: {line: 1, column: 6}},
      {tag: 21, value: '=', start: {line: 1, column: 7}, end: {line: 1, column: 8}}
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