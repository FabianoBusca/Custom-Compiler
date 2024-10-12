import {parserTestt} from "../../utils";
import {ASTFactory} from "../../../src/utils/ASTFactory";

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
    
    const tokens = [
      {
        tag: 46,
        value: 'class',
        start: {line: 1, column: 1},
        end: {line: 1, column: 6}
      },
      {
        tag: 34,
        value: 'Dog',
        start: {line: 1, column: 7},
        end: {line: 1, column: 10}
      },
      {
        tag: 21,
        value: '=',
        start: {line: 1, column: 11},
        end: {line: 1, column: 12}
      },
      {
        tag: 26,
        value: '{',
        start: {line: 1, column: 13},
        end: {line: 1, column: 14}
      },
      {
        tag: 32,
        value: 'str',
        start: {line: 2, column: 3},
        end: {line: 2, column: 6}
      },
      {
        tag: 34,
        value: 'name',
        start: {line: 2, column: 7},
        end: {line: 2, column: 11}
      },
      {
        tag: 31,
        value: 'num',
        start: {line: 3, column: 3},
        end: {line: 3, column: 6}
      },
      {
        tag: 34,
        value: 'age',
        start: {line: 3, column: 7},
        end: {line: 3, column: 10}
      },
      {
        tag: 34,
        value: 'Dog',
        start: {line: 4, column: 3},
        end: {line: 4, column: 6}
      },
      {
        tag: 21,
        value: '=',
        start: {line: 4, column: 7},
        end: {line: 4, column: 8}
      },
      {
        tag: 53,
        value: '_',
        start: {line: 4, column: 9},
        end: {line: 4, column: 10}
      },
      {
        tag: 22,
        value: '(',
        start: {line: 4, column: 10},
        end: {line: 4, column: 11}
      },
      {
        tag: 32,
        value: 'str',
        start: {line: 4, column: 11},
        end: {line: 4, column: 14}
      },
      {
        tag: 34,
        value: 'name',
        start: {line: 4, column: 15},
        end: {line: 4, column: 19}
      },
      {
        tag: 28,
        value: ',',
        start: {line: 4, column: 19},
        end: {line: 4, column: 20}
      },
      {
        tag: 31,
        value: 'num',
        start: {line: 4, column: 21},
        end: {line: 4, column: 24}
      },
      {
        tag: 34,
        value: 'age',
        start: {line: 4, column: 25},
        end: {line: 4, column: 28}
      },
      {
        tag: 23,
        value: ')',
        start: {line: 4, column: 28},
        end: {line: 4, column: 29}
      },
      {
        tag: 26,
        value: '{',
        start: {line: 4, column: 30},
        end: {line: 4, column: 31}
      },
      {
        tag: 47,
        value: 'this',
        start: {line: 5, column: 5},
        end: {line: 5, column: 9}
      },
      {
        tag: 29,
        value: '.',
        start: {line: 5, column: 9},
        end: {line: 5, column: 10}
      },
      {
        tag: 34,
        value: 'name',
        start: {line: 5, column: 10},
        end: {line: 5, column: 14}
      },
      {
        tag: 21,
        value: '=',
        start: {line: 5, column: 15},
        end: {line: 5, column: 16}
      },
      {
        tag: 34,
        value: 'name',
        start: {line: 5, column: 17},
        end: {line: 5, column: 21}
      },
      {
        tag: 47,
        value: 'this',
        start: {line: 6, column: 5},
        end: {line: 6, column: 9}
      },
      {
        tag: 29,
        value: '.',
        start: {line: 6, column: 9},
        end: {line: 6, column: 10}
      },
      {
        tag: 34,
        value: 'age',
        start: {line: 6, column: 10},
        end: {line: 6, column: 13}
      },
      {
        tag: 21,
        value: '=',
        start: {line: 6, column: 14},
        end: {line: 6, column: 15}
      },
      {
        tag: 34,
        value: 'age',
        start: {line: 6, column: 16},
        end: {line: 6, column: 19}
      },
      {
        tag: 27,
        value: '}',
        start: {line: 7, column: 3},
        end: {line: 7, column: 4}
      },
      {
        tag: 53,
        value: '_',
        start: {line: 8, column: 3},
        end: {line: 8, column: 4}
      },
      {
        tag: 21,
        value: '=',
        start: {line: 8, column: 5},
        end: {line: 8, column: 6}
      },
      {
        tag: 34,
        value: 'bark',
        start: {line: 8, column: 7},
        end: {line: 8, column: 11}
      },
      {
        tag: 22,
        value: '(',
        start: {line: 8, column: 11},
        end: {line: 8, column: 12}
      },
      {
        tag: 23,
        value: ')',
        start: {line: 8, column: 12},
        end: {line: 8, column: 13}
      },
      {
        tag: 26,
        value: '{',
        start: {line: 8, column: 14},
        end: {line: 8, column: 15}
      },
      {
        tag: 50,
        value: 'print',
        start: {line: 9, column: 5},
        end: {line: 9, column: 10}
      },
      {
        tag: 22,
        value: '(',
        start: {line: 9, column: 10},
        end: {line: 9, column: 11}
      },
      {
        tag: 30,
        value: "'",
        start: {line: 9, column: 11},
        end: {line: 9, column: 12}
      },
      {
        tag: 36,
        value: 'Woof',
        start: {line: 9, column: 12},
        end: {line: 9, column: 16}
      },
      {
        tag: 30,
        value: "'",
        start: {line: 9, column: 16},
        end: {line: 9, column: 17}
      },
      {
        tag: 23,
        value: ')',
        start: {line: 9, column: 17},
        end: {line: 9, column: 18}
      },
      {
        tag: 27,
        value: '}',
        start: {line: 10, column: 3},
        end: {line: 10, column: 4}
      },
      {
        tag: 53,
        value: '_',
        start: {line: 11, column: 3},
        end: {line: 11, column: 4}
      },
      {
        tag: 21,
        value: '=',
        start: {line: 11, column: 5},
        end: {line: 11, column: 6}
      },
      {
        tag: 34,
        value: 'setOwner',
        start: {line: 11, column: 7},
        end: {line: 11, column: 15}
      },
      {
        tag: 22,
        value: '(',
        start: {line: 11, column: 15},
        end: {line: 11, column: 16}
      },
      {
        tag: 34,
        value: 'owner',
        start: {line: 11, column: 16},
        end: {line: 11, column: 21}
      },
      {
        tag: 34,
        value: 'owner',
        start: {line: 11, column: 22},
        end: {line: 11, column: 27}
      },
      {
        tag: 23,
        value: ')',
        start: {line: 11, column: 27},
        end: {line: 11, column: 28}
      },
      {
        tag: 26,
        value: '{',
        start: {line: 11, column: 29},
        end: {line: 11, column: 30}
      },
      {
        tag: 34,
        value: 'owner',
        start: {line: 12, column: 5},
        end: {line: 12, column: 10}
      },
      {
        tag: 29,
        value: '.',
        start: {line: 12, column: 10},
        end: {line: 12, column: 11}
      },
      {
        tag: 34,
        value: 'setDog',
        start: {line: 12, column: 11},
        end: {line: 12, column: 17}
      },
      {
        tag: 22,
        value: '(',
        start: {line: 12, column: 17},
        end: {line: 12, column: 18}
      },
      {
        tag: 47,
        value: 'this',
        start: {line: 12, column: 18},
        end: {line: 12, column: 22}
      },
      {
        tag: 23,
        value: ')',
        start: {line: 12, column: 22},
        end: {line: 12, column: 23}
      },
      {
        tag: 27,
        value: '}',
        start: {line: 13, column: 3},
        end: {line: 13, column: 4}
      },
      {
        tag: 27,
        value: '}',
        start: {line: 14, column: 1},
        end: {line: 14, column: 2}
      },
      {
        tag: 0,
        value: '',
        start: {line: 14, column: 2},
        end: {line: 14, column: 2}
      }
    ];
    
    const expected = ASTFactory.createProgram([
        ASTFactory.createClassDeclaration(
          ASTFactory.createIdentifier({tag: 34, value: "Dog", start: {line: 1, column: 7}, end: {line: 1, column: 10}}),
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
              ASTFactory.createIdentifier({tag: 53, value: "_", start: {line: 4, column: 9}, end: {line: 4, column: 10}}),
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
    
    parserTestt(source, tokens, expected)
  });
});
