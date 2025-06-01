import {optimizerTest} from "@tests/utils";
import {ASTFactory} from "@src/utils";

describe("Algebraic simplification", () => {
    test("Algebraic simplification - 1", () => {
            const source = "num x = 2\n" +
                "num y = x + 0";

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
                        21,
                        [
                            ASTFactory.createNumberNode(
                                {
                                    tag: 35,
                                    value: "2",
                                    start: {line: 1, column: 9},
                                    end: {line: 1, column: 10},
                                },
                            )
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 10},
                    ),
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "num",
                                    0,
                                    {line: 2, column: 1},
                                    {line: 2, column: 4},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "y",
                                    start: {line: 2, column: 5},
                                    end: {line: 2, column: 6},
                                }),
                            ),
                        ],
                        21,
                        [
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "x",
                                start: {line: 2, column: 9},
                                end: {line: 2, column: 10}
                            }),
                        ],
                        {line: 2, column: 1},
                        {line: 2, column: 14},
                    )
                ],
                {line: 1, column: 1},
                {line: 2, column: 14},
            );

            optimizerTest(source, expected);
        }
    );

    test("Algebraic simplification - 2", () => {
            const source = "num x = 2\n" +
                "num y = x * 1";

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
                        21,
                        [
                            ASTFactory.createNumberNode(
                                {
                                    tag: 35,
                                    value: "2",
                                    start: {line: 1, column: 9},
                                    end: {line: 1, column: 10},
                                },
                            )
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 10},
                    ),
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "num",
                                    0,
                                    {line: 2, column: 1},
                                    {line: 2, column: 4},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "y",
                                    start: {line: 2, column: 5},
                                    end: {line: 2, column: 6},
                                }),
                            ),
                        ],
                        21,
                        [
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "x",
                                start: {line: 2, column: 9},
                                end: {line: 2, column: 10}
                            }),
                        ],
                        {line: 2, column: 1},
                        {line: 2, column: 14},
                    )
                ],
                {line: 1, column: 1},
                {line: 2, column: 14},
            );

            optimizerTest(source, expected);
        }
    );

    test("Algebraic simplification - 3", () => {
            const source = "num x = 2\n" +
                "num y = 0 * x";

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
                        21,
                        [
                            ASTFactory.createNumberNode(
                                {
                                    tag: 35,
                                    value: "2",
                                    start: {line: 1, column: 9},
                                    end: {line: 1, column: 10},
                                },
                            )
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 10},
                    ),
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "num",
                                    0,
                                    {line: 2, column: 1},
                                    {line: 2, column: 4},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "y",
                                    start: {line: 2, column: 5},
                                    end: {line: 2, column: 6},
                                }),
                            ),
                        ],
                        21,
                        [
                            ASTFactory.createNumberNode(
                                {
                                    tag: 35,
                                    value: "0",
                                    start: {line: 2, column: 9},
                                    end: {line: 2, column: 14},
                                },
                            )
                        ],
                        {line: 2, column: 1},
                        {line: 2, column: 14},
                    )
                ],
                {line: 1, column: 1},
                {line: 2, column: 14},
            );

            optimizerTest(source, expected);
        }
    );

    test("Algebraic simplification - 4", () => {
            const source = "num x = 2\n" +
                "num y = x - 0";

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
                        21,
                        [
                            ASTFactory.createNumberNode(
                                {
                                    tag: 35,
                                    value: "2",
                                    start: {line: 1, column: 9},
                                    end: {line: 1, column: 10},
                                },
                            )
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 10},
                    ),
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "num",
                                    0,
                                    {line: 2, column: 1},
                                    {line: 2, column: 4},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "y",
                                    start: {line: 2, column: 5},
                                    end: {line: 2, column: 6},
                                }),
                            ),
                        ],
                        21,
                        [
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "x",
                                start: {line: 2, column: 9},
                                end: {line: 2, column: 10}
                            }),
                        ],
                        {line: 2, column: 1},
                        {line: 2, column: 14},
                    )
                ],
                {line: 1, column: 1},
                {line: 2, column: 14},
            );

            optimizerTest(source, expected);
        }
    );

    test("Algebraic simplification - 5", () => {
            const source = "num x = 2\n" +
                "num y = x // 1";

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
                        21,
                        [
                            ASTFactory.createNumberNode(
                                {
                                    tag: 35,
                                    value: "2",
                                    start: {line: 1, column: 9},
                                    end: {line: 1, column: 10},
                                },
                            )
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 10},
                    ),
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "num",
                                    0,
                                    {line: 2, column: 1},
                                    {line: 2, column: 4},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "y",
                                    start: {line: 2, column: 5},
                                    end: {line: 2, column: 6},
                                }),
                            ),
                        ],
                        21,
                        [
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "x",
                                start: {line: 2, column: 9},
                                end: {line: 2, column: 10}
                            }),
                        ],
                        {line: 2, column: 1},
                        {line: 2, column: 15},
                    )
                ],
                {line: 1, column: 1},
                {line: 2, column: 15},
            );

            optimizerTest(source, expected);
        }
    );

    test("Algebraic simplification - 6", () => {
            const source = "bool b = false\n" +
                "bool d = true | b";

            const expected = ASTFactory.createProgram(
                [
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "bool",
                                    0,
                                    {line: 1, column: 1},
                                    {line: 1, column: 5},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "b",
                                    start: {line: 1, column: 6},
                                    end: {line: 1, column: 7},
                                }),
                            ),
                        ],
                        21,
                        [
                            ASTFactory.createBooleanNode(
                                {
                                    tag: 36,
                                    value: "false",
                                    start: {line: 1, column: 10},
                                    end: {line: 1, column: 15},
                                },
                            )
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 15},
                    ),
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "bool",
                                    0,
                                    {line: 2, column: 1},
                                    {line: 2, column: 5},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "d",
                                    start: {line: 2, column: 6},
                                    end: {line: 2, column: 7},
                                }),
                            ),
                        ],
                        21,
                        [
                            ASTFactory.createBooleanNode(
                                {
                                    tag: 36,
                                    value: "true",
                                    start: {line: 2, column: 10},
                                    end: {line: 2, column: 18},
                                },
                            )
                        ],
                        {line: 2, column: 1},
                        {line: 2, column: 18},
                    )
                ],
                {line: 1, column: 1},
                {line: 2, column: 18},
            );

            optimizerTest(source, expected);
        }
    );
});
