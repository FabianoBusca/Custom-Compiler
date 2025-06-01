import {parserTest} from "@tests/utils"
import {ASTFactory} from "@src/utils";

describe("Flow control statements", () => {

    test("If statement - 1", () => {
        const source =
            "if ((5 + foo()) % 2 == 0) {\n" +
            "  print(\"Yes!\")\n" +
            "}";

        const expected = ASTFactory.createProgram([
                ASTFactory.createIfStatement(
                    ASTFactory.createLogicalExpression(
                        ASTFactory.createBinaryExpression(
                            ASTFactory.createBinaryExpression(
                                ASTFactory.createNumberNode({
                                    tag: 35,
                                    value: '5',
                                    start: {line: 1, column: 6},
                                    end: {line: 1, column: 7}
                                }),
                                1,
                                ASTFactory.createFunctionCall(
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: 'foo',
                                        start: {line: 1, column: 10},
                                        end: {line: 1, column: 13}
                                    }),
                                    [],
                                    {line: 1, column: 10},
                                    {line: 1, column: 15}
                                ),
                            ),
                            5,
                            ASTFactory.createNumberNode({
                                tag: 35,
                                value: '2',
                                start: {line: 1, column: 19},
                                end: {line: 1, column: 20}
                            }),
                        ),
                        15,
                        ASTFactory.createNumberNode({
                            tag: 35,
                            value: '0',
                            start: {line: 1, column: 24},
                            end: {line: 1, column: 25}
                        }),
                    ),
                    [
                        ASTFactory.createPrintStatement(
                            [
                                ASTFactory.createStringNode({
                                    tag: 36,
                                    value: 'Yes!',
                                    start: {line: 2, column: 9},
                                    end: {line: 2, column: 15}
                                })
                            ],
                            {line: 2, column: 3},
                            {line: 2, column: 16}
                        )
                    ],
                    [],
                    {line: 1, column: 1},
                    {line: 3, column: 2}
                ),
            ],
            {line: 1, column: 1},
            {line: 3, column: 2}
        );

        parserTest(source, expected);
    });

    test("If statement - 2", () => {
        const source =
            "if (a[0][0][1] != !l.foobar()[3]) {\n" +
            "  a++\n" +
            "} else {\n" +
            "  b = !b\n" +
            "}";

        const expected = ASTFactory.createProgram([
                ASTFactory.createIfStatement(
                    ASTFactory.createLogicalExpression(
                        ASTFactory.createArrayElement(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: 'a',
                                start: {line: 1, column: 5},
                                end: {line: 1, column: 6}
                            }),
                            [
                                ASTFactory.createNumberNode({
                                    tag: 35,
                                    value: '0',
                                    start: {line: 1, column: 7},
                                    end: {line: 1, column: 8}
                                }),
                                ASTFactory.createNumberNode({
                                    tag: 35,
                                    value: '0',
                                    start: {line: 1, column: 10},
                                    end: {line: 1, column: 11}
                                }),
                                ASTFactory.createNumberNode({
                                    tag: 35,
                                    value: '1',
                                    start: {line: 1, column: 13},
                                    end: {line: 1, column: 14}
                                })
                            ],
                            {line: 1, column: 5},
                            {line: 1, column: 15}
                        ),
                        16,
                        ASTFactory.createUnaryExpression(
                            14,
                            ASTFactory.createArrayElement(
                                ASTFactory.createMemberFunctionCall(
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: 'l',
                                        start: {line: 1, column: 20},
                                        end: {line: 1, column: 21}
                                    }),
                                    ASTFactory.createFunctionCall(
                                        ASTFactory.createIdentifier({
                                            tag: 34,
                                            value: 'foobar',
                                            start: {line: 1, column: 22},
                                            end: {line: 1, column: 28}
                                        }),
                                        [],
                                        {line: 1, column: 22},
                                        {line: 1, column: 30}
                                    )
                                ),
                                [
                                    ASTFactory.createNumberNode({
                                        tag: 35,
                                        value: '3',
                                        start: {line: 1, column: 31},
                                        end: {line: 1, column: 32}
                                    })
                                ],
                                {line: 1, column: 20},
                                {line: 1, column: 33}
                            ),
                            {line: 1, column: 19},
                            {line: 1, column: 33}
                        ),
                    ),
                    [
                        ASTFactory.createUnaryExpression(8,
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: 'a',
                                start: {line: 2, column: 3},
                                end: {line: 2, column: 4}
                            }),
                            {line: 2, column: 3},
                            {line: 2, column: 6}
                        )
                    ],
                    [
                        ASTFactory.createVariableOperations(
                            [ASTFactory.createVariableAssignment(
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: 'b',
                                    start: {line: 4, column: 3},
                                    end: {line: 4, column: 4}
                                }),
                            )],
                            21,
                            [
                                ASTFactory.createUnaryExpression(14,
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: 'b',
                                        start: {line: 4, column: 8},
                                        end: {line: 4, column: 9}
                                    }),
                                    {line: 4, column: 7},
                                    {line: 4, column: 9}
                                )
                            ],
                            {line: 4, column: 3},
                            {line: 4, column: 9})
                    ],
                    {line: 1, column: 1},
                    {line: 5, column: 2}
                )
            ],
            {line: 1, column: 1},
            {line: 5, column: 2}
        );

        parserTest(source, expected);
    });

    test("For statement - 1", () => {
        const source =
            "for (i, x.length) {\n" +
            "  print(x[i])\n" +
            "}"

        const expected = ASTFactory.createProgram([
                ASTFactory.createForStatement(
                    ASTFactory.createIdentifier({
                        tag: 34,
                        value: 'i',
                        start: {line: 1, column: 6},
                        end: {line: 1, column: 7}
                    }),
                    ASTFactory.createMemberAttribute(
                        ASTFactory.createIdentifier({
                            tag: 34,
                            value: 'x',
                            start: {line: 1, column: 9},
                            end: {line: 1, column: 10}
                        }),
                        ASTFactory.createIdentifier({
                            tag: 34,
                            value: 'length',
                            start: {line: 1, column: 11},
                            end: {line: 1, column: 17}
                        })
                    ),
                    [
                        ASTFactory.createPrintStatement(
                            [
                                ASTFactory.createArrayElement(
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: 'x',
                                        start: {line: 2, column: 9},
                                        end: {line: 2, column: 10}
                                    }),
                                    [
                                        ASTFactory.createIdentifier({
                                            tag: 34,
                                            value: 'i',
                                            start: {line: 2, column: 11},
                                            end: {line: 2, column: 12}
                                        })
                                    ],
                                    {line: 2, column: 9},
                                    {line: 2, column: 13}
                                )
                            ],
                            {line: 2, column: 3},
                            {line: 2, column: 14}
                        )
                    ],
                    {line: 1, column: 1},
                    {line: 3, column: 2}
                )
            ],
            {line: 1, column: 1},
            {line: 3, column: 2}
        );

        parserTest(source, expected);
    });

    test("For statement - 2", () => {
        const source =
            "for (i, x) {\n" +
            "  print(i)\n" +
            "}";

        const expected = ASTFactory.createProgram([
                ASTFactory.createForStatement(
                    ASTFactory.createIdentifier({
                        tag: 34,
                        value: 'i',
                        start: {line: 1, column: 6},
                        end: {line: 1, column: 7}
                    }),
                    ASTFactory.createIdentifier({
                        tag: 34,
                        value: 'x',
                        start: {line: 1, column: 9},
                        end: {line: 1, column: 10}
                    }),
                    [
                        ASTFactory.createPrintStatement(
                            [
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: 'i',
                                    start: {line: 2, column: 9},
                                    end: {line: 2, column: 10}
                                })
                            ],
                            {line: 2, column: 3},
                            {line: 2, column: 11}
                        )
                    ],
                    {line: 1, column: 1},
                    {line: 3, column: 2}
                )
            ],
            {line: 1, column: 1},
            {line: 3, column: 2}
        );

        parserTest(source, expected);
    });

    test("While statement - 1", () => {
        const source =
            "while (a) {\n" +
            "  b()\n" +
            "}";

        const expected = ASTFactory.createProgram([
                ASTFactory.createWhileStatement(
                    ASTFactory.createIdentifier({
                        tag: 34,
                        value: 'a',
                        start: {line: 1, column: 8},
                        end: {line: 1, column: 9}
                    }),
                    [
                        ASTFactory.createFunctionCall(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: 'b',
                                start: {line: 2, column: 3},
                                end: {line: 2, column: 4}
                            }),
                            [],
                            {line: 2, column: 3},
                            {line: 2, column: 6}
                        )
                    ],
                    {line: 1, column: 1},
                    {line: 3, column: 2}
                )
            ],
            {line: 1, column: 1},
            {line: 3, column: 2}
        );

        parserTest(source, expected);
    });

    test("Switch statement - 1", () => {
        const source =
            "switch (foo() + 1) {\n" +
            "  case 1 + 1 {\n" +
            "    print(\"1\")\n" +
            "  }\n" +
            "  case a() {\n" +
            "    print(\"a\")\n" +
            "  }\n" +
            "  case b[0] {\n" +
            "    print(\"b\")\n" +
            "  }\n" +
            "\n" +
            "  num[] x = 4\n" +
            "  print(x)\n" +
            "}";

        const expected = ASTFactory.createProgram([
                ASTFactory.createSwitchStatement(
                    ASTFactory.createBinaryExpression(
                        ASTFactory.createFunctionCall(
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: 'foo',
                                start: {line: 1, column: 9},
                                end: {line: 1, column: 12}
                            }),
                            [],
                            {line: 1, column: 9},
                            {line: 1, column: 14}
                        ),
                        1,
                        ASTFactory.createNumberNode({
                            tag: 35,
                            value: '1',
                            start: {line: 1, column: 17},
                            end: {line: 1, column: 18}
                        })
                    ),
                    [
                        ASTFactory.createCaseStatement(
                            [
                                ASTFactory.createBinaryExpression(
                                    ASTFactory.createNumberNode({
                                        tag: 35,
                                        value: '1',
                                        start: {line: 2, column: 8},
                                        end: {line: 2, column: 9}
                                    }),
                                    1,
                                    ASTFactory.createNumberNode({
                                        tag: 35,
                                        value: '1',
                                        start: {line: 2, column: 12},
                                        end: {line: 2, column: 13}
                                    })
                                )
                            ],
                            [
                                ASTFactory.createPrintStatement(
                                    [
                                        ASTFactory.createStringNode({
                                            tag: 36,
                                            value: '1',
                                            start: {line: 3, column: 11},
                                            end: {line: 3, column: 14}
                                        })
                                    ],
                                    {line: 3, column: 5},
                                    {line: 3, column: 15}
                                )
                            ],
                            {line: 2, column: 3},
                            {line: 4, column: 4}
                        ),
                        ASTFactory.createCaseStatement(
                            [
                                ASTFactory.createFunctionCall(
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: 'a',
                                        start: {line: 5, column: 8},
                                        end: {line: 5, column: 9}
                                    }),
                                    [],
                                    {line: 5, column: 8},
                                    {line: 5, column: 11}
                                )
                            ],
                            [
                                ASTFactory.createPrintStatement(
                                    [
                                        ASTFactory.createStringNode({
                                            tag: 36,
                                            value: 'a',
                                            start: {line: 6, column: 11},
                                            end: {line: 6, column: 14}
                                        })
                                    ],
                                    {line: 6, column: 5},
                                    {line: 6, column: 15}
                                )
                            ],
                            {line: 5, column: 3},
                            {line: 7, column: 4}
                        ),
                        ASTFactory.createCaseStatement(
                            [
                                ASTFactory.createArrayElement(
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: 'b',
                                        start: {line: 8, column: 8},
                                        end: {line: 8, column: 9}
                                    }),
                                    [
                                        ASTFactory.createNumberNode({
                                            tag: 35,
                                            value: '0',
                                            start: {line: 8, column: 10},
                                            end: {line: 8, column: 11}
                                        })
                                    ],
                                    {line: 8, column: 8},
                                    {line: 8, column: 12}
                                )
                            ],
                            [
                                ASTFactory.createPrintStatement(
                                    [
                                        ASTFactory.createStringNode({
                                            tag: 36,
                                            value: 'b',
                                            start: {line: 9, column: 11},
                                            end: {line: 9, column: 14}
                                        })
                                    ],
                                    {line: 9, column: 5},
                                    {line: 9, column: 15}
                                )
                            ],
                            {line: 8, column: 3},
                            {line: 10, column: 4}
                        )
                    ],
                    [
                        ASTFactory.createVariableOperations(
                            [ASTFactory.createVariableDeclaration(
                                ASTFactory.createType('num', 1, {line: 12, column: 3}, {line: 12, column: 8}),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: 'x',
                                    start: {line: 12, column: 9},
                                    end: {line: 12, column: 10}
                                }),
                            )], 21,
                            [ASTFactory.createNumberNode({
                                tag: 35,
                                value: '4',
                                start: {line: 12, column: 13},
                                end: {line: 12, column: 14}
                            })],
                            {line: 12, column: 3},
                            {line: 12, column: 14}
                        ),
                        ASTFactory.createPrintStatement(
                            [
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: 'x',
                                    start: {line: 13, column: 9},
                                    end: {line: 13, column: 10}
                                })
                            ],
                            {line: 13, column: 3},
                            {line: 13, column: 11}
                        )],
                    {line: 1, column: 1},
                    {line: 14, column: 2}
                )
            ],
            {line: 1, column: 1},
            {line: 14, column: 2}
        );

        parserTest(source, expected);
    });

    test("Complex flow control statement", () => {
        const source =
            "while (-a().b.length() == 1) {\n" +
            "  if (a().b[0] == 1) {\n" +
            "    for (i, 5 + a().b.length()) {\n" +
            "        print(i)\n" +
            "    }\n" +
            "  } else {\n" +
            "    switch (x % 2 == 0) {\n" +
            "      for (i, a().b) {\n" +
            "        print(i)\n" +
            "      }\n" +
            "    }\n" +
            "  }\n" +
            "}";

        const expected = ASTFactory.createProgram([
                ASTFactory.createWhileStatement(
                    ASTFactory.createLogicalExpression(
                        ASTFactory.createUnaryExpression(
                            2,
                            ASTFactory.createMemberFunctionCall(
                                ASTFactory.createMemberAttribute(
                                    ASTFactory.createFunctionCall(
                                        ASTFactory.createIdentifier({
                                            tag: 34,
                                            value: 'a',
                                            start: {line: 1, column: 9},
                                            end: {line: 1, column: 10}
                                        }),
                                        [],
                                        {line: 1, column: 9},
                                        {line: 1, column: 12}
                                    ),
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: 'b',
                                        start: {line: 1, column: 13},
                                        end: {line: 1, column: 14}
                                    }),
                                ),
                                ASTFactory.createFunctionCall(
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: 'length',
                                        start: {line: 1, column: 15},
                                        end: {line: 1, column: 21}
                                    }),
                                    [],
                                    {line: 1, column: 15},
                                    {line: 1, column: 23}
                                ),
                            ),
                            {line: 1, column: 8},
                            {line: 1, column: 23}
                        ),
                        15,
                        ASTFactory.createNumberNode({
                            tag: 35,
                            value: '1',
                            start: {line: 1, column: 27},
                            end: {line: 1, column: 28}
                        })
                    ),
                    [
                        ASTFactory.createIfStatement(
                            ASTFactory.createLogicalExpression(
                                ASTFactory.createArrayElement(
                                    ASTFactory.createMemberAttribute(
                                        ASTFactory.createFunctionCall(
                                            ASTFactory.createIdentifier({
                                                tag: 34,
                                                value: 'a',
                                                start: {line: 2, column: 7},
                                                end: {line: 2, column: 8}
                                            }),
                                            [],
                                            {line: 2, column: 7},
                                            {line: 2, column: 10}
                                        ),
                                        ASTFactory.createIdentifier({
                                            tag: 34,
                                            value: 'b',
                                            start: {line: 2, column: 11},
                                            end: {line: 2, column: 12}
                                        })
                                    ),
                                    [
                                        ASTFactory.createNumberNode({
                                            tag: 35,
                                            value: '0',
                                            start: {line: 2, column: 13},
                                            end: {line: 2, column: 14}
                                        })
                                    ],
                                    {line: 2, column: 7},
                                    {line: 2, column: 15}
                                ),
                                15,
                                ASTFactory.createNumberNode({
                                    tag: 35,
                                    value: '1',
                                    start: {line: 2, column: 19},
                                    end: {line: 2, column: 20}
                                })
                            ),
                            [
                                ASTFactory.createForStatement(
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: 'i',
                                        start: {line: 3, column: 10},
                                        end: {line: 3, column: 11}
                                    }),
                                    ASTFactory.createBinaryExpression(
                                        ASTFactory.createNumberNode({
                                            tag: 35,
                                            value: '5',
                                            start: {line: 3, column: 13},
                                            end: {line: 3, column: 14}
                                        }),
                                        1,
                                        ASTFactory.createMemberFunctionCall(
                                            ASTFactory.createMemberAttribute(
                                                ASTFactory.createFunctionCall(
                                                    ASTFactory.createIdentifier({
                                                        tag: 34,
                                                        value: 'a',
                                                        start: {line: 3, column: 17},
                                                        end: {line: 3, column: 18}
                                                    }),
                                                    [],
                                                    {line: 3, column: 17},
                                                    {line: 3, column: 20}
                                                ),
                                                ASTFactory.createIdentifier({
                                                    tag: 34,
                                                    value: 'b',
                                                    start: {line: 3, column: 21},
                                                    end: {line: 3, column: 22}
                                                })
                                            ),
                                            ASTFactory.createFunctionCall(
                                                ASTFactory.createIdentifier({
                                                    tag: 34,
                                                    value: 'length',
                                                    start: {line: 3, column: 23},
                                                    end: {line: 3, column: 29}
                                                }),
                                                [],
                                                {line: 3, column: 23},
                                                {line: 3, column: 31}
                                            )
                                        )
                                    ),
                                    [
                                        ASTFactory.createPrintStatement(
                                            [ASTFactory.createIdentifier({
                                                tag: 34,
                                                value: 'i',
                                                start: {line: 4, column: 15},
                                                end: {line: 4, column: 16}
                                            })],
                                            {line: 4, column: 9},
                                            {line: 4, column: 17}
                                        )
                                    ],
                                    {line: 3, column: 5},
                                    {line: 5, column: 6}
                                )
                            ],
                            [
                                ASTFactory.createSwitchStatement(
                                    ASTFactory.createLogicalExpression(
                                        ASTFactory.createBinaryExpression(
                                            ASTFactory.createIdentifier({
                                                tag: 34,
                                                value: 'x',
                                                start: {line: 7, column: 13},
                                                end: {line: 7, column: 14}
                                            }),
                                            5,
                                            ASTFactory.createNumberNode({
                                                tag: 35,
                                                value: '2',
                                                start: {line: 7, column: 17},
                                                end: {line: 7, column: 18}
                                            })
                                        ),
                                        15,
                                        ASTFactory.createNumberNode({
                                            tag: 35,
                                            value: '0',
                                            start: {line: 7, column: 22},
                                            end: {line: 7, column: 23}
                                        })
                                    ),
                                    [],
                                    [
                                        ASTFactory.createForStatement(
                                            ASTFactory.createIdentifier({
                                                tag: 34,
                                                value: 'i',
                                                start: {line: 8, column: 12},
                                                end: {line: 8, column: 13}
                                            }),
                                            ASTFactory.createMemberAttribute(
                                                ASTFactory.createFunctionCall(
                                                    ASTFactory.createIdentifier({
                                                        tag: 34,
                                                        value: 'a',
                                                        start: {line: 8, column: 15},
                                                        end: {line: 8, column: 16}
                                                    }),
                                                    [],
                                                    {line: 8, column: 15},
                                                    {line: 8, column: 18}
                                                ),
                                                ASTFactory.createIdentifier({
                                                    tag: 34,
                                                    value: 'b',
                                                    start: {line: 8, column: 19},
                                                    end: {line: 8, column: 20}
                                                }),
                                            ),
                                            [
                                                ASTFactory.createPrintStatement(
                                                    [
                                                        ASTFactory.createIdentifier({
                                                            tag: 34,
                                                            value: 'i',
                                                            start: {line: 9, column: 15},
                                                            end: {line: 9, column: 16}
                                                        })
                                                    ],
                                                    {line: 9, column: 9},
                                                    {line: 9, column: 17}
                                                )
                                            ],
                                            {line: 8, column: 7},
                                            {line: 10, column: 8}
                                        )
                                    ],
                                    {line: 7, column: 5},
                                    {line: 11, column: 6}
                                )
                            ],
                            {line: 2, column: 3},
                            {line: 12, column: 4}
                        )
                    ],
                    {line: 1, column: 1},
                    {line: 13, column: 2}
                )
            ],
            {line: 1, column: 1},
            {line: 13, column: 2}
        );

        parserTest(source, expected);
    });
});
