import {parserTest} from "@tests/utils";
import {ASTFactory} from "@src/utils";

describe("Variables declarations and assignment", () => {
    test("Variable declaration - 1", () => {
        const source = "num x";

        const expected = ASTFactory.createProgram(
            [
                ASTFactory.createVariableOperations(
                    [
                        ASTFactory.createVariableDeclaration(
                            ASTFactory.createType(
                                "num",
                                0,
                                {line: 1, column: 1},
                                {line: 1, column: 4},
                            ),
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "x",
                                start: {line: 1, column: 5},
                                end: {line: 1, column: 6},
                            }),
                        ),
                    ],
                    null,
                    [],
                    {line: 1, column: 1},
                    {line: 1, column: 6},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 6},
        );

        parserTest(source, expected);
    });

    test("Variable declaration - 2", () => {
            const source = "num x, str y, bool z";

            const expected = ASTFactory.createProgram(
                [
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "num",
                                    0,
                                    {line: 1, column: 1},
                                    {line: 1, column: 4},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "x",
                                    start: {line: 1, column: 5},
                                    end: {line: 1, column: 6},
                                }),
                            ),
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "str",
                                    0,
                                    {line: 1, column: 8},
                                    {line: 1, column: 11},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "y",
                                    start: {line: 1, column: 12},
                                    end: {line: 1, column: 13},
                                }),
                            ),
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "bool",
                                    0,
                                    {line: 1, column: 15},
                                    {line: 1, column: 19},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "z",
                                    start: {line: 1, column: 20},
                                    end: {line: 1, column: 21},
                                }),
                            ),
                        ],
                        null,
                        [],
                        {line: 1, column: 1},
                        {line: 1, column: 21},
                    ),
                ],
                {line: 1, column: 1},
                {line: 1, column: 21},
            );

            parserTest(source, expected);
        }
    );

    test("Variable declaration - 3", () => {
            const source = "dog d = _('Buddy', 5)";

            const expected = ASTFactory.createProgram(
                [
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "dog",
                                    0,
                                    {line: 1, column: 1},
                                    {line: 1, column: 4},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "d",
                                    start: {line: 1, column: 5},
                                    end: {line: 1, column: 6},
                                }),
                            ),
                        ],
                        21,
                        [
                            ASTFactory.createFunctionCall(
                                ASTFactory.createIdentifier({
                                    tag: 53,
                                    value: "_",
                                    start: {line: 1, column: 9},
                                    end: {line: 1, column: 10},
                                }),
                                [
                                    ASTFactory.createFString(
                                        [
                                            ASTFactory.createStringNode({
                                                tag: 30,
                                                value: "Buddy",
                                                start: {line: 1, column: 12},
                                                end: {line: 1, column: 17},
                                            }),
                                        ],
                                        {line: 1, column: 11},
                                        {line: 1, column: 18},
                                    ),
                                    ASTFactory.createNumberNode({
                                        tag: 35,
                                        value: "5",
                                        start: {line: 1, column: 20},
                                        end: {line: 1, column: 21},
                                    }),
                                ],
                                {line: 1, column: 9},
                                {line: 1, column: 22},
                            ),
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 22},
                    ),
                ],
                {line: 1, column: 1},
                {line: 1, column: 22},
            );

            parserTest(source, expected);
        }
    );

    test("Variable declaration - 4", () => {
            const source = "dog d, x, _, bool b = 0";

            const expected = ASTFactory.createProgram(
                [
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "dog",
                                    0,
                                    {line: 1, column: 1},
                                    {line: 1, column: 4},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "d",
                                    start: {line: 1, column: 5},
                                    end: {line: 1, column: 6},
                                }),
                            ),
                            ASTFactory.createVariableAssignment(
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "x",
                                    start: {line: 1, column: 8},
                                    end: {line: 1, column: 9},
                                }),
                            ),
                            ASTFactory.createVariableAssignment(
                                ASTFactory.createIdentifier({
                                    tag: 53,
                                    value: "_",
                                    start: {line: 1, column: 11},
                                    end: {line: 1, column: 12},
                                }),
                            ),
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "bool",
                                    0,
                                    {line: 1, column: 14},
                                    {line: 1, column: 18},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "b",
                                    start: {line: 1, column: 19},
                                    end: {line: 1, column: 20},
                                }),
                            ),
                        ],
                        21,
                        [
                            ASTFactory.createNumberNode({
                                tag: 35,
                                value: "0",
                                start: {line: 1, column: 23},
                                end: {line: 1, column: 24},
                            }),
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 24},
                    ),
                ],
                {line: 1, column: 1},
                {line: 1, column: 24},
            );

            parserTest(source, expected);
        }
    );

    test("Variable assignment - 1", () => {
            const source = "a = foo()[0]";

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
                                    [],
                                    {line: 1, column: 5},
                                    {line: 1, column: 10},
                                ),
                                [
                                    ASTFactory.createNumberNode({
                                        tag: 35,
                                        value: "0",
                                        start: {line: 1, column: 11},
                                        end: {line: 1, column: 12},
                                    }),
                                ],
                                {line: 1, column: 5},
                                {line: 1, column: 13},
                            ),
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 13},
                    ),
                ],
                {line: 1, column: 1},
                {line: 1, column: 13},
            );

            parserTest(source, expected);
        }
    );

    test("Variable assignment - 2", () => {
            const source = "x = \"a\" + 'f {x.y}'";

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
                        ],
                        21,
                        [
                            ASTFactory.createBinaryExpression(
                                ASTFactory.createStringNode({
                                    tag: 36,
                                    value: "a",
                                    start: {line: 1, column: 5},
                                    end: {line: 1, column: 8},
                                }),
                                1,
                                ASTFactory.createFString(
                                    [
                                        ASTFactory.createStringNode({
                                            tag: 36,
                                            value: "f ",
                                            start: {line: 1, column: 12},
                                            end: {line: 1, column: 14},
                                        }),
                                        ASTFactory.createMemberAttribute(
                                            ASTFactory.createIdentifier({
                                                tag: 34,
                                                value: "x",
                                                start: {line: 1, column: 15},
                                                end: {line: 1, column: 16},
                                            }),
                                            ASTFactory.createIdentifier({
                                                tag: 34,
                                                value: "y",
                                                start: {line: 1, column: 17},
                                                end: {line: 1, column: 18},
                                            }),
                                        ),
                                    ],
                                    {line: 1, column: 11},
                                    {line: 1, column: 20},
                                ),
                            ),
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 20},
                    ),
                ],
                {line: 1, column: 1},
                {line: 1, column: 20},
            );

            parserTest(source, expected);
        }
    );

    test("Variable assignment - 3", () => {
        const source = "x, y, z = 5.23, 'Hello {x}', \"World\"";

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
                        ASTFactory.createVariableAssignment(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "y",
                                start: {line: 1, column: 4},
                                end: {line: 1, column: 5},
                            }),
                        ),
                        ASTFactory.createVariableAssignment(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "z",
                                start: {line: 1, column: 7},
                                end: {line: 1, column: 8},
                            }),
                        ),
                    ],
                    21,
                    [
                        ASTFactory.createNumberNode({
                            tag: 35,
                            value: "5.23",
                            start: {line: 1, column: 11},
                            end: {line: 1, column: 15},
                        }),
                        ASTFactory.createFString(
                            [
                                ASTFactory.createStringNode({
                                    tag: 30,
                                    value: "Hello ",
                                    start: {line: 1, column: 18},
                                    end: {line: 1, column: 24},
                                }),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "x",
                                    start: {line: 1, column: 25},
                                    end: {line: 1, column: 26},
                                }),
                            ],
                            {line: 1, column: 17},
                            {line: 1, column: 28},
                        ),
                        ASTFactory.createStringNode({
                            tag: 36,
                            value: "World",
                            start: {line: 1, column: 30},
                            end: {line: 1, column: 37},
                        }),
                    ],
                    {line: 1, column: 1},
                    {line: 1, column: 37},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 37},
        );

        parserTest(source, expected);
    });

    test("Variable assignment - 4", () => {
            const source = "num[][] a = [[], [1, 2, 3, 4, 5], [1, 3], []]";

            const expected = ASTFactory.createProgram(
                [
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "num",
                                    2,
                                    {line: 1, column: 1},
                                    {line: 1, column: 8},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "a",
                                    start: {line: 1, column: 9},
                                    end: {line: 1, column: 10},
                                }),
                            ),
                        ],
                        21,
                        [
                            ASTFactory.createArrayNode(
                                [
                                    ASTFactory.createArrayNode(
                                        [],
                                        {line: 1, column: 14},
                                        {line: 1, column: 16},
                                    ),
                                    ASTFactory.createArrayNode(
                                        [
                                            ASTFactory.createNumberNode({
                                                tag: 35,
                                                value: "1",
                                                start: {line: 1, column: 19},
                                                end: {line: 1, column: 20},
                                            }),
                                            ASTFactory.createNumberNode({
                                                tag: 35,
                                                value: "2",
                                                start: {line: 1, column: 22},
                                                end: {line: 1, column: 23},
                                            }),
                                            ASTFactory.createNumberNode({
                                                tag: 35,
                                                value: "3",
                                                start: {line: 1, column: 25},
                                                end: {line: 1, column: 26},
                                            }),
                                            ASTFactory.createNumberNode({
                                                tag: 35,
                                                value: "4",
                                                start: {line: 1, column: 28},
                                                end: {line: 1, column: 29},
                                            }),
                                            ASTFactory.createNumberNode({
                                                tag: 35,
                                                value: "5",
                                                start: {line: 1, column: 31},
                                                end: {line: 1, column: 32},
                                            }),
                                        ],
                                        {line: 1, column: 18},
                                        {line: 1, column: 33},
                                    ),
                                    ASTFactory.createArrayNode(
                                        [
                                            ASTFactory.createNumberNode({
                                                tag: 35,
                                                value: "1",
                                                start: {line: 1, column: 36},
                                                end: {line: 1, column: 37},
                                            }),
                                            ASTFactory.createNumberNode({
                                                tag: 35,
                                                value: "3",
                                                start: {line: 1, column: 39},
                                                end: {line: 1, column: 40},
                                            }),
                                        ],
                                        {line: 1, column: 35},
                                        {line: 1, column: 41},
                                    ),
                                    ASTFactory.createArrayNode(
                                        [],
                                        {line: 1, column: 43},
                                        {line: 1, column: 45},
                                    ),
                                ],
                                {line: 1, column: 13},
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
        }
    );
});
