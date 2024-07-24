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
    AND,        // &&
    OR,         // ||
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
    QUOTE,      // "
    NUM,        // num
    STR,        // str
    BOOL,       // bool
    ARR,        // arr
    ID,
    NUMBER,
    TEXT,
    IF,         // if
    ELSE,       // else
    WHILE,      // while
    FOR,        // for
    RET,        // ret
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
    line: number;
    column: number;
}