import {ASTFactory} from "@src/utils";
import {parserTest} from "@tests/utils";

describe("Class Declarations", () => {
    test("Class declaration - 1", async () => {
        const source =
            "class Dog = {\n" +
            "  str name\n" +
            "  num age\n" +
            "  Dog = _(str name, num age) {\n" +
            "    this.name = name\n" +
            "    this.age = age\n" +
            "  }\n" +
            "  _ = bark() {\n" +
            "    print('Woof')\n" +
            "  }\n" +
            "  _ = setOwner(owner owner) {\n" +
            "    owner.setDog(this)\n" +
            "  }\n" +
            "}";

        const expected = ASTFactory.createProgram([
                ASTFactory.createClassDeclaration(
                    ASTFactory.createIdentifier({
                        tag: 34,
                        value: "Dog",
                        start: {line: 1, column: 7},
                        end: {line: 1, column: 10}
                    }),
                    [
                        ASTFactory.createVariableOperations(
                            [
                                ASTFactory.createVariableDeclaration(
                                    ASTFactory.createType("str", 0, {line: 2, column: 3}, {line: 2, column: 6}),
                                    ASTFactory.createIdentifier({
                                        tag: 34, value: "name", start: {line: 2, column: 7}, end: {line: 2, column: 11}
                                    })
                                )
                            ],
                            null,
                            [],
                            {line: 2, column: 3},
                            {line: 2, column: 11}
                        ),
                        ASTFactory.createVariableOperations(
                            [
                                ASTFactory.createVariableDeclaration(
                                    ASTFactory.createType("num", 0, {line: 3, column: 3}, {line: 3, column: 6}),
                                    ASTFactory.createIdentifier({
                                        tag: 34, value: "age", start: {line: 3, column: 7}, end: {line: 3, column: 10}
                                    })
                                )
                            ],
                            null,
                            [],
                            {line: 3, column: 3},
                            {line: 3, column: 10}
                        ),
                        ASTFactory.createFunctionDeclaration(
                            [ASTFactory.createType("Dog", 0, {line: 4, column: 3}, {line: 4, column: 6})],
                            ASTFactory.createIdentifier({
                                tag: 53,
                                value: "_",
                                start: {line: 4, column: 9},
                                end: {line: 4, column: 10}
                            }),
                            [
                                ASTFactory.createVariableDeclaration(
                                    ASTFactory.createType("str", 0, {line: 4, column: 11}, {line: 4, column: 14}),
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: "name",
                                        start: {line: 4, column: 15},
                                        end: {line: 4, column: 19}
                                    })
                                ),
                                ASTFactory.createVariableDeclaration(
                                    ASTFactory.createType("num", 0, {line: 4, column: 21}, {line: 4, column: 24}),
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: "age",
                                        start: {line: 4, column: 25},
                                        end: {line: 4, column: 28}
                                    })
                                )
                            ],
                            [
                                ASTFactory.createVariableOperations(
                                    [
                                        ASTFactory.createVariableAssignment(
                                            ASTFactory.createMemberAttribute(
                                                ASTFactory.createIdentifier({
                                                    tag: 47,
                                                    value: "this",
                                                    start: {line: 5, column: 5},
                                                    end: {line: 5, column: 9}
                                                }),
                                                ASTFactory.createIdentifier({
                                                    tag: 34,
                                                    value: "name",
                                                    start: {line: 5, column: 10},
                                                    end: {line: 5, column: 14}
                                                })
                                            ),
                                        )
                                    ],
                                    21,
                                    [ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: "name",
                                        start: {line: 5, column: 17},
                                        end: {line: 5, column: 21}
                                    })],
                                    {line: 5, column: 5},
                                    {line: 5, column: 21}
                                ),
                                ASTFactory.createVariableOperations(
                                    [
                                        ASTFactory.createVariableAssignment(
                                            ASTFactory.createMemberAttribute(
                                                ASTFactory.createIdentifier({
                                                    tag: 47,
                                                    value: "this",
                                                    start: {line: 6, column: 5},
                                                    end: {line: 6, column: 9}
                                                }),
                                                ASTFactory.createIdentifier({
                                                    tag: 34,
                                                    value: "age",
                                                    start: {line: 6, column: 10},
                                                    end: {line: 6, column: 13}
                                                })
                                            ),
                                        )
                                    ],
                                    21,
                                    [ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: "age",
                                        start: {line: 6, column: 16},
                                        end: {line: 6, column: 19}
                                    })],
                                    {line: 6, column: 5},
                                    {line: 6, column: 19}
                                )
                            ],
                            {line: 4, column: 3},
                            {line: 7, column: 4}
                        ),
                        ASTFactory.createFunctionDeclaration(
                            [ASTFactory.createType("_", 0, {line: 8, column: 3}, {line: 8, column: 4})],
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "bark",
                                start: {line: 8, column: 7},
                                end: {line: 8, column: 11}
                            }),
                            [],
                            [
                                ASTFactory.createPrintStatement([
                                        ASTFactory.createFString(
                                            [ASTFactory.createStringNode({
                                                tag: 36,
                                                value: "Woof",
                                                start: {line: 9, column: 12},
                                                end: {line: 9, column: 16}
                                            })],
                                            {line: 9, column: 11},
                                            {line: 9, column: 17}
                                        )
                                    ],
                                    {line: 9, column: 5},
                                    {line: 9, column: 18}
                                )
                            ],
                            {line: 8, column: 3},
                            {line: 10, column: 4}
                        ),
                        ASTFactory.createFunctionDeclaration(
                            [ASTFactory.createType("_", 0, {line: 11, column: 3}, {line: 11, column: 4})],
                            ASTFactory.createIdentifier({
                                tag: 34,
                                value: "setOwner",
                                start: {line: 11, column: 7},
                                end: {line: 11, column: 15}
                            }),
                            [
                                ASTFactory.createVariableDeclaration(
                                    ASTFactory.createType("owner", 0, {line: 11, column: 16}, {line: 11, column: 21}),
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: "owner",
                                        start: {line: 11, column: 22},
                                        end: {line: 11, column: 27}
                                    }))
                            ],
                            [
                                ASTFactory.createMemberFunctionCall(
                                    ASTFactory.createIdentifier({
                                        tag: 34,
                                        value: "owner",
                                        start: {line: 12, column: 5},
                                        end: {line: 12, column: 10}
                                    }),
                                    ASTFactory.createFunctionCall(
                                        ASTFactory.createIdentifier({
                                            tag: 34,
                                            value: "setDog",
                                            start: {line: 12, column: 11},
                                            end: {line: 12, column: 17}
                                        }),
                                        [ASTFactory.createIdentifier({
                                            tag: 47,
                                            value: "this",
                                            start: {line: 12, column: 18},
                                            end: {line: 12, column: 22}
                                        })],
                                        {line: 12, column: 11},
                                        {line: 12, column: 23}
                                    )
                                )
                            ],
                            {line: 11, column: 3},
                            {line: 13, column: 4}
                        )
                    ],
                    {line: 1, column: 1},
                    {line: 14, column: 2}
                )
            ],
            {line: 1, column: 1},
            {line: 14, column: 2}
        );

        parserTest(source, expected)
    });
});
