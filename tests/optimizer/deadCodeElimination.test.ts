import {optimizerTest} from "@tests/utils";
import {ASTFactory} from "@src/utils";

describe("Dead code elimination", () => {
    test("Dead code elimination - 1", () => {
            const source = "if (false) {\n" +
                "    num x = 10\n" +
                "}";

            const expected = ASTFactory.createProgram(
                [],
                {line: 1, column: 1},
                {line: 3, column: 2},
            );

            optimizerTest(source, expected);
        }
    );

    test("Dead code elimination - 2", () => {
            const source = "if (true) {\n" +
                "    num y = 20\n" +
                "} else {\n" +
                "    num z = 30\n" +
                "}";

            const expected = ASTFactory.createProgram(
                [
                    ASTFactory.createVariableOperations(
                        [
                            ASTFactory.createVariableDeclaration(
                                ASTFactory.createType(
                                    "num",
                                    0,
                                    {line: 2, column: 5},
                                    {line: 2, column: 8},
                                ),
                                ASTFactory.createIdentifier({
                                    tag: 34,
                                    value: "y",
                                    start: {line: 2, column: 9},
                                    end: {line: 2, column: 10},
                                }),
                            ),
                        ],
                        21,
                        [
                            ASTFactory.createNumberNode(
                                {
                                    tag: 35,
                                    value: "20",
                                    start: {line: 2, column: 13},
                                    end: {line: 2, column: 15},
                                },
                            )
                        ],
                        {line: 2, column: 5},
                        {line: 2, column: 15},
                    )
                ],
                {line: 1, column: 1},
                {line: 5, column: 2},
            );

            optimizerTest(source, expected);
        }
    );

    test("Dead code elimination - 3", () => {
            const source = "_ = foo() {\n" +
                "  return()\n" +
                "  num x = 42\n" +
                "}";

            const expected = ASTFactory.createProgram(
                [
                    ASTFactory.createFunctionDeclaration(
                        [
                            ASTFactory.createType(
                                "_",
                                0,
                                {line: 1, column: 1},
                                {line: 1, column: 2},
                            )
                        ],
                        ASTFactory.createIdentifier({
                            tag: 34,
                            value: "foo",
                            start: {line: 1, column: 5},
                            end: {line: 1, column: 8},
                        }),
                        [],
                        [
                            ASTFactory.createReturnStatement(
                                [],
                                {line: 2, column: 3},
                                {line: 2, column: 11},
                            )
                        ],
                        {line: 1, column: 1},
                        {line: 4, column: 2},
                    )
                ],
                {line: 1, column: 1},
                {line: 4, column: 2},
            );

            optimizerTest(source, expected);
        }
    );
});
