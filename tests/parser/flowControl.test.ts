import {parserTest} from "../utils/utils";
import {Program} from "../../src/data";

describe("Flow control statements", () => {

    test("If statement - 1", () => {
        const source = `if ((5 + foo()) % 2 == 0) {
                                    print("Yes!")
                                }`;
        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "IfStatement",
                                      condition: {
                                        kind: "LogicalExpression",
                                        left: {
                                          kind: "BinaryExpression",
                                          left: {
                                            kind: "BinaryExpression",
                                            left: {
                                              kind: "Number",
                                              value: 5
                                            },
                                            operator: 1,
                                            right: {
                                              kind: "FunctionCall",
                                              identifier: {
                                                kind: "Identifier",
                                                name: "foo"
                                              },
                                              arguments: []
                                            }
                                          },
                                          operator: 5,
                                          right: {
                                            kind: "Number",
                                            value: 2
                                          }
                                        },
                                        operator: 15,
                                        right: {
                                          kind: "Number",
                                          value: 0
                                        }
                                      },
                                      body: [
                                        {
                                          kind: "PrintStatement",
                                          arguments: [
                                            {
                                              kind: "String",
                                              value: "Yes!"
                                            }
                                          ]
                                        }
                                      ],
                                      elseBody: null
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("If statement - 2", () => {
        const source = `if (a[0][0][1] != !l.foobar()[3]) {
                                    a++
                                } else {
                                    b = !b
                                }`;
        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "IfStatement",
                                      condition: {
                                        kind: "LogicalExpression",
                                        left: {
                                          kind: "ArrayElement",
                                          array: {
                                            kind: "Identifier",
                                            name: "a"
                                          },
                                          indexes: [
                                            {
                                              kind: "Number",
                                              value: 0
                                            },
                                            {
                                              kind: "Number",
                                              value: 0
                                            },
                                            {
                                              kind: "Number",
                                              value: 1
                                            }
                                          ]
                                        },
                                        operator: 16,
                                        right: {
                                          kind: "UnaryExpression",
                                          operator: 14,
                                          base: {
                                            kind: "ArrayElement",
                                            array: {
                                              kind: "MemberFunctionCall",
                                              member: {
                                                kind: "Identifier",
                                                name: "l"
                                              },
                                              function: {
                                                kind: "FunctionCall",
                                                identifier: {
                                                  kind: "Identifier",
                                                  name: "foobar"
                                                },
                                                arguments: []
                                              }
                                            },
                                            indexes: [
                                              {
                                                kind: "Number",
                                                value: 3
                                              }
                                            ]
                                          }
                                        }
                                      },
                                      body: [
                                        {
                                          kind: "UnaryExpression",
                                          operator: 8,
                                          base: {
                                            kind: "Identifier",
                                            name: "a"
                                          }
                                        }
                                      ],
                                      elseBody: [
                                        {
                                          kind: "VariableOperations",
                                          operations: [
                                            {
                                              kind: "VariableAssignment",
                                              element: {
                                                kind: "Identifier",
                                                name: "b"
                                              }
                                            }
                                          ],
                                          operator: 21,
                                          values: [
                                            {
                                              kind: "UnaryExpression",
                                              operator: 14,
                                              base: {
                                                kind: "Identifier",
                                                name: "b"
                                              }
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("For statement - 1", () => {
        const source = `for (i, x.length) {
                                    print(x[i])
                                }`;
        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "ForStatement",
                                      iterator: {
                                        kind: "Identifier",
                                        name: "i"
                                      },
                                      limit: {
                                        kind: "MemberAttribute",
                                        member: {
                                          kind: "Identifier",
                                          name: "x"
                                        },
                                        attribute: {
                                          kind: "Identifier",
                                          name: "length"
                                        }
                                      },
                                      body: [
                                        {
                                          kind: "PrintStatement",
                                          arguments: [
                                            {
                                              kind: "ArrayElement",
                                              array: {
                                                kind: "Identifier",
                                                name: "x"
                                              },
                                              indexes: [
                                                {
                                                  kind: "Identifier",
                                                  name: "i"
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("For statement - 2", () => {
        const source = `for (i, x) {
                                    print(i)
                                }`;
        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "ForStatement",
                                      iterator: {
                                        kind: "Identifier",
                                        name: "i"
                                      },
                                      limit: {
                                        kind: "Identifier",
                                        name: "x"
                                      },
                                      body: [
                                        {
                                          kind: "PrintStatement",
                                          arguments: [
                                            {
                                              kind: "Identifier",
                                              name: "i"
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("While statement - 1", () => {
        const source = `while (a) {
                                    b()
                                }`;
        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "WhileStatement",
                                      condition: {
                                        kind: "Identifier",
                                        name: "a"
                                      },
                                      body: [
                                        {
                                          kind: "FunctionCall",
                                          identifier: {
                                            kind: "Identifier",
                                            name: "b"
                                          },
                                          arguments: []
                                        }
                                      ]
                                    }
                                  ]
                                } as Program;
        parserTest(source, expected);
    });

    test("Switch statement - 1", () => {
       const source = `switch (foo() + 1) {
                                    case 1 + 1 {
                                        print("1")
                                    }
                                    case a() {
                                        print("a")
                                    }
                                    case b[0] {
                                        print("b")
                                    }
                                
                                    num[] x = 4
                                    print(x)
                                }`

       const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "SwitchStatement",
                                      expression: {
                                        kind: "BinaryExpression",
                                        left: {
                                          kind: "FunctionCall",
                                          identifier: {
                                            kind: "Identifier",
                                            name: "foo"
                                          },
                                          arguments: []
                                        },
                                        operator: 1,
                                        right: {
                                          kind: "Number",
                                          value: 1
                                        }
                                      },
                                      cases: [
                                        {
                                          kind: "CaseStatement",
                                          values: [
                                            {
                                              kind: "BinaryExpression",
                                              left: {
                                                kind: "Number",
                                                value: 1
                                              },
                                              operator: 1,
                                              right: {
                                                kind: "Number",
                                                value: 1
                                              }
                                            }
                                          ],
                                          body: [
                                            {
                                              kind: "PrintStatement",
                                              arguments: [
                                                {
                                                  kind: "String",
                                                  value: "1"
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        {
                                          kind: "CaseStatement",
                                          values: [
                                            {
                                              kind: "FunctionCall",
                                              identifier: {
                                                kind: "Identifier",
                                                name: "a"
                                              },
                                              arguments: []
                                            }
                                          ],
                                          body: [
                                            {
                                              kind: "PrintStatement",                                              
                                              arguments: [
                                                {
                                                  kind: "String",
                                                  value: "a"
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        {
                                          kind: "CaseStatement",
                                          values: [
                                            {
                                              kind: "ArrayElement",
                                              array: {
                                                kind: "Identifier",
                                                name: "b"
                                              },
                                              indexes: [
                                                {
                                                  kind: "Number",
                                                  value: 0
                                                }
                                              ]
                                            }
                                          ],
                                          body: [
                                            {
                                              kind: "PrintStatement",
                                              arguments: [
                                                {
                                                  kind: "String",
                                                  value: "b"
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      ],
                                      default: [
                                        {
                                          kind: "VariableOperations",
                                          operations: [
                                            {
                                              kind: "VariableDeclaration",
                                              type: "num[]",
                                              identifier: {
                                                kind: "Identifier",
                                                name: "x"
                                              }
                                            }
                                          ],
                                          operator: 21,
                                          values: [
                                            {
                                              kind: "Number",
                                              value: 4
                                            }
                                          ]
                                        },
                                        {
                                          kind: "PrintStatement",                                          
                                          arguments: [
                                            {
                                              kind: "Identifier",
                                              name: "x"
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                } as Program;
       parserTest(source, expected);
    });

    test("Complex flow control statement", () => {
        const source = `while (-a().b.length() == 1) {
                                    if (a().b[0] == 1) {
                                        for (i, 5 + a().b.length()) {
                                            print(i)
                                        }
                                    } else {
                                        switch (x % 2 == 0) {
                                            for (i, a().b) {
                                                print(i)
                                            }
                                        }
                                    }
                                }`;
        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "WhileStatement",
                                      condition: {
                                        kind: "LogicalExpression",
                                        left: {
                                          kind: "UnaryExpression",
                                          operator: 2,
                                          base: {
                                            kind: "MemberFunctionCall",
                                            member: {
                                              kind: "MemberAttribute",
                                              member: {
                                                kind: "FunctionCall",
                                                identifier: {
                                                  kind: "Identifier",
                                                  name: "a"
                                                },
                                                arguments: []
                                              },
                                              attribute: {
                                                kind: "Identifier",
                                                name: "b"
                                              }
                                            },
                                            function: {
                                              kind: "FunctionCall",
                                              identifier: {
                                                kind: "Identifier",
                                                name: "length"
                                              },
                                              arguments: []
                                            }
                                          }
                                        },
                                        operator: 15,
                                        right: {
                                          kind: "Number",
                                          value: 1
                                        }
                                      },
                                      body: [
                                        {
                                          kind: "IfStatement",
                                          condition: {
                                            kind: "LogicalExpression",
                                            left: {
                                              kind: "ArrayElement",
                                              array: {
                                                kind: "MemberAttribute",
                                                member: {
                                                  kind: "FunctionCall",
                                                  identifier: {
                                                    kind: "Identifier",
                                                    name: "a"
                                                  },
                                                  arguments: []
                                                },
                                                attribute: {
                                                  kind: "Identifier",
                                                  name: "b"
                                                }
                                              },
                                              indexes: [
                                                {
                                                  kind: "Number",
                                                  value: 0
                                                }
                                              ]
                                            },
                                            operator: 15,
                                            right: {
                                              kind: "Number",
                                              value: 1
                                            }
                                          },
                                          body: [
                                            {
                                              kind: "ForStatement",
                                              iterator: {
                                                kind: "Identifier",
                                                name: "i"
                                              },
                                              limit: {
                                                kind: "BinaryExpression",
                                                left: {
                                                  kind: "Number",
                                                  value: 5
                                                },
                                                operator: 1,
                                                right: {
                                                  kind: "MemberFunctionCall",
                                                  member: {
                                                    kind: "MemberAttribute",
                                                    member: {
                                                      kind: "FunctionCall",
                                                      identifier: {
                                                        kind: "Identifier",
                                                        name: "a"
                                                      },
                                                      arguments: []
                                                    },
                                                    attribute: {
                                                      kind: "Identifier",
                                                      name: "b"
                                                    }
                                                  },
                                                  function: {
                                                    kind: "FunctionCall",
                                                    identifier: {
                                                      kind: "Identifier",
                                                      name: "length"
                                                    },
                                                    arguments: []
                                                  }
                                                }
                                              },
                                              body: [
                                                {
                                                  kind: "PrintStatement",
                                                  arguments: [
                                                    {
                                                      kind: "Identifier",
                                                      name: "i"
                                                    }
                                                  ]
                                                }
                                              ]
                                            }
                                          ],
                                          elseBody: [
                                            {
                                              kind: "SwitchStatement",
                                              expression: {
                                                kind: "LogicalExpression",
                                                left: {
                                                  kind: "BinaryExpression",
                                                  left: {
                                                    kind: "Identifier",
                                                    name: "x"
                                                  },
                                                  operator: 5,
                                                  right: {
                                                    kind: "Number",
                                                    value: 2
                                                  }
                                                },
                                                operator: 15,
                                                right: {
                                                  kind: "Number",
                                                  value: 0
                                                }
                                              },
                                              cases: [],
                                              default: [
                                                {
                                                  kind: "ForStatement",
                                                  iterator: {
                                                    kind: "Identifier",
                                                    name: "i"
                                                  },
                                                  limit: {
                                                    kind: "MemberAttribute",
                                                    member: {
                                                      kind: "FunctionCall",
                                                      identifier: {
                                                        kind: "Identifier",
                                                        name: "a"
                                                      },
                                                      arguments: []
                                                    },
                                                    attribute: {
                                                      kind: "Identifier",
                                                      name: "b"
                                                    }
                                                  },
                                                  body: [
                                                    {
                                                      kind: "PrintStatement",
                                                      arguments: [
                                                        {
                                                          kind: "Identifier",
                                                          name: "i"
                                                        }
                                                      ]
                                                    }
                                                  ]
                                                }
                                              ]
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
