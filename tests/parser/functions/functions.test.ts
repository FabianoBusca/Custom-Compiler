import {parserTest} from "@tests/utils";
import {ASTFactory} from "@src/utils";

describe("Function calls and declarations", () => {
    test("Function declaration - 1", () => {
        const source = "a = foo() {}";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createFunctionDeclaration(
                    [
                        ASTFactory.createType(
                            "a",
                            0,
                            {line: 1, column: 1},
                            {line: 1, column: 2},
                        ),
                    ],
                    ASTFactory.createIdentifier({
                        tag: 34,
                        value: "foo",
                        start: {line: 1, column: 5},
                        end: {line: 1, column: 8},
                    }),
                    [],
                    [],
                    {line: 1, column: 1},
                    {line: 1, column: 13},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 13},
        );

        parserTest(source, expected);
    });

    test("Function declaration - 2", () => {
        const source = "a = foo(num a) {}";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createFunctionDeclaration(
                    [
                        ASTFactory.createType(
                            "a",
                            0,
                            {line: 1, column: 1},
                            {line: 1, column: 2},
                        ),
                    ],
                    ASTFactory.createIdentifier({
                        tag: 34,
                        value: "foo",
                        start: {line: 1, column: 5},
                        end: {line: 1, column: 8},
                    }),
                    [
                        ASTFactory.createVariableDeclaration(
                            ASTFactory.createType(
                                "num",
                                0,
                                {line: 1, column: 9},
                                {line: 1, column: 12},
                            ),
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "a",
                                start: {line: 1, column: 13},
                                end: {line: 1, column: 14},
                            }),
                        ),
                    ],
                    [],
                    {line: 1, column: 1},
                    {line: 1, column: 18},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 18},
        );

        parserTest(source, expected);
    });

    test("Function declaration - 3", () => {
        const source = "a = foo(b[] c) {}";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createFunctionDeclaration(
                    [
                        ASTFactory.createType(
                            "a",
                            0,
                            {line: 1, column: 1},
                            {line: 1, column: 2},
                        ),
                    ],
                    ASTFactory.createIdentifier({
                        tag: 34,
                        value: "foo",
                        start: {line: 1, column: 5},
                        end: {line: 1, column: 8},
                    }),
                    [
                        ASTFactory.createVariableDeclaration(
                            ASTFactory.createType(
                                "b",
                                1,
                                {line: 1, column: 9},
                                {line: 1, column: 12},
                            ),
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "c",
                                start: {line: 1, column: 13},
                                end: {line: 1, column: 14},
                            }),
                        ),
                    ],
                    [],
                    {line: 1, column: 1},
                    {line: 1, column: 18},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 18},
        );

        parserTest(source, expected);
    });

    test("Function call assignment - 1", () => {
        const source = "a = foo()";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createVariableOperations(
                    [
                        ASTFactory.createVariableAssignment(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "a",
                                start: {line: 1, column: 1},
                                end: {line: 1, column: 2},
                            }),
                        ),
                    ],
                    21,
                    [
                        ASTFactory.createFunctionCall(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "foo",
                                start: {line: 1, column: 5},
                                end: {line: 1, column: 8},
                            }),
                            [],
                            {line: 1, column: 5},
                            {line: 1, column: 10},
                        ),
                    ],
                    {line: 1, column: 1},
                    {line: 1, column: 10},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 10},
        );

        parserTest(source, expected);
    });

    test("Function call assignment - 2", () => {
        const source = "a = foo(b.j().l[0])[0]";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createVariableOperations(
                    [
                        ASTFactory.createVariableAssignment(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "a",
                                start: {line: 1, column: 1},
                                end: {line: 1, column: 2},
                            }),
                        ),
                    ],
                    21,
                    [
                        ASTFactory.createArrayElement(
                            ASTFactory.createFunctionCall(
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "foo",
                                    start: {line: 1, column: 5},
                                    end: {line: 1, column: 8},
                                }),
                                [
                                    ASTFactory.createArrayElement(
                                        ASTFactory.createMemberAttribute(
                                            ASTFactory.createMemberFunctionCall(
                                                ASTFactory.createIdentifier({
                                                    tag: 34,
                                                    value: "b",
                                                    start: {line: 1, column: 9},
                                                    end: {line: 1, column: 10},
                                                }),
                                                ASTFactory.createFunctionCall(
                                                    ASTFactory.createIdentifier({
                                                        tag: 34,
                                                        value: "j",
                                                        start: {line: 1, column: 11},
                                                        end: {line: 1, column: 12},
                                                    }),
                                                    [],
                                                    {line: 1, column: 11},
                                                    {line: 1, column: 14},
                                                ),
                                            ),
                                            ASTFactory.createIdentifier({
                                                tag: 34,
                                                value: "l",
                                                start: {line: 1, column: 15},
                                                end: {line: 1, column: 16},
                                            }),
                                        ),
                                        [
                                            ASTFactory.createNumberNode({
                                                tag: 35,
                                                value: "0",
                                                start: {line: 1, column: 17},
                                                end: {line: 1, column: 18},
                                            }),
                                        ],
                                        {line: 1, column: 9},
                                        {line: 1, column: 19},
                                    ),
                                ],
                                {line: 1, column: 5},
                                {line: 1, column: 20},
                            ),
                            [
                                ASTFactory.createNumberNode({
                                    tag: 35,
                                    value: "0",
                                    start: {line: 1, column: 21},
                                    end: {line: 1, column: 22},
                                }),
                            ],
                            {line: 1, column: 5},
                            {line: 1, column: 23},
                        ),
                    ],
                    {line: 1, column: 1},
                    {line: 1, column: 23},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 23},
        );

        parserTest(source, expected);
    });

    test("Function call assignment - 3", () => {
        const source = "a, b, str d = foo().k(7 ** 2) + 1, 5, 'Hello'";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createVariableOperations(
                    [
                        ASTFactory.createVariableAssignment(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "a",
                                start: {line: 1, column: 1},
                                end: {line: 1, column: 2},
                            }),
                        ),
                        ASTFactory.createVariableAssignment(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "b",
                                start: {line: 1, column: 4},
                                end: {line: 1, column: 5},
                            }),
                        ),
                        ASTFactory.createVariableDeclaration(
                            ASTFactory.createType(
                                "str",
                                0,
                                {line: 1, column: 7},
                                {line: 1, column: 10},
                            ),
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "d",
                                start: {line: 1, column: 11},
                                end: {line: 1, column: 12},
                            }),
                        ),
                    ],
                    21,
                    [
                        ASTFactory.createBinaryExpression(
                            ASTFactory.createMemberFunctionCall(
                                ASTFactory.createFunctionCall(
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: "foo",
                                        start: {line: 1, column: 15},
                                        end: {line: 1, column: 18},
                                    }),
                                    [],
                                    {line: 1, column: 15},
                                    {line: 1, column: 20},
                                ),
                                ASTFactory.createFunctionCall(
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: "k",
                                        start: {line: 1, column: 21},
                                        end: {line: 1, column: 22},
                                    }),
                                    [
                                        ASTFactory.createBinaryExpression(
                                            ASTFactory.createNumberNode({
                                                tag: 35,
                                                value: "7",
                                                start: {line: 1, column: 23},
                                                end: {line: 1, column: 24},
                                            }),
                                            6,
                                            ASTFactory.createNumberNode({
                                                tag: 35,
                                                value: "2",
                                                start: {line: 1, column: 28},
                                                end: {line: 1, column: 29},
                                            }),
                                        ),
                                    ],
                                    {line: 1, column: 21},
                                    {line: 1, column: 30},
                                ),
                            ),
                            1,
                            ASTFactory.createNumberNode({
                                tag: 35,
                                value: "1",
                                start: {line: 1, column: 33},
                                end: {line: 1, column: 34},
                            }),
                        ),
                        ASTFactory.createNumberNode({
                            tag: 35,
                            value: "5",
                            start: {line: 1, column: 36},
                            end: {line: 1, column: 37},
                        }),
                        ASTFactory.createFString(
                            [
                                ASTFactory.createStringNode({
                                    tag: 36,
                                    value: "Hello",
                                    start: {line: 1, column: 40},
                                    end: {line: 1, column: 45},
                                }),
                            ],
                            {line: 1, column: 39},
                            {line: 1, column: 46},
                        ),
                    ],
                    {line: 1, column: 1},
                    {line: 1, column: 46},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 46},
        );

        parserTest(source, expected);
    });
});

describe("Underscore functions", () => {
    test("Constructor declaration - 1", () => {
        const source = "a = _() {}";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createFunctionDeclaration(
                    [
                        ASTFactory.createType(
                            "a",
                            0,
                            {line: 1, column: 1},
                            {line: 1, column: 2},
                        ),
                    ],
                    ASTFactory.createIdentifier({
                        tag: 53,
                        value: "_",
                        start: {line: 1, column: 5},
                        end: {line: 1, column: 6},
                    }),
                    [],
                    [],
                    {line: 1, column: 1},
                    {line: 1, column: 11},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 11},
        );

        parserTest(source, expected);
    });

    test("Constructor declaration - 2", () => {
        const source = "a = _(num a) {}";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createFunctionDeclaration(
                    [
                        ASTFactory.createType(
                            "a",
                            0,
                            {line: 1, column: 1},
                            {line: 1, column: 2},
                        ),
                    ],
                    ASTFactory.createIdentifier({
                        tag: 53,
                        value: "_",
                        start: {line: 1, column: 5},
                        end: {line: 1, column: 6},
                    }),
                    [
                        ASTFactory.createVariableDeclaration(
                            ASTFactory.createType(
                                "num",
                                0,
                                {line: 1, column: 7},
                                {line: 1, column: 10},
                            ),
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "a",
                                start: {line: 1, column: 11},
                                end: {line: 1, column: 12},
                            }),
                        ),
                    ],
                    [],
                    {line: 1, column: 1},
                    {line: 1, column: 16},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 16},
        );

        parserTest(source, expected);
    });

    test("Constructor declaration - 3", () => {
        const source = "a = _(b[] c) {}";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createFunctionDeclaration(
                    [
                        ASTFactory.createType(
                            "a",
                            0,
                            {line: 1, column: 1},
                            {line: 1, column: 2},
                        ),
                    ],
                    ASTFactory.createIdentifier({
                        tag: 53,
                        value: "_",
                        start: {line: 1, column: 5},
                        end: {line: 1, column: 6},
                    }),
                    [
                        ASTFactory.createVariableDeclaration(
                            ASTFactory.createType(
                                "b",
                                1,
                                {line: 1, column: 7},
                                {line: 1, column: 10},
                            ),
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "c",
                                start: {line: 1, column: 11},
                                end: {line: 1, column: 12},
                            }),
                        ),
                    ],
                    [],
                    {line: 1, column: 1},
                    {line: 1, column: 16},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 16},
        );

        parserTest(source, expected);
    });

    test("Constructor call - 1", () => {
        const source = "a = _()";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createVariableOperations(
                    [
                        ASTFactory.createVariableAssignment(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "a",
                                start: {line: 1, column: 1},
                                end: {line: 1, column: 2},
                            }),
                        ),
                    ],
                    21,
                    [
                        ASTFactory.createFunctionCall(
                            ASTFactory.createIdentifier({
                                tag: 53,
                                value: "_",
                                start: {line: 1, column: 5},
                                end: {line: 1, column: 6},
                            }),
                            [],
                            {line: 1, column: 5},
                            {line: 1, column: 8},
                        ),
                    ],
                    {line: 1, column: 1},
                    {line: 1, column: 8},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 8},
        );

        parserTest(source, expected);
    });

    test("Constructor call - 2", () => {
        const source = "a a = _()";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createVariableOperations(
                    [
                        ASTFactory.createVariableDeclaration(
                            ASTFactory.createType(
                                "a",
                                0,
                                {line: 1, column: 1},
                                {line: 1, column: 2},
                            ),
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "a",
                                start: {line: 1, column: 3},
                                end: {line: 1, column: 4},
                            }),
                        ),
                    ],
                    21,
                    [
                        ASTFactory.createFunctionCall(
                            ASTFactory.createIdentifier({
                                tag: 53,
                                value: "_",
                                start: {line: 1, column: 7},
                                end: {line: 1, column: 8},
                            }),
                            [],
                            {line: 1, column: 7},
                            {line: 1, column: 10},
                        ),
                    ],
                    {line: 1, column: 1},
                    {line: 1, column: 10},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 10},
        );

        parserTest(source, expected);
    });

    test("Constructor call - 3", () => {
        const source = "a = _(b.j().l[0])[0].d";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createVariableOperations(
                    [
                        ASTFactory.createVariableAssignment(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "a",
                                start: {line: 1, column: 1},
                                end: {line: 1, column: 2},
                            }),
                        ),
                    ],
                    21,
                    [
                        ASTFactory.createMemberAttribute(
                            ASTFactory.createArrayElement(
                                ASTFactory.createFunctionCall(
                                    ASTFactory.createIdentifier({
                                        tag: 53,
                                        value: "_",
                                        start: {line: 1, column: 5},
                                        end: {line: 1, column: 6},
                                    }),
                                    [
                                        ASTFactory.createArrayElement(
                                            ASTFactory.createMemberAttribute(
                                                ASTFactory.createMemberFunctionCall(
                                                    ASTFactory.createIdentifier({
                                                        tag: 34,
                                                        value: "b",
                                                        start: {line: 1, column: 7},
                                                        end: {line: 1, column: 8},
                                                    }),
                                                    ASTFactory.createFunctionCall(
                                                        ASTFactory.createIdentifier({
                                                            tag: 34,
                                                            value: "j",
                                                            start: {line: 1, column: 9},
                                                            end: {line: 1, column: 10},
                                                        }),
                                                        [],
                                                        {line: 1, column: 9},
                                                        {line: 1, column: 12},
                                                    ),
                                                ),
                                                ASTFactory.createIdentifier({
                                                    tag: 34,
                                                    value: "l",
                                                    start: {line: 1, column: 13},
                                                    end: {line: 1, column: 14},
                                                }),
                                            ),
                                            [
                                                ASTFactory.createNumberNode({
                                                    tag: 35,
                                                    value: "0",
                                                    start: {line: 1, column: 15},
                                                    end: {line: 1, column: 16},
                                                }),
                                            ],
                                            {line: 1, column: 7},
                                            {line: 1, column: 17},
                                        ),
                                    ],
                                    {line: 1, column: 5},
                                    {line: 1, column: 18},
                                ),
                                [
                                    ASTFactory.createNumberNode({
                                        tag: 35,
                                        value: "0",
                                        start: {line: 1, column: 19},
                                        end: {line: 1, column: 20},
                                    }),
                                ],
                                {line: 1, column: 5},
                                {line: 1, column: 21},
                            ),
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "d",
                                start: {line: 1, column: 22},
                                end: {line: 1, column: 23},
                            }),
                        )
                    ],
                    {line: 1, column: 1},
                    {line: 1, column: 23},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 23},
        );

        parserTest(source, expected);
    });

    test("Constructor call - 4", () => {
        const source = "a = _() + 1";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createVariableOperations(
                    [
                        ASTFactory.createVariableAssignment(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "a",
                                start: {line: 1, column: 1},
                                end: {line: 1, column: 2},
                            }),
                        ),
                    ],
                    21,
                    [
                        ASTFactory.createBinaryExpression(
                            ASTFactory.createFunctionCall(
                                ASTFactory.createIdentifier({
                                    tag: 53,
                                    value: "_",
                                    start: {line: 1, column: 5},
                                    end: {line: 1, column: 6},
                                }),
                                [],
                                {line: 1, column: 5},
                                {line: 1, column: 8},
                            ),
                            1,
                            ASTFactory.createNumberNode({
                                tag: 35,
                                value: "1",
                                start: {line: 1, column: 11},
                                end: {line: 1, column: 12},
                            }),
                        ),
                    ],
                    {line: 1, column: 1},
                    {line: 1, column: 12},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 12},
        );

        parserTest(source, expected);
    });
});

test("Complex function statement", () => {
    const source = "x, str y, bool[] w, _, _, dog[][][] d = foobar()";

    const expected = ASTFactory.createProgram(
        [
            ASTFactory.createVariableOperations(
                [
                    ASTFactory.createVariableAssignment(
                        ASTFactory.createIdentifier({
                            tag: 34,
                            value: "x",
                            start: {line: 1, column: 1},
                            end: {line: 1, column: 2},
                        }),
                    ),
                    ASTFactory.createVariableDeclaration(
                        ASTFactory.createType(
                            "str",
                            0,
                            {line: 1, column: 4},
                            {line: 1, column: 7},
                        ),
                        ASTFactory.createIdentifier({
                            tag: 34,
                            value: "y",
                            start: {line: 1, column: 8},
                            end: {line: 1, column: 9},
                        }),
                    ),
                    ASTFactory.createVariableDeclaration(
                        ASTFactory.createType(
                            "bool",
                            1,
                            {line: 1, column: 11},
                            {line: 1, column: 17},
                        ),
                        ASTFactory.createIdentifier({
                            tag: 34,
                            value: "w",
                            start: {line: 1, column: 18},
                            end: {line: 1, column: 19},
                        }),
                    ),
                    ASTFactory.createVariableAssignment(
                        ASTFactory.createIdentifier({
                            tag: 53,
                            value: "_",
                            start: {line: 1, column: 21},
                            end: {line: 1, column: 22},
                        }),
                    ),
                    ASTFactory.createVariableAssignment(
                        ASTFactory.createIdentifier({
                            tag: 53,
                            value: "_",
                            start: {line: 1, column: 24},
                            end: {line: 1, column: 25},
                        }),
                    ),
                    ASTFactory.createVariableDeclaration(
                        ASTFactory.createType(
                            "dog",
                            3,
                            {line: 1, column: 27},
                            {line: 1, column: 36},
                        ),
                        ASTFactory.createIdentifier({
                            tag: 34,
                            value: "d",
                            start: {line: 1, column: 37},
                            end: {line: 1, column: 38},
                        }),
                    ),
                ],
                21,
                [
                    ASTFactory.createFunctionCall(
                        ASTFactory.createIdentifier({
                            tag: 34,
                            value: "foobar",
                            start: {line: 1, column: 41},
                            end: {line: 1, column: 47},
                        }),
                        [],
                        {line: 1, column: 41},
                        {line: 1, column: 49},
                    ),
                ],
                {line: 1, column: 1},
                {line: 1, column: 49},
            ),
        ],
        {line: 1, column: 1},
        {line: 1, column: 49},
    );

    parserTest(source, expected);
});
