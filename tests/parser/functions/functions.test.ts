import {
  getTestFilePath,
  parserTest,
  parserTestt,
  SOURCE_FOLDER,
} from "../../utils";
import { createToken, Program } from "../../../src/data";
import { ASTFactory } from "../../../src/utils/ASTFactory";

const SUIT_FOLDER = "functions";

describe("Function calls and declarations", () => {
  test("Function declaration - 1", () => {
    const source = "a = foo() {}";

    const tokens = [
      createToken(34, "a", { line: 1, column: 1 }, { line: 1, column: 2 }),
      createToken(21, "=", { line: 1, column: 3 }, { line: 1, column: 4 }),
      createToken(34, "foo", { line: 1, column: 5 }, { line: 1, column: 8 }),
      createToken(22, "(", { line: 1, column: 8 }, { line: 1, column: 9 }),
      createToken(23, ")", { line: 1, column: 9 }, { line: 1, column: 10 }),
      createToken(26, "{", { line: 1, column: 11 }, { line: 1, column: 12 }),
      createToken(27, "}", { line: 1, column: 12 }, { line: 1, column: 13 }),
      createToken(0, "", { line: 1, column: 13 }, { line: 1, column: 13 }),
    ];

    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createFunctionDeclaration(
          [
            ASTFactory.createType(
              "a",
              0,
              { line: 1, column: 1 },
              { line: 1, column: 2 },
            ),
          ],
          ASTFactory.createIdentifier({
            tag: 34,
            value: "foo",
            start: { line: 1, column: 5 },
            end: { line: 1, column: 8 },
          }),
          [],
          [],
          { line: 1, column: 1 },
          { line: 1, column: 13 },
        ),
      ],
      { line: 1, column: 1 },
      { line: 1, column: 13 },
    );

    parserTestt(source, tokens, expected);
  });

  test("Function declaration - 2", () => {
    const source = "a = foo(num a) {}";

    const tokens = [
      createToken(34, "a", { line: 1, column: 1 }, { line: 1, column: 2 }),
      createToken(21, "=", { line: 1, column: 3 }, { line: 1, column: 4 }),
      createToken(34, "foo", { line: 1, column: 5 }, { line: 1, column: 8 }),
      createToken(22, "(", { line: 1, column: 8 }, { line: 1, column: 9 }),
      createToken(34, "num", { line: 1, column: 9 }, { line: 1, column: 12 }),
      createToken(34, "a", { line: 1, column: 13 }, { line: 1, column: 14 }),
      createToken(23, ")", { line: 1, column: 14 }, { line: 1, column: 15 }),
      createToken(26, "{", { line: 1, column: 16 }, { line: 1, column: 17 }),
      createToken(27, "}", { line: 1, column: 17 }, { line: 1, column: 18 }),
      createToken(0, "", { line: 1, column: 18 }, { line: 1, column: 18 }),
    ];

    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createFunctionDeclaration(
          [
            ASTFactory.createType(
              "a",
              0,
              { line: 1, column: 1 },
              { line: 1, column: 2 },
            ),
          ],
          ASTFactory.createIdentifier({
            tag: 34,
            value: "foo",
            start: { line: 1, column: 5 },
            end: { line: 1, column: 8 },
          }),
          [
            ASTFactory.createVariableDeclaration(
              ASTFactory.createType(
                "num",
                0,
                { line: 1, column: 9 },
                { line: 1, column: 12 },
              ),
              ASTFactory.createIdentifier({
                tag: 34,
                value: "a",
                start: { line: 1, column: 13 },
                end: { line: 1, column: 14 },
              }),
            ),
          ],
          [],
          { line: 1, column: 1 },
          { line: 1, column: 18 },
        ),
      ],
      { line: 1, column: 1 },
      { line: 1, column: 18 },
    );

    parserTestt(source, tokens, expected);
  });

  test("Function declaration - 3", () => {
    const source = "a = foo(b[] c) {}";

    const tokens = [
      createToken(34, "a", { line: 1, column: 1 }, { line: 1, column: 2 }),
      createToken(21, "=", { line: 1, column: 3 }, { line: 1, column: 4 }),
      createToken(34, "foo", { line: 1, column: 5 }, { line: 1, column: 8 }),
      createToken(22, "(", { line: 1, column: 8 }, { line: 1, column: 9 }),
      createToken(34, "b", { line: 1, column: 9 }, { line: 1, column: 10 }),
      createToken(24, "[", { line: 1, column: 10 }, { line: 1, column: 11 }),
      createToken(25, "]", { line: 1, column: 11 }, { line: 1, column: 12 }),
      createToken(34, "c", { line: 1, column: 13 }, { line: 1, column: 14 }),
      createToken(23, ")", { line: 1, column: 14 }, { line: 1, column: 15 }),
      createToken(26, "{", { line: 1, column: 16 }, { line: 1, column: 17 }),
      createToken(27, "}", { line: 1, column: 17 }, { line: 1, column: 18 }),
      createToken(0, "", { line: 1, column: 18 }, { line: 1, column: 18 }),
    ];

    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createFunctionDeclaration(
          [
            ASTFactory.createType(
              "a",
              0,
              { line: 1, column: 1 },
              { line: 1, column: 2 },
            ),
          ],
          ASTFactory.createIdentifier({
            tag: 34,
            value: "foo",
            start: { line: 1, column: 5 },
            end: { line: 1, column: 8 },
          }),
          [
            ASTFactory.createVariableDeclaration(
              ASTFactory.createType(
                "b",
                1,
                { line: 1, column: 9 },
                { line: 1, column: 12 },
              ),
              ASTFactory.createIdentifier({
                tag: 34,
                value: "c",
                start: { line: 1, column: 13 },
                end: { line: 1, column: 14 },
              }),
            ),
          ],
          [],
          { line: 1, column: 1 },
          { line: 1, column: 18 },
        ),
      ],
      { line: 1, column: 1 },
      { line: 1, column: 18 },
    );

    parserTestt(source, tokens, expected);
  });

  test("Function call assignment - 1", () => {
    const source = "a = foo()";

    const tokens = [
      createToken(34, "a", { line: 1, column: 1 }, { line: 1, column: 2 }),
      createToken(21, "=", { line: 1, column: 3 }, { line: 1, column: 4 }),
      createToken(34, "foo", { line: 1, column: 5 }, { line: 1, column: 8 }),
      createToken(22, "(", { line: 1, column: 8 }, { line: 1, column: 9 }),
      createToken(23, ")", { line: 1, column: 9 }, { line: 1, column: 10 }),
      createToken(0, "", { line: 1, column: 10 }, { line: 1, column: 10 }),
    ];

    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createVariableOperations(
          [
            ASTFactory.createVariableAssignment(
              ASTFactory.createIdentifier({
                tag: 34,
                value: "a",
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 },
              }),
            ),
          ],
          21,
          [
            ASTFactory.createFunctionCall(
              ASTFactory.createIdentifier({
                tag: 34,
                value: "foo",
                start: { line: 1, column: 5 },
                end: { line: 1, column: 8 },
              }),
              [],
              { line: 1, column: 5 },
              { line: 1, column: 10 },
            ),
          ],
          { line: 1, column: 1 },
          { line: 1, column: 10 },
        ),
      ],
      { line: 1, column: 1 },
      { line: 1, column: 10 },
    );

    parserTestt(source, tokens, expected);
  });

  test("Function call assignment - 2", () => {
    const source = "a = foo(b.j().l[0])[0]";

    const tokens = [
      createToken(34, "a", { line: 1, column: 1 }, { line: 1, column: 2 }),
      createToken(21, "=", { line: 1, column: 3 }, { line: 1, column: 4 }),
      createToken(34, "foo", { line: 1, column: 5 }, { line: 1, column: 8 }),
      createToken(22, "(", { line: 1, column: 8 }, { line: 1, column: 9 }),
      createToken(34, "b", { line: 1, column: 9 }, { line: 1, column: 10 }),
      createToken(29, ".", { line: 1, column: 10 }, { line: 1, column: 11 }),
      createToken(34, "j", { line: 1, column: 11 }, { line: 1, column: 12 }),
      createToken(22, "(", { line: 1, column: 12 }, { line: 1, column: 13 }),
      createToken(23, ")", { line: 1, column: 13 }, { line: 1, column: 14 }),
      createToken(29, ".", { line: 1, column: 14 }, { line: 1, column: 15 }),
      createToken(34, "l", { line: 1, column: 15 }, { line: 1, column: 16 }),
      createToken(24, "[", { line: 1, column: 16 }, { line: 1, column: 17 }),
      createToken(35, "0", { line: 1, column: 17 }, { line: 1, column: 18 }),
      createToken(25, "]", { line: 1, column: 18 }, { line: 1, column: 19 }),
      createToken(23, ")", { line: 1, column: 19 }, { line: 1, column: 20 }),
      createToken(24, "[", { line: 1, column: 20 }, { line: 1, column: 21 }),
      createToken(35, "0", { line: 1, column: 21 }, { line: 1, column: 22 }),
      createToken(25, "]", { line: 1, column: 22 }, { line: 1, column: 23 }),
      createToken(0, "", { line: 1, column: 23 }, { line: 1, column: 23 }),
    ];

    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createVariableOperations(
          [
            ASTFactory.createVariableAssignment(
              ASTFactory.createIdentifier({
                tag: 34,
                value: "a",
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 },
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
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 8 },
                }),
                [
                  ASTFactory.createArrayElement(
                    ASTFactory.createMemberAttribute(
                      ASTFactory.createMemberFunctionCall(
                        ASTFactory.createIdentifier({
                          tag: 34,
                          value: "b",
                          start: { line: 1, column: 9 },
                          end: { line: 1, column: 10 },
                        }),
                        ASTFactory.createFunctionCall(
                          ASTFactory.createIdentifier({
                            tag: 34,
                            value: "j",
                            start: { line: 1, column: 11 },
                            end: { line: 1, column: 12 },
                          }),
                          [],
                          { line: 1, column: 11 },
                          { line: 1, column: 14 },
                        ),
                      ),
                      ASTFactory.createIdentifier({
                        tag: 34,
                        value: "l",
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 16 },
                      }),
                    ),
                    [
                      ASTFactory.createNumberNode({
                        tag: 35,
                        value: "0",
                        start: { line: 1, column: 17 },
                        end: { line: 1, column: 18 },
                      }),
                    ],
                    { line: 1, column: 9 },
                    { line: 1, column: 19 },
                  ),
                ],
                { line: 1, column: 5 },
                { line: 1, column: 20 },
              ),
              [
                ASTFactory.createNumberNode({
                  tag: 35,
                  value: "0",
                  start: { line: 1, column: 21 },
                  end: { line: 1, column: 22 },
                }),
              ],
              { line: 1, column: 5 },
              { line: 1, column: 23 },
            ),
          ],
          { line: 1, column: 1 },
          { line: 1, column: 23 },
        ),
      ],
      { line: 1, column: 1 },
      { line: 1, column: 23 },
    );

    parserTestt(source, tokens, expected);
  });

  test("Function call assignment - 3", () => {
    const source = "a, b, str d = foo().k(7 ** 2) + 1, 5, 'Hello'";

    const tokens = [
      createToken(34, "a", { line: 1, column: 1 }, { line: 1, column: 2 }),
      createToken(28, ",", { line: 1, column: 2 }, { line: 1, column: 3 }),
      createToken(34, "b", { line: 1, column: 4 }, { line: 1, column: 5 }),
      createToken(28, ",", { line: 1, column: 5 }, { line: 1, column: 6 }),
      createToken(32, "str", { line: 1, column: 7 }, { line: 1, column: 10 }),
      createToken(34, "d", { line: 1, column: 11 }, { line: 1, column: 12 }),
      createToken(21, "=", { line: 1, column: 13 }, { line: 1, column: 14 }),
      createToken(34, "foo", { line: 1, column: 15 }, { line: 1, column: 18 }),
      createToken(22, "(", { line: 1, column: 18 }, { line: 1, column: 19 }),
      createToken(23, ")", { line: 1, column: 19 }, { line: 1, column: 20 }),
      createToken(29, ".", { line: 1, column: 20 }, { line: 1, column: 21 }),
      createToken(34, "k", { line: 1, column: 21 }, { line: 1, column: 22 }),
      createToken(22, "(", { line: 1, column: 22 }, { line: 1, column: 23 }),
      createToken(35, "7", { line: 1, column: 23 }, { line: 1, column: 24 }),
      createToken(6, "**", { line: 1, column: 25 }, { line: 1, column: 27 }),
      createToken(35, "2", { line: 1, column: 28 }, { line: 1, column: 29 }),
      createToken(23, ")", { line: 1, column: 29 }, { line: 1, column: 30 }),
      createToken(1, "+", { line: 1, column: 31 }, { line: 1, column: 32 }),
      createToken(35, "1", { line: 1, column: 33 }, { line: 1, column: 34 }),
      createToken(28, ",", { line: 1, column: 34 }, { line: 1, column: 35 }),
      createToken(35, "5", { line: 1, column: 36 }, { line: 1, column: 37 }),
      createToken(28, ",", { line: 1, column: 37 }, { line: 1, column: 38 }),
      createToken(30, "'", { line: 1, column: 39 }, { line: 1, column: 40 }),
      createToken(
        36,
        "Hello",
        { line: 1, column: 40 },
        { line: 1, column: 45 },
      ),
      createToken(30, "'", { line: 1, column: 45 }, { line: 1, column: 46 }),
      createToken(0, "", { line: 1, column: 46 }, { line: 1, column: 46 }),
    ];

    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createVariableOperations(
          [
            ASTFactory.createVariableAssignment(
              ASTFactory.createIdentifier({
                tag: 34,
                value: "a",
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 },
              }),
            ),
            ASTFactory.createVariableAssignment(
              ASTFactory.createIdentifier({
                tag: 34,
                value: "b",
                start: { line: 1, column: 4 },
                end: { line: 1, column: 5 },
              }),
            ),
            ASTFactory.createVariableDeclaration(
              ASTFactory.createType(
                "str",
                0,
                { line: 1, column: 7 },
                { line: 1, column: 10 },
              ),
              ASTFactory.createIdentifier({
                tag: 34,
                value: "d",
                start: { line: 1, column: 11 },
                end: { line: 1, column: 12 },
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
                    start: { line: 1, column: 15 },
                    end: { line: 1, column: 18 },
                  }),
                  [],
                  { line: 1, column: 15 },
                  { line: 1, column: 20 },
                ),
                ASTFactory.createFunctionCall(
                  ASTFactory.createIdentifier({
                    tag: 34,
                    value: "k",
                    start: { line: 1, column: 21 },
                    end: { line: 1, column: 22 },
                  }),
                  [
                    ASTFactory.createBinaryExpression(
                      ASTFactory.createNumberNode({
                        tag: 35,
                        value: "7",
                        start: { line: 1, column: 23 },
                        end: { line: 1, column: 24 },
                      }),
                      6,
                      ASTFactory.createNumberNode({
                        tag: 35,
                        value: "2",
                        start: { line: 1, column: 28 },
                        end: { line: 1, column: 29 },
                      }),
                    ),
                  ],
                  { line: 1, column: 21 },
                  { line: 1, column: 30 },
                ),
              ),
              1,
              ASTFactory.createNumberNode({
                tag: 35,
                value: "1",
                start: { line: 1, column: 33 },
                end: { line: 1, column: 34 },
              }),
            ),
            ASTFactory.createNumberNode({
              tag: 35,
              value: "5",
              start: { line: 1, column: 36 },
              end: { line: 1, column: 37 },
            }),
            ASTFactory.createFString(
              [
                ASTFactory.createStringNode({
                  tag: 36,
                  value: "Hello",
                  start: { line: 1, column: 40 },
                  end: { line: 1, column: 45 },
                }),
              ],
              { line: 1, column: 39 },
              { line: 1, column: 46 },
            ),
          ],
          { line: 1, column: 1 },
          { line: 1, column: 46 },
        ),
      ],
      { line: 1, column: 1 },
      { line: 1, column: 46 },
    );

    parserTestt(source, tokens, expected);
  });
});

describe("Underscore functions", () => {
  test("Constructor declaration - 1", () => {
    const expected = {
      kind: "Program",
      body: [
        {
          kind: "FunctionDeclaration",
          returnTypes: ["a"],
          identifier: {
            kind: "Identifier",
            name: "_",
            start: {
              line: 1,
              column: 5,
            },
            end: {
              line: 1,
              column: 6,
            },
          },
          parameters: [],
          body: [],
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 1,
            column: 11,
          },
        },
      ],
      start: {
        line: 1,
        column: 1,
      },
      end: {
        line: 1,
        column: 11,
      },
    } as Program;

    parserTest(
      getTestFilePath(
        SUIT_FOLDER,
        SOURCE_FOLDER,
        "ConstructorDeclaration-1.dy",
      ),
      expected,
    );
  });

  test("Constructor declaration - 2", () => {
    const expected = {
      kind: "Program",
      body: [
        {
          kind: "FunctionDeclaration",
          returnTypes: ["a"],
          identifier: {
            kind: "Identifier",
            name: "_",
            start: {
              line: 1,
              column: 5,
            },
            end: {
              line: 1,
              column: 6,
            },
          },
          parameters: [
            {
              kind: "VariableDeclaration",
              type: "num",
              identifier: {
                kind: "Identifier",
                name: "a",
                start: {
                  line: 1,
                  column: 11,
                },
                end: {
                  line: 1,
                  column: 12,
                },
              },
              start: {
                line: 1,
                column: 7,
              },
              end: {
                line: 1,
                column: 12,
              },
            },
          ],
          body: [],
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 1,
            column: 16,
          },
        },
      ],
      start: {
        line: 1,
        column: 1,
      },
      end: {
        line: 1,
        column: 16,
      },
    } as Program;

    parserTest(
      getTestFilePath(
        SUIT_FOLDER,
        SOURCE_FOLDER,
        "ConstructorDeclaration-2.dy",
      ),
      expected,
    );
  });

  test("Constructor declaration - 3", () => {
    const expected = {
      kind: "Program",
      body: [
        {
          kind: "FunctionDeclaration",
          returnTypes: ["a"],
          identifier: {
            kind: "Identifier",
            name: "_",
            start: {
              line: 1,
              column: 5,
            },
            end: {
              line: 1,
              column: 6,
            },
          },
          parameters: [
            {
              kind: "VariableDeclaration",
              type: "b[]",
              identifier: {
                kind: "Identifier",
                name: "c",
                start: {
                  line: 1,
                  column: 11,
                },
                end: {
                  line: 1,
                  column: 12,
                },
              },
              start: {
                line: 1,
                column: 7,
              },
              end: {
                line: 1,
                column: 12,
              },
            },
          ],
          body: [],
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 1,
            column: 16,
          },
        },
      ],
      start: {
        line: 1,
        column: 1,
      },
      end: {
        line: 1,
        column: 16,
      },
    } as Program;

    parserTest(
      getTestFilePath(
        SUIT_FOLDER,
        SOURCE_FOLDER,
        "ConstructorDeclaration-3.dy",
      ),
      expected,
    );
  });

  test("Constructor call - 1", () => {
    const expected = {
      kind: "Program",
      body: [
        {
          kind: "VariableOperations",
          operations: [
            {
              kind: "VariableAssignment",
              element: {
                kind: "Identifier",
                name: "a",
                start: {
                  line: 1,
                  column: 1,
                },
                end: {
                  line: 1,
                  column: 2,
                },
              },
              start: {
                line: 1,
                column: 1,
              },
              end: {
                line: 1,
                column: 2,
              },
            },
          ],
          operator: 21,
          values: [
            {
              kind: "FunctionCall",
              identifier: {
                kind: "Identifier",
                name: "_",
                start: {
                  line: 1,
                  column: 5,
                },
                end: {
                  line: 1,
                  column: 6,
                },
              },
              arguments: [],
              start: {
                line: 1,
                column: 5,
              },
              end: {
                line: 1,
                column: 8,
              },
            },
          ],
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 1,
            column: 8,
          },
        },
      ],
      start: {
        line: 1,
        column: 1,
      },
      end: {
        line: 1,
        column: 8,
      },
    } as Program;

    parserTest(
      getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ConstructorCall-1.dy"),
      expected,
    );
  });

  test("Constructor call - 2", () => {
    const expected = {
      kind: "Program",
      body: [
        {
          kind: "VariableOperations",
          operations: [
            {
              kind: "VariableDeclaration",
              type: "a",
              identifier: {
                kind: "Identifier",
                name: "a",
                start: {
                  line: 1,
                  column: 3,
                },
                end: {
                  line: 1,
                  column: 4,
                },
              },
              start: {
                line: 1,
                column: 1,
              },
              end: {
                line: 1,
                column: 4,
              },
            },
          ],
          operator: 21,
          values: [
            {
              kind: "FunctionCall",
              identifier: {
                kind: "Identifier",
                name: "_",
                start: {
                  line: 1,
                  column: 7,
                },
                end: {
                  line: 1,
                  column: 8,
                },
              },
              arguments: [],
              start: {
                line: 1,
                column: 7,
              },
              end: {
                line: 1,
                column: 10,
              },
            },
          ],
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 1,
            column: 10,
          },
        },
      ],
      start: {
        line: 1,
        column: 1,
      },
      end: {
        line: 1,
        column: 10,
      },
    } as Program;

    parserTest(
      getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ConstructorCall-2.dy"),
      expected,
    );
  });

  test("Constructor call - 3", () => {
    const expected = {
      kind: "Program",
      body: [
        {
          kind: "VariableOperations",
          operations: [
            {
              kind: "VariableAssignment",
              element: {
                kind: "Identifier",
                name: "a",
                start: {
                  line: 1,
                  column: 1,
                },
                end: {
                  line: 1,
                  column: 2,
                },
              },
              start: {
                line: 1,
                column: 1,
              },
              end: {
                line: 1,
                column: 2,
              },
            },
          ],
          operator: 21,
          values: [
            {
              kind: "MemberAttribute",
              member: {
                kind: "ArrayElement",
                array: {
                  kind: "FunctionCall",
                  identifier: {
                    kind: "Identifier",
                    name: "_",
                    start: {
                      line: 1,
                      column: 5,
                    },
                    end: {
                      line: 1,
                      column: 6,
                    },
                  },
                  arguments: [
                    {
                      kind: "ArrayElement",
                      array: {
                        kind: "MemberAttribute",
                        member: {
                          kind: "MemberFunctionCall",
                          member: {
                            kind: "Identifier",
                            name: "b",
                            start: {
                              line: 1,
                              column: 7,
                            },
                            end: {
                              line: 1,
                              column: 8,
                            },
                          },
                          function: {
                            kind: "FunctionCall",
                            identifier: {
                              kind: "Identifier",
                              name: "j",
                              start: {
                                line: 1,
                                column: 9,
                              },
                              end: {
                                line: 1,
                                column: 10,
                              },
                            },
                            arguments: [],
                            start: {
                              line: 1,
                              column: 9,
                            },
                            end: {
                              line: 1,
                              column: 12,
                            },
                          },
                          start: {
                            line: 1,
                            column: 7,
                          },
                          end: {
                            line: 1,
                            column: 12,
                          },
                        },
                        attribute: {
                          kind: "Identifier",
                          name: "l",
                          start: {
                            line: 1,
                            column: 13,
                          },
                          end: {
                            line: 1,
                            column: 14,
                          },
                        },
                        start: {
                          line: 1,
                          column: 7,
                        },
                        end: {
                          line: 1,
                          column: 14,
                        },
                      },
                      indexes: [
                        {
                          kind: "Number",
                          value: 0,
                          start: {
                            line: 1,
                            column: 15,
                          },
                          end: {
                            line: 1,
                            column: 16,
                          },
                        },
                      ],
                      start: {
                        line: 1,
                        column: 7,
                      },
                      end: {
                        line: 1,
                        column: 17,
                      },
                    },
                  ],
                  start: {
                    line: 1,
                    column: 5,
                  },
                  end: {
                    line: 1,
                    column: 18,
                  },
                },
                indexes: [
                  {
                    kind: "Number",
                    value: 0,
                    start: {
                      line: 1,
                      column: 19,
                    },
                    end: {
                      line: 1,
                      column: 20,
                    },
                  },
                ],
                start: {
                  line: 1,
                  column: 5,
                },
                end: {
                  line: 1,
                  column: 21,
                },
              },
              attribute: {
                kind: "Identifier",
                name: "d",
                start: {
                  line: 1,
                  column: 22,
                },
                end: {
                  line: 1,
                  column: 23,
                },
              },
              start: {
                line: 1,
                column: 5,
              },
              end: {
                line: 1,
                column: 23,
              },
            },
          ],
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 1,
            column: 23,
          },
        },
      ],
      start: {
        line: 1,
        column: 1,
      },
      end: {
        line: 1,
        column: 23,
      },
    } as Program;

    parserTest(
      getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ConstructorCall-3.dy"),
      expected,
    );
  });

  test("Constructor call - 4", () => {
    const expected = {
      kind: "Program",
      body: [
        {
          kind: "VariableOperations",
          operations: [
            {
              kind: "VariableAssignment",
              element: {
                kind: "Identifier",
                name: "a",
                start: {
                  line: 1,
                  column: 1,
                },
                end: {
                  line: 1,
                  column: 2,
                },
              },
              start: {
                line: 1,
                column: 1,
              },
              end: {
                line: 1,
                column: 2,
              },
            },
          ],
          operator: 21,
          values: [
            {
              kind: "BinaryExpression",
              left: {
                kind: "FunctionCall",
                identifier: {
                  kind: "Identifier",
                  name: "_",
                  start: {
                    line: 1,
                    column: 5,
                  },
                  end: {
                    line: 1,
                    column: 6,
                  },
                },
                arguments: [],
                start: {
                  line: 1,
                  column: 5,
                },
                end: {
                  line: 1,
                  column: 8,
                },
              },
              operator: 1,
              right: {
                kind: "Number",
                value: 1,
                start: {
                  line: 1,
                  column: 11,
                },
                end: {
                  line: 1,
                  column: 12,
                },
              },
              start: {
                line: 1,
                column: 5,
              },
              end: {
                line: 1,
                column: 12,
              },
            },
          ],
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 1,
            column: 12,
          },
        },
      ],
      start: {
        line: 1,
        column: 1,
      },
      end: {
        line: 1,
        column: 12,
      },
    } as Program;

    parserTest(
      getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ConstructorCall-4.dy"),
      expected,
    );
  });
});

test("Complex function statement", () => {
  const expected = {
    kind: "Program",
    body: [
      {
        kind: "VariableOperations",
        operations: [
          {
            kind: "VariableAssignment",
            element: {
              kind: "Identifier",
              name: "x",
              start: {
                line: 1,
                column: 1,
              },
              end: {
                line: 1,
                column: 2,
              },
            },
            start: {
              line: 1,
              column: 1,
            },
            end: {
              line: 1,
              column: 2,
            },
          },
          {
            kind: "VariableDeclaration",
            type: "str",
            identifier: {
              kind: "Identifier",
              name: "y",
              start: {
                line: 1,
                column: 8,
              },
              end: {
                line: 1,
                column: 9,
              },
            },
            start: {
              line: 1,
              column: 4,
            },
            end: {
              line: 1,
              column: 9,
            },
          },
          {
            kind: "VariableDeclaration",
            type: "bool[]",
            identifier: {
              kind: "Identifier",
              name: "w",
              start: {
                line: 1,
                column: 18,
              },
              end: {
                line: 1,
                column: 19,
              },
            },
            start: {
              line: 1,
              column: 11,
            },
            end: {
              line: 1,
              column: 19,
            },
          },
          {
            kind: "VariableAssignment",
            element: {
              kind: "Identifier",
              name: "_",
              start: {
                line: 1,
                column: 21,
              },
              end: {
                line: 1,
                column: 22,
              },
            },
            start: {
              line: 1,
              column: 21,
            },
            end: {
              line: 1,
              column: 22,
            },
          },
          {
            kind: "VariableAssignment",
            element: {
              kind: "Identifier",
              name: "_",
              start: {
                line: 1,
                column: 24,
              },
              end: {
                line: 1,
                column: 25,
              },
            },
            start: {
              line: 1,
              column: 24,
            },
            end: {
              line: 1,
              column: 25,
            },
          },
          {
            kind: "VariableDeclaration",
            type: "dog[][][]",
            identifier: {
              kind: "Identifier",
              name: "d",
              start: {
                line: 1,
                column: 37,
              },
              end: {
                line: 1,
                column: 38,
              },
            },
            start: {
              line: 1,
              column: 27,
            },
            end: {
              line: 1,
              column: 38,
            },
          },
        ],
        operator: 21,
        values: [
          {
            kind: "FunctionCall",
            identifier: {
              kind: "Identifier",
              name: "foobar",
              start: {
                line: 1,
                column: 41,
              },
              end: {
                line: 1,
                column: 47,
              },
            },
            arguments: [],
            start: {
              line: 1,
              column: 41,
            },
            end: {
              line: 1,
              column: 49,
            },
          },
        ],
        start: {
          line: 1,
          column: 1,
        },
        end: {
          line: 1,
          column: 49,
        },
      },
    ],
    start: {
      line: 1,
      column: 1,
    },
    end: {
      line: 1,
      column: 49,
    },
  } as Program;

  parserTest(
    getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ComplexFunctionStatement.dy"),
    expected,
  );
});
