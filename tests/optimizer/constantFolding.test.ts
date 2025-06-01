import {optimizerTest} from "@tests/utils";
import {ASTFactory} from "@src/utils";

describe("Constant folding", () => {
    test("Constant folding - 1", () => {
        const source = "num x = 4 * 2 + 3";

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
                                value: "11",
                                start: {line: 1, column: 9},
                                end: {line: 1, column: 18},
                            }
                        )
                    ],
                    {line: 1, column: 1},
                    {line: 1, column: 18},
                ),
            ],
            {line: 1, column: 1},
            {line: 1, column: 18},
        );

        optimizerTest(source, expected);
    });

    test("Constant folding - 2", () => {
            const source = "num x = (10 - 2 ** 2) / 3";

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
                                    start: {line: 1, column: 10},
                                    end: {line: 1, column: 26},
                                }
                            )
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 26},
                    ),
                ],
                {line: 1, column: 1},
                {line: 1, column: 26},
            );

            optimizerTest(source, expected);
        }
    );

    test("Constant folding - 3", () => {
            const source = "bool b = true & 5 % 2 == 0";

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
                                    end: {line: 1, column: 27},
                                }
                            )
                        ],
                        {line: 1, column: 1},
                        {line: 1, column: 27},
                    ),
                ],
                {line: 1, column: 1},
                {line: 1, column: 27},
            );

            optimizerTest(source, expected);
        }
    );
});
