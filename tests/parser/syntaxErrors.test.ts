import {ASTFactory, DayErr, Location} from "@src/utils";
import {parserTest} from "@tests/utils";
import {createToken, Program} from "@src/data";

describe("Syntax errors", () => {
    test("Expected character - 1", () => {
        const source = "num[][ x";

        const expected = ASTFactory.createProgram(
            [],
            {line: 1, column: 1},
            null as unknown as Location
        );

        const errors: DayErr[] = [
            new DayErr("Expected ']'", "Syntax Error", 1, 7, 8, "num[][ x")
        ];

        parserTest(source, expected, errors);
    });

    test("Expected character - 2", () => {
        const source = `print z`;
        const expected: Program = ASTFactory.createProgram(
            [],
            {line: 1, column: 1},
            null as unknown as Location
        );

        const errors: DayErr[] = [
            new DayErr("Expected '('", "Syntax Error", 1, 6, 7, "print z")
        ];

        parserTest(source, expected, errors);
    });

    test("Unexpected character - 1", () => {
        const source = `x,`;
        const expected = ASTFactory.createProgram(
            [],
            {line: 1, column: 1},
            null as unknown as Location
        );

        const errors: DayErr[] = [
            new DayErr("Unexpected character", "Syntax Error", 1, 2, 3, "x,")
        ];

        parserTest(source, expected, errors);
    });

    test("Unexpected character - 2", () => {
        const source = `bool this`;
        const expected = ASTFactory.createProgram(
            [],
            {line: 1, column: 1},
            null as unknown as Location
        );

        const errors: DayErr[] = [
            new DayErr("Unexpected character", "Syntax Error", 1, 6, 10, "bool this")
        ];

        parserTest(source, expected, errors);
    });

    test("Unexpected statement", () => {
        const source = `print(9)\n"Hello, World!"`;

        const expected: Program = ASTFactory.createProgram(
            [
                ASTFactory.createPrintStatement(
                    [
                        ASTFactory.createNumberNode(
                            createToken(31, "9", {line: 1, column: 7}, {line: 1, column: 8})
                        )
                    ],
                    {line: 1, column: 1},
                    {line: 1, column: 9}
                )
            ],
            {line: 1, column: 1},
            null as unknown as Location
        );

        const errors: DayErr[] = [
            new DayErr("Unexpected statement", "Syntax Error", 2, 1, 16, "\"Hello, World!\"")
        ];

        parserTest(source, expected, errors);
    });
});