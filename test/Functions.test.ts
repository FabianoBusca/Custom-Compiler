import { parserTest } from "./utils";

describe("Function calls and declarations", () => {
    test("Function call assignment - 1", () => {
        const source = `a = foo()`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "VariableOperations",
                                      "operations": [
                                        {
                                          "kind": "VariableAssignment",
                                          "element": {
                                            "kind": "Identifier",
                                            "name": "a"
                                          }
                                        }
                                      ],
                                      "operator": "=",
                                      "values": [
                                        {
                                          "kind": "FunctionCall",
                                          "identifier": {
                                            "kind": "Identifier",
                                            "name": "foo"
                                          },
                                          "arguments": []
                                        }
                                      ]
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("Function assignment - 2", () => {
        const source = `a = foo(b.j().l[0])[0]`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "VariableOperations",
                                      "operations": [
                                        {
                                          "kind": "VariableAssignment",
                                          "element": {
                                            "kind": "Identifier",
                                            "name": "a"
                                          }
                                        }
                                      ],
                                      "operator": "=",
                                      "values": [
                                        {
                                          "kind": "ArrayElement",
                                          "array": {
                                            "kind": "FunctionCall",
                                            "identifier": {
                                              "kind": "Identifier",
                                              "name": "foo"
                                            },
                                            "arguments": [
                                              {
                                                "kind": "ArrayElement",
                                                "array": {
                                                  "kind": "MemberAttribute",
                                                  "object": {
                                                    "kind": "MemberFunctionCall",
                                                    "member": {
                                                      "kind": "Identifier",
                                                      "name": "b"
                                                    },
                                                    "function": {
                                                      "kind": "FunctionCall",
                                                      "identifier": {
                                                        "kind": "Identifier",
                                                        "name": "j"
                                                      },
                                                      "arguments": []
                                                    }
                                                  },
                                                  "attribute": {
                                                    "kind": "Identifier",
                                                    "name": "l"
                                                  }
                                                },
                                                "indices": [
                                                  {
                                                    "kind": "Number",
                                                    "value": 0
                                                  }
                                                ]
                                              }
                                            ]
                                          },
                                          "indices": [
                                            {
                                              "kind": "Number",
                                              "value": 0
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("Function assignment - 3", () => {
        const source = `a, b, str d = foo().k(7 ** 2) + 1, 5, 'Hello'`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "VariableOperations",
                                      "operations": [
                                        {
                                          "kind": "VariableAssignment",
                                          "element": {
                                            "kind": "Identifier",
                                            "name": "a"
                                          }
                                        },
                                        {
                                          "kind": "VariableAssignment",
                                          "element": {
                                            "kind": "Identifier",
                                            "name": "b"
                                          }
                                        },
                                        {
                                          "kind": "VariableDeclaration",
                                          "type": "str",
                                          "identifier": {
                                            "kind": "Identifier",
                                            "name": "d"
                                          }
                                        }
                                      ],
                                      "operator": "=",
                                      "values": [
                                        {
                                          "kind": "BinaryExpression",
                                          "left": {
                                            "kind": "MemberFunctionCall",
                                            "member": {
                                              "kind": "FunctionCall",
                                              "identifier": {
                                                "kind": "Identifier",
                                                "name": "foo"
                                              },
                                              "arguments": []
                                            },
                                            "function": {
                                              "kind": "FunctionCall",
                                              "identifier": {
                                                "kind": "Identifier",
                                                "name": "k"
                                              },
                                              "arguments": [
                                                {
                                                  "kind": "BinaryExpression",
                                                  "left": {
                                                    "kind": "Number",
                                                    "value": 7
                                                  },
                                                  "operator": 6,
                                                  "right": {
                                                    "kind": "Number",
                                                    "value": 2
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          "operator": 1,
                                          "right": {
                                            "kind": "Number",
                                            "value": 1
                                          }
                                        },
                                        {
                                          "kind": "Number",
                                          "value": 5
                                        },
                                        {
                                          "kind": "F-String",
                                          "value": [
                                            {
                                              "kind": "String",
                                              "value": "Hello"
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("Function declaration - 1", () => {
        const source = `a = foo() {}`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "FunctionDeclaration",
                                      "returnTypes": [
                                        "a"
                                      ],
                                      "identifier": {
                                        "kind": "Identifier",
                                        "name": "foo"
                                      },
                                      "parameters": [],
                                      "body": []
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("Function declaration - 2", () => {
        const source = `a = foo(num a) {}`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "FunctionDeclaration",
                                      "returnTypes": [
                                        "a"
                                      ],
                                      "identifier": {
                                        "kind": "Identifier",
                                        "name": "foo"
                                      },
                                      "parameters": [
                                        {
                                          "kind": "VariableDeclaration",
                                          "type": "num",
                                          "identifier": {
                                            "kind": "Identifier",
                                            "name": "a"
                                          }
                                        }
                                      ],
                                      "body": []
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("Function declaration - 3", () => {
        const source = `a = foo(b[] c) {}`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "FunctionDeclaration",
                                      "returnTypes": [
                                        "a"
                                      ],
                                      "identifier": {
                                        "kind": "Identifier",
                                        "name": "foo"
                                      },
                                      "parameters": [
                                        {
                                          "kind": "VariableDeclaration",
                                          "type": "b[]",
                                          "identifier": {
                                            "kind": "Identifier",
                                            "name": "c"
                                          }
                                        }
                                      ],
                                      "body": []
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });
});
