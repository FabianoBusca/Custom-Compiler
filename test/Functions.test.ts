import { parserTest } from "./utils";

describe("Function calls and declarations", () => {

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

    test("Function call assignment - 2", () => {
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

    test("Function call assignment - 3", () => {
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
});

describe("Underscore functions", () => {

    test("Constructor declaration - 1", () => {
        const source = `a = _() {}`;
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
                                        "name": "_"
                                      },
                                      "parameters": [],
                                      "body": []
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("Constructor declaration - 2", () => {
        const source = `a = _(num a) {}`;
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
                                        "name": "_"
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

    test("Constructor declaration - 3", () => {
        const source = `a = _(b[] c) {}`;
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
                                        "name": "_"
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

    test("Constructor call - 1", () => {
        const source = `a = _()`;
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
                                            "name": "_"
                                          },
                                          "arguments": []
                                        }
                                      ]
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("Constructor call - 2", () => {
        const source = `a a = _()`;
        const expected = `{
                                  "kind": "Program",
                                  "body": [
                                    {
                                      "kind": "VariableOperations",
                                      "operations": [
                                        {
                                          "kind": "VariableDeclaration",
                                          "type": "a",
                                          "identifier": {
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
                                            "name": "_"
                                          },
                                          "arguments": []
                                        }
                                      ]
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("Constructor call - 3", () => {
        const source = `a = _(b.j().l[0])[0].d`;
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
                                          "kind": "MemberAttribute",
                                          "object": {
                                            "kind": "ArrayElement",
                                            "array": {
                                              "kind": "FunctionCall",
                                              "identifier": {
                                                "kind": "Identifier",
                                                "name": "_"
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
                                          },
                                          "attribute": {
                                            "kind": "Identifier",
                                            "name": "d"
                                          }
                                        }
                                      ]
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });

    test("Constructor call - 4", () => {
        const source = `a = _() + 1`;
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
                                          "kind": "BinaryExpression",
                                          "left": {
                                            "kind": "FunctionCall",
                                            "identifier": {
                                              "kind": "Identifier",
                                              "name": "_"
                                            },
                                            "arguments": []
                                          },
                                          "operator": 1,
                                          "right": {
                                            "kind": "Number",
                                            "value": 1
                                          }
                                        }
                                      ]
                                    }
                                  ]
                                }`;
        parserTest(source, JSON.parse(expected));
    });
});

test("Complex function statement", () => {
    const source = `x, str y, bool[] w, _, _, dog[][][] d = foobar()`;
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
                                        "name": "x"
                                      }
                                    },
                                    {
                                      "kind": "VariableDeclaration",
                                      "type": "str",
                                      "identifier": {
                                        "kind": "Identifier",
                                        "name": "y"
                                      }
                                    },
                                    {
                                      "kind": "VariableDeclaration",
                                      "type": "bool[]",
                                      "identifier": {
                                        "kind": "Identifier",
                                        "name": "w"
                                      }
                                    },
                                    {
                                      "kind": "VariableAssignment",
                                      "element": {
                                        "kind": "Identifier",
                                        "name": "_"
                                      }
                                    },
                                    {
                                      "kind": "VariableAssignment",
                                      "element": {
                                        "kind": "Identifier",
                                        "name": "_"
                                      }
                                    },
                                    {
                                      "kind": "VariableDeclaration",
                                      "type": "dog[][][]",
                                      "identifier": {
                                        "kind": "Identifier",
                                        "name": "d"
                                      }
                                    }
                                  ],
                                  "operator": "=",
                                  "values": [
                                    {
                                      "kind": "FunctionCall",
                                      "identifier": {
                                        "kind": "Identifier",
                                        "name": "foobar"
                                      },
                                      "arguments": []
                                    }
                                  ]
                                }
                              ]
                            }`;
    parserTest(source, JSON.parse(expected));
});
