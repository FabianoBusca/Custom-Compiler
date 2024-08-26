import {parserTest} from "../utils/utils";
import {Program} from "../../src/data";

describe("Variables declarations and assignment", () => {

    test("Variable declaration - 1", () => {
        const source = `num x`;
        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "VariableOperations",
                                      operations: [
                                        {
                                          kind: "VariableDeclaration",
                                          type: "num",
                                          identifier: {
                                            kind: "Identifier",
                                            name: "x"
                                          }
                                        }
                                      ],
                                      operator: null,
                                      values: []
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("Variable declaration - 2", () => {
        const source = `num x, str y, bool z`;
        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "VariableOperations",
                                      operations: [
                                        {
                                          kind: "VariableDeclaration",
                                          type: "num",
                                          identifier: {
                                            kind: "Identifier",
                                            name: "x"
                                          }
                                        },
                                        {
                                          kind: "VariableDeclaration",
                                          type: "str",
                                          identifier: {
                                            kind: "Identifier",
                                            name: "y"
                                          }
                                        },
                                        {
                                          kind: "VariableDeclaration",
                                          type: "bool",
                                          identifier: {
                                            kind: "Identifier",
                                            name: "z"
                                          }
                                        }
                                      ],
                                      operator: null,
                                      values: []
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("Variable declaration - 3", () => {
        const source = `dog d = _('Buddy', 5)`;
        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "VariableOperations",
                                      operations: [
                                        {
                                          kind: "VariableDeclaration",
                                          type: "dog",
                                          identifier: {
                                            kind: "Identifier",
                                            name: "d"
                                          }
                                        }
                                      ],
                                      operator: 21,
                                      values: [
                                        {
                                          kind: "FunctionCall",
                                          identifier: {
                                            kind: "Identifier",
                                            name: "_"
                                          },
                                          arguments: [
                                            {
                                              kind: "F-String",
                                              value: [
                                                {
                                                  kind: "String",
                                                  value: "Buddy"
                                                }
                                              ]
                                            },
                                            {
                                              kind: "Number",
                                              value: 5
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("Variable declaration - 4", () => {
        const source = `dog d, x, _, bool b = 0`;
        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "VariableOperations",
                                      operations: [
                                        {
                                          kind: "VariableDeclaration",
                                          type: "dog",
                                          identifier: {
                                            kind: "Identifier",
                                            name: "d"
                                          }
                                        },
                                        {
                                          kind: "VariableAssignment",
                                          element: {
                                            kind: "Identifier",
                                            name: "x"
                                          }
                                        },
                                        {
                                          kind: "VariableAssignment",
                                          element: {
                                            kind: "Identifier",
                                            name: "_"
                                          }
                                        },
                                        {
                                          kind: "VariableDeclaration",
                                          type: "bool",
                                          identifier: {
                                            kind: "Identifier",
                                            name: "b"
                                          }
                                        }
                                      ],
                                      operator: 21,
                                      values: [
                                        {
                                          kind: "Number",
                                          value: 0
                                        }
                                      ]
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("Variable assignment - 1", () => {
        const source = `a = foo()[0]`;
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
                                            name: "a"
                                          }
                                        }
                                      ],
                                      operator: 21,
                                      values: [
                                        {
                                          kind: "ArrayElement",
                                          array: {
                                            kind: "FunctionCall",
                                            identifier: {
                                              kind: "Identifier",
                                              name: "foo"
                                            },
                                            arguments: []
                                          },
                                          indexes: [
                                            {
                                              kind: "Number",
                                              value: 0
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("Variable assignment - 2", () => {
        const source = `x = "a" + 'f {x.y}'`;
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
                                            name: "x"
                                          }
                                        }
                                      ],
                                      operator: 21,
                                      values: [
                                        {
                                          kind: "BinaryExpression",
                                          left: {
                                            kind: "String",
                                            value: "a"
                                          },
                                          operator: 1,
                                          right: {
                                            kind: "F-String",
                                            value: [
                                              {
                                                kind: "String",
                                                value: "f "
                                              },
                                              {
                                                kind: "MemberAttribute",
                                                member: {
                                                  kind: "Identifier",
                                                  name: "x"
                                                },
                                                attribute: {
                                                  kind: "Identifier",
                                                  name: "y"
                                                }
                                              }
                                            ]
                                          }
                                        }
                                      ]
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("Variable assignment - 3", () => {
        const source = `x, y, z = 5.23, 'Hello {x}', "World"`;
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
                                            name: "x"
                                          }
                                        },
                                        {
                                          kind: "VariableAssignment",
                                          element: {
                                            kind: "Identifier",
                                            name: "y"
                                          }
                                        },
                                        {
                                          kind: "VariableAssignment",
                                          element: {
                                            kind: "Identifier",
                                            name: "z"
                                          }
                                        }
                                      ],
                                      operator: 21,
                                      values: [
                                        {
                                          kind: "Number",
                                          value: 5.23
                                        },
                                        {
                                          kind: "F-String",
                                          value: [
                                            {
                                              kind: "String",
                                              value: "Hello "
                                            },
                                            {
                                              kind: "Identifier",
                                              name: "x"
                                            }
                                          ]
                                        },
                                        {
                                          kind: "String",
                                          value: "World"
                                        }
                                      ]
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("Variable assignment - 4", () => {
        const source = `num[][] a = [[], [1, 2, 3, 4, 5], [1, 3], []]`;
        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "VariableOperations",
                                      operations: [
                                        {
                                          kind: "VariableDeclaration",
                                          type: "num[][]",
                                          identifier: {
                                            kind: "Identifier",
                                            name: "a"
                                          }
                                        }
                                      ],
                                      operator: 21,
                                      values: [
                                        {
                                          kind: "Array",
                                          elements: [
                                            {
                                              kind: "Array",
                                              elements: []
                                            },
                                            {
                                              kind: "Array",
                                              elements: [
                                                {
                                                  kind: "Number",
                                                  value: 1
                                                },
                                                {
                                                  kind: "Number",
                                                  value: 2
                                                },
                                                {
                                                  kind: "Number",
                                                  value: 3
                                                },
                                                {
                                                  kind: "Number",
                                                  value: 4
                                                },
                                                {
                                                  kind: "Number",
                                                  value: 5
                                                }
                                              ]
                                            },
                                            {
                                              kind: "Array",
                                              elements: [
                                                {
                                                  kind: "Number",
                                                  value: 1
                                                },
                                                {
                                                  kind: "Number",
                                                  value: 3
                                                }
                                              ]
                                            },
                                            {
                                              kind: "Array",
                                              elements: []
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                } as Program;

        parserTest(source, expected);
    });
});