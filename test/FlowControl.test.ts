import {parserTest} from "./Utils";

describe("Flow control statements", () => {

    test("If statement - 1", () => {
        const source = `if ((5 + foo()) % 2 == 0) {
                                    print("Yes!")
                                }`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "IfStatement",
                                      "condition": {
                                        "kind": "LogicalExpression",
                                        "left": {
                                          "kind": "BinaryExpression",
                                          "left": {
                                            "kind": "BinaryExpression",
                                            "left": {
                                              "kind": "Number",
                                              "value": 5
                                            },
                                            "operator": 1,
                                            "right": {
                                              "kind": "FunctionCall",
                                              "identifier": {
                                                "kind": "Identifier",
                                                "name": "foo"
                                              },
                                              "arguments": []
                                            }
                                          },
                                          "operator": 5,
                                          "right": {
                                            "kind": "Number",
                                            "value": 2
                                          }
                                        },
                                        "operator": 15,
                                        "right": {
                                          "kind": "Number",
                                          "value": 0
                                        }
                                      },
                                      "body": [
                                        {
                                          "kind": "FunctionCall",
                                          "identifier": {
                                            "kind": "Identifier",
                                            "name": "print"
                                          },
                                          "arguments": [
                                            {
                                              "kind": "String",
                                              "value": "Yes!"
                                            }
                                          ]
                                        }
                                      ],
                                      "elseBody": null
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("If statement - 2", () => {
        const source = `if (a[0][0][1] != !l.foobar()[3]) {
                                    a++
                                } else {
                                    b = !b
                                }`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "IfStatement",
                                      "condition": {
                                        "kind": "LogicalExpression",
                                        "left": {
                                          "kind": "ArrayElement",
                                          "array": {
                                            "kind": "Identifier",
                                            "name": "a"
                                          },
                                          "indices": [
                                            {
                                              "kind": "Number",
                                              "value": 0
                                            },
                                            {
                                              "kind": "Number",
                                              "value": 0
                                            },
                                            {
                                              "kind": "Number",
                                              "value": 1
                                            }
                                          ]
                                        },
                                        "operator": 16,
                                        "right": {
                                          "kind": "UnaryExpression",
                                          "operator": "!",
                                          "base": {
                                            "kind": "ArrayElement",
                                            "array": {
                                              "kind": "MemberFunctionCall",
                                              "member": {
                                                "kind": "Identifier",
                                                "name": "l"
                                              },
                                              "function": {
                                                "kind": "FunctionCall",
                                                "identifier": {
                                                  "kind": "Identifier",
                                                  "name": "foobar"
                                                },
                                                "arguments": []
                                              }
                                            },
                                            "indices": [
                                              {
                                                "kind": "Number",
                                                "value": 3
                                              }
                                            ]
                                          }
                                        }
                                      },
                                      "body": [
                                        {
                                          "kind": "UnaryExpression",
                                          "operator": "++",
                                          "base": {
                                            "kind": "Identifier",
                                            "name": "a"
                                          }
                                        }
                                      ],
                                      "elseBody": [
                                        {
                                          "kind": "VariableOperations",
                                          "operations": [
                                            {
                                              "kind": "VariableAssignment",
                                              "element": {
                                                "kind": "Identifier",
                                                "name": "b"
                                              }
                                            }
                                          ],
                                          "operator": "=",
                                          "values": [
                                            {
                                              "kind": "UnaryExpression",
                                              "operator": "!",
                                              "base": {
                                                "kind": "Identifier",
                                                "name": "b"
                                              }
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("For statement - 1", () => {
        const source = `for (i, x.length) {
                                    print(x[i])
                                }`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "ForStatement",
                                      "iterator": {
                                        "kind": "Identifier",
                                        "name": "i"
                                      },
                                      "limit": {
                                        "kind": "MemberAttribute",
                                        "object": {
                                          "kind": "Identifier",
                                          "name": "x"
                                        },
                                        "attribute": {
                                          "kind": "Identifier",
                                          "name": "length"
                                        }
                                      },
                                      "body": [
                                        {
                                          "kind": "FunctionCall",
                                          "identifier": {
                                            "kind": "Identifier",
                                            "name": "print"
                                          },
                                          "arguments": [
                                            {
                                              "kind": "ArrayElement",
                                              "array": {
                                                "kind": "Identifier",
                                                "name": "x"
                                              },
                                              "indices": [
                                                {
                                                  "kind": "Identifier",
                                                  "name": "i"
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("For statement - 2", () => {
        const source = `for (i, x) {
                                    print(i)
                                }`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "ForStatement",
                                      "iterator": {
                                        "kind": "Identifier",
                                        "name": "i"
                                      },
                                      "limit": {
                                        "kind": "Identifier",
                                        "name": "x"
                                      },
                                      "body": [
                                        {
                                          "kind": "FunctionCall",
                                          "identifier": {
                                            "kind": "Identifier",
                                            "name": "print"
                                          },
                                          "arguments": [
                                            {
                                              "kind": "Identifier",
                                              "name": "i"
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("While statement - 1", () => {
        const source = `while (a) {
                                    b()
                                }`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "WhileStatement",
                                      "condition": {
                                        "kind": "Identifier",
                                        "name": "a"
                                      },
                                      "body": [
                                        {
                                          "kind": "FunctionCall",
                                          "identifier": {
                                            "kind": "Identifier",
                                            "name": "b"
                                          },
                                          "arguments": []
                                        }
                                      ]
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });
});
