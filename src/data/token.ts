import {Location} from "@src/utils";

export enum Tag {
    EOF,        // End of file
    PLUS,       // +
    MINUS,      // -
    TIMES,      // *
    DIV,        // /
    MOD,        // %
    POW,        // **
    INT_DIV,    // //
    INC,        // ++
    DEC,        // --
    SELF_INC,  // +=
    SELF_DEC,  // -=
    AND,        // &
    OR,         // |
    NOT,        // !
    EQ,         // ==
    NE,         // !=
    GT,         // >
    LT,         // <
    GE,         // >=
    LE,         // <=
    ASSIGN,     // =
    LRP,        // (
    RRP,        // )
    LSP,        // [
    RSP,        // ]
    LCP,        // {
    RCP,        // }
    COMMA,      // ,
    DOT,        // .
    QUOTE,      // '
    NUM,        // num
    STR,        // str
    BOOL,       // bool
    ID,
    NUMBER,
    TEXT,
    IF,         // if
    ELSE,       // else
    WHILE,      // while
    FOR,        // for
    RETURN,     // return
    SWITCH,     // switch
    CASE,       // case
    BREAK,      // break
    DEFAULT,    // default
    CLASS,      // class
    THIS,       // this
    TRUE,       // true
    FALSE,      // false
    PRINT,      // print
    READ,       // read
    NULL,       // null
    UNDERSCORE  // _
}

export interface Token {
    tag: Tag;
    value: string;
    start: Location;
    end: Location;
}

export function createToken(tag: Tag, value: string, start: Location, end: Location): Token {
    return {tag, value, start, end};
}