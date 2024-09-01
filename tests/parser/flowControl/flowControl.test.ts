import {Program} from "../../../src/data";
import {getTestFilePath, parserTest, SOURCE_FOLDER} from "../../utils";

const SUIT_FOLDER = 'flowControl';

describe("Flow control statements", () => {

    test("If statement - 1", () => {

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
                    value: 5,
                    start: {
                      line: 1,
                      column: 6
                    },
                    end: {
                      line: 1,
                      column: 7
                    }
                  },
                  operator: 1,
                  right: {
                    kind: "FunctionCall",
                    identifier: {
                      kind: "Identifier",
                      name: "foo",
                      start: {
                        line: 1,
                        column: 10
                      },
                      end: {
                        line: 1,
                        column: 13
                      }
                    },
                    arguments: [],
                    start: {
                      line: 1,
                      column: 10
                    },
                    end: {
                      line: 1,
                      column: 15
                    }
                  },
                  start: {
                    line: 1,
                    column: 6
                  },
                  end: {
                    line: 1,
                    column: 15
                  }
                },
                operator: 5,
                right: {
                  kind: "Number",
                  value: 2,
                  start: {
                    line: 1,
                    column: 19
                  },
                  end: {
                    line: 1,
                    column: 20
                  }
                },
                start: {
                  line: 1,
                  column: 6
                },
                end: {
                  line: 1,
                  column: 20
                }
              },
              operator: 15,
              right: {
                kind: "Number",
                value: 0,
                start: {
                  line: 1,
                  column: 24
                },
                end: {
                  line: 1,
                  column: 25
                }
              },
              start: {
                line: 1,
                column: 6
              },
              end: {
                line: 1,
                column: 25
              }
            },
            body: [
              {
                kind: "PrintStatement",
                arguments: [
                  {
                    kind: "String",
                    value: "Yes!",
                    start: {
                      line: 2,
                      column: 9
                    },
                    end: {
                      line: 2,
                      column: 15
                    }
                  }
                ],
                start: {
                  line: 2,
                  column: 3
                },
                end: {
                  line: 2,
                  column: 16
                }
              }
            ],
            elseBody: [],
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 3,
              column: 2
            }
          }
        ],
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 3,
          column: 2
        }
      } as Program;

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "IfStatement-1.dy"), expected);
    });

    test("If statement - 2", () => {

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
                    name: "a",
                    start: {
                      line: 1,
                      column: 5
                    },
                    end: {
                      line: 1,
                      column: 6
                    }
                  },
                  indexes: [
                    {
                      kind: "Number",
                      value: 0,
                      start: {
                        line: 1,
                        column: 7
                      },
                      end: {
                        line: 1,
                        column: 8
                      }
                    },
                    {
                      kind: "Number",
                      value: 0,
                      start: {
                        line: 1,
                        column: 10
                      },
                      end: {
                        line: 1,
                        column: 11
                      }
                    },
                    {
                      kind: "Number",
                      value: 1,
                      start: {
                        line: 1,
                        column: 13
                      },
                      end: {
                        line: 1,
                        column: 14
                      }
                    }
                  ],
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 15
                  }
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
                        name: "l",
                        start: {
                          line: 1,
                          column: 20
                        },
                        end: {
                          line: 1,
                          column: 21
                        }
                      },
                      function: {
                        kind: "FunctionCall",
                        identifier: {
                          kind: "Identifier",
                          name: "foobar",
                          start: {
                            line: 1,
                            column: 22
                          },
                          end: {
                            line: 1,
                            column: 28
                          }
                        },
                        arguments: [],
                        start: {
                          line: 1,
                          column: 22
                        },
                        end: {
                          line: 1,
                          column: 30
                        }
                      },
                      start: {
                        line: 1,
                        column: 20
                      },
                      end: {
                        line: 1,
                        column: 30
                      }
                    },
                    indexes: [
                      {
                        kind: "Number",
                        value: 3,
                        start: {
                          line: 1,
                          column: 31
                        },
                        end: {
                          line: 1,
                          column: 32
                        }
                      }
                    ],
                    start: {
                      line: 1,
                      column: 20
                    },
                    end: {
                      line: 1,
                      column: 33
                    }
                  },
                  start: {
                    line: 1,
                    column: 19
                  },
                  end: {
                    line: 1,
                    column: 33
                  }
                },
                start: {
                  line: 1,
                  column: 5
                },
                end: {
                  line: 1,
                  column: 33
                }
              },
              body: [
                {
                  kind: "UnaryExpression",
                  operator: 8,
                  base: {
                    kind: "Identifier",
                    name: "a",
                    start: {
                      line: 2,
                      column: 3
                    },
                    end: {
                      line: 2,
                      column: 4
                    }
                  },
                  start: {
                    line: 2,
                    column: 3
                  },
                  end: {
                    line: 2,
                    column: 6
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
                        name: "b",
                        start: {
                          line: 4,
                          column: 3
                        },
                        end: {
                          line: 4,
                          column: 4
                        }
                      },
                      start: {
                        line: 4,
                        column: 3
                      },
                      end: {
                        line: 4,
                        column: 4
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
                        name: "b",
                        start: {
                          line: 4,
                          column: 8
                        },
                        end: {
                          line: 4,
                          column: 9
                        }
                      },
                      start: {
                        line: 4,
                        column: 7
                      },
                      end: {
                        line: 4,
                        column: 9
                      }
                    }
                  ],
                  start: {
                    line: 4,
                    column: 3
                  },
                  end: {
                    line: 4,
                    column: 9
                  }
                }
              ],
              start: {
                line: 1,
                column: 1
              },
              end: {
                line: 5,
                column: 2
              }
            }
          ],
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 5,
            column: 2
          }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "IfStatement-2.dy"), expected);
    });

    test("For statement - 1", () => {

        const expected = {
          kind: "Program",
          body: [
            {
              kind: "ForStatement",
              iterator: {
                kind: "Identifier",
                name: "i",
                start: {
                  line: 1,
                  column: 6
                },
                end: {
                  line: 1,
                  column: 7
                }
              },
              limit: {
                kind: "MemberAttribute",
                member: {
                  kind: "Identifier",
                  name: "x",
                  start: {
                    line: 1,
                    column: 9
                  },
                  end: {
                    line: 1,
                    column: 10
                  }
                },
                attribute: {
                  kind: "Identifier",
                  name: "length",
                  start: {
                    line: 1,
                    column: 11
                  },
                  end: {
                    line: 1,
                    column: 17
                  }
                },
                start: {
                  line: 1,
                  column: 9
                },
                end: {
                  line: 1,
                  column: 17
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
                        name: "x",
                        start: {
                          line: 2,
                          column: 9
                        },
                        end: {
                          line: 2,
                          column: 10
                        }
                      },
                      indexes: [
                        {
                          kind: "Identifier",
                          name: "i",
                          start: {
                            line: 2,
                            column: 11
                          },
                          end: {
                            line: 2,
                            column: 12
                          }
                        }
                      ],
                      start: {
                        line: 2,
                        column: 9
                      },
                      end: {
                        line: 2,
                        column: 13
                      }
                    }
                  ],
                  start: {
                    line: 2,
                    column: 3
                  },
                  end: {
                    line: 2,
                    column: 14
                  }
                }
              ],
              start: {
                line: 1,
                column: 1
              },
              end: {
                line: 3,
                column: 2
              }
            }
          ],
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 3,
            column: 2
          }
        } as Program;

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ForStatement-1.dy"), expected);
    });

    test("For statement - 2", () => {

    const expected = {
      kind: "Program",
      body: [
        {
          kind: "ForStatement",
          iterator: {
            kind: "Identifier",
            name: "i",
            start: {
              line: 1,
              column: 6
            },
            end: {
              line: 1,
              column: 7
            }
          },
          limit: {
            kind: "Identifier",
            name: "x",
            start: {
              line: 1,
              column: 9
            },
            end: {
              line: 1,
              column: 10
            }
          },
          body: [
            {
              kind: "PrintStatement",
              arguments: [
                {
                  kind: "Identifier",
                  name: "i",
                  start: {
                    line: 2,
                    column: 9
                  },
                  end: {
                    line: 2,
                    column: 10
                  }
                }
              ],
              start: {
                line: 2,
                column: 3
              },
              end: {
                line: 2,
                column: 11
              }
            }
          ],
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 3,
            column: 2
          }
        }
      ],
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 3,
        column: 2
      }
    } as Program;

    parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ForStatement-2.dy"), expected);
  });

    test("While statement - 1", () => {

    const expected = {
      kind: "Program",
      body: [
        {
          kind: "WhileStatement",
          condition: {
            kind: "Identifier",
            name: "a",
            start: {
              line: 1,
              column: 8
            },
            end: {
              line: 1,
              column: 9
            }
          },
          body: [
            {
              kind: "FunctionCall",
              identifier: {
                kind: "Identifier",
                name: "b",
                start: {
                  line: 2,
                  column: 3
                },
                end: {
                  line: 2,
                  column: 4
                }
              },
              arguments: [],
              start: {
                line: 2,
                column: 3
              },
              end: {
                line: 2,
                column: 6
              }
            }
          ],
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 3,
            column: 2
          }
        }
      ],
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 3,
        column: 2
      }
    } as Program;

    parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "WhileStatement-1.dy"), expected);
  });

    test("Switch statement - 1", () => {

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
                name: "foo",
                start: {
                  line: 1,
                  column: 9
                },
                end: {
                  line: 1,
                  column: 12
                }
              },
              arguments: [],
              start: {
                line: 1,
                column: 9
              },
              end: {
                line: 1,
                column: 14
              }
            },
            operator: 1,
            right: {
              kind: "Number",
              value: 1,
              start: {
                line: 1,
                column: 17
              },
              end: {
                line: 1,
                column: 18
              }
            },
            start: {
              line: 1,
              column: 9
            },
            end: {
              line: 1,
              column: 18
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
                    value: 1,
                    start: {
                      line: 2,
                      column: 8
                    },
                    end: {
                      line: 2,
                      column: 9
                    }
                  },
                  operator: 1,
                  right: {
                    kind: "Number",
                    value: 1,
                    start: {
                      line: 2,
                      column: 12
                    },
                    end: {
                      line: 2,
                      column: 13
                    }
                  },
                  start: {
                    line: 2,
                    column: 8
                  },
                  end: {
                    line: 2,
                    column: 13
                  }
                }
              ],
              body: [
                {
                  kind: "PrintStatement",
                  arguments: [
                    {
                      kind: "String",
                      value: "1",
                      start: {
                        line: 3,
                        column: 11
                      },
                      end: {
                        line: 3,
                        column: 14
                      }
                    }
                  ],
                  start: {
                    line: 3,
                    column: 5
                  },
                  end: {
                    line: 3,
                    column: 15
                  }
                }
              ],
              start: {
                line: 2,
                column: 3
              },
              end: {
                line: 4,
                column: 4
              }
            },
            {
              kind: "CaseStatement",
              values: [
                {
                  kind: "FunctionCall",
                  identifier: {
                    kind: "Identifier",
                    name: "a",
                    start: {
                      line: 5,
                      column: 8
                    },
                    end: {
                      line: 5,
                      column: 9
                    }
                  },
                  arguments: [],
                  start: {
                    line: 5,
                    column: 8
                  },
                  end: {
                    line: 5,
                    column: 11
                  }
                }
              ],
              body: [
                {
                  kind: "PrintStatement",
                  arguments: [
                    {
                      kind: "String",
                      value: "a",
                      start: {
                        line: 6,
                        column: 11
                      },
                      end: {
                        line: 6,
                        column: 14
                      }
                    }
                  ],
                  start: {
                    line: 6,
                    column: 5
                  },
                  end: {
                    line: 6,
                    column: 15
                  }
                }
              ],
              start: {
                line: 5,
                column: 3
              },
              end: {
                line: 7,
                column: 4
              }
            },
            {
              kind: "CaseStatement",
              values: [
                {
                  kind: "ArrayElement",
                  array: {
                    kind: "Identifier",
                    name: "b",
                    start: {
                      line: 8,
                      column: 8
                    },
                    end: {
                      line: 8,
                      column: 9
                    }
                  },
                  indexes: [
                    {
                      kind: "Number",
                      value: 0,
                      start: {
                        line: 8,
                        column: 10
                      },
                      end: {
                        line: 8,
                        column: 11
                      }
                    }
                  ],
                  start: {
                    line: 8,
                    column: 8
                  },
                  end: {
                    line: 8,
                    column: 12
                  }
                }
              ],
              body: [
                {
                  kind: "PrintStatement",
                  arguments: [
                    {
                      kind: "String",
                      value: "b",
                      start: {
                        line: 9,
                        column: 11
                      },
                      end: {
                        line: 9,
                        column: 14
                      }
                    }
                  ],
                  start: {
                    line: 9,
                    column: 5
                  },
                  end: {
                    line: 9,
                    column: 15
                  }
                }
              ],
              start: {
                line: 8,
                column: 3
              },
              end: {
                line: 10,
                column: 4
              }
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
                    name: "x",
                    start: {
                      line: 12,
                      column: 9
                    },
                    end: {
                      line: 12,
                      column: 10
                    }
                  },
                  start: {
                    line: 12,
                    column: 3
                  },
                  end: {
                    line: 12,
                    column: 10
                  }
                }
              ],
              operator: 21,
              values: [
                {
                  kind: "Number",
                  value: 4,
                  start: {
                    line: 12,
                    column: 13
                  },
                  end: {
                    line: 12,
                    column: 14
                  }
                }
              ],
              start: {
                line: 12,
                column: 3
              },
              end: {
                line: 12,
                column: 14
              }
            },
            {
              kind: "PrintStatement",
              arguments: [
                {
                  kind: "Identifier",
                  name: "x",
                  start: {
                    line: 13,
                    column: 9
                  },
                  end: {
                    line: 13,
                    column: 10
                  }
                }
              ],
              start: {
                line: 13,
                column: 3
              },
              end: {
                line: 13,
                column: 11
              }
            }
          ],
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 14,
            column: 2
          }
        }
      ],
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 14,
        column: 2
      }
    } as Program;

    parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "SwitchStatement-1.dy"), expected);
  });

    test("Complex flow control statement", () => {

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
                        name: "a",
                        start: {
                          line: 1,
                          column: 9
                        },
                        end: {
                          line: 1,
                          column: 10
                        }
                      },
                      arguments: [],
                      start: {
                        line: 1,
                        column: 9
                      },
                      end: {
                        line: 1,
                        column: 12
                      }
                    },
                    attribute: {
                      kind: "Identifier",
                      name: "b",
                      start: {
                        line: 1,
                        column: 13
                      },
                      end: {
                        line: 1,
                        column: 14
                      }
                    },
                    start: {
                      line: 1,
                      column: 9
                    },
                    end: {
                      line: 1,
                      column: 14
                    }
                  },
                  function: {
                    kind: "FunctionCall",
                    identifier: {
                      kind: "Identifier",
                      name: "length",
                      start: {
                        line: 1,
                        column: 15
                      },
                      end: {
                        line: 1,
                        column: 21
                      }
                    },
                    arguments: [],
                    start: {
                      line: 1,
                      column: 15
                    },
                    end: {
                      line: 1,
                      column: 23
                    }
                  },
                  start: {
                    line: 1,
                    column: 9
                  },
                  end: {
                    line: 1,
                    column: 23
                  }
                },
                start: {
                  line: 1,
                  column: 8
                },
                end: {
                  line: 1,
                  column: 23
                }
              },
              operator: 15,
              right: {
                kind: "Number",
                value: 1,
                start: {
                  line: 1,
                  column: 27
                },
                end: {
                  line: 1,
                  column: 28
                }
              },
              start: {
                line: 1,
                column: 8
              },
              end: {
                line: 1,
                column: 28
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
                          name: "a",
                          start: {
                            line: 2,
                            column: 7
                          },
                          end: {
                            line: 2,
                            column: 8
                          }
                        },
                        arguments: [],
                        start: {
                          line: 2,
                          column: 7
                        },
                        end: {
                          line: 2,
                          column: 10
                        }
                      },
                      attribute: {
                        kind: "Identifier",
                        name: "b",
                        start: {
                          line: 2,
                          column: 11
                        },
                        end: {
                          line: 2,
                          column: 12
                        }
                      },
                      start: {
                        line: 2,
                        column: 7
                      },
                      end: {
                        line: 2,
                        column: 12
                      }
                    },
                    indexes: [
                      {
                        kind: "Number",
                        value: 0,
                        start: {
                          line: 2,
                          column: 13
                        },
                        end: {
                          line: 2,
                          column: 14
                        }
                      }
                    ],
                    start: {
                      line: 2,
                      column: 7
                    },
                    end: {
                      line: 2,
                      column: 15
                    }
                  },
                  operator: 15,
                  right: {
                    kind: "Number",
                    value: 1,
                    start: {
                      line: 2,
                      column: 19
                    },
                    end: {
                      line: 2,
                      column: 20
                    }
                  },
                  start: {
                    line: 2,
                    column: 7
                  },
                  end: {
                    line: 2,
                    column: 20
                  }
                },
                body: [
                  {
                    kind: "ForStatement",
                    iterator: {
                      kind: "Identifier",
                      name: "i",
                      start: {
                        line: 3,
                        column: 10
                      },
                      end: {
                        line: 3,
                        column: 11
                      }
                    },
                    limit: {
                      kind: "BinaryExpression",
                      left: {
                        kind: "Number",
                        value: 5,
                        start: {
                          line: 3,
                          column: 13
                        },
                        end: {
                          line: 3,
                          column: 14
                        }
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
                              name: "a",
                              start: {
                                line: 3,
                                column: 17
                              },
                              end: {
                                line: 3,
                                column: 18
                              }
                            },
                            arguments: [],
                            start: {
                              line: 3,
                              column: 17
                            },
                            end: {
                              line: 3,
                              column: 20
                            }
                          },
                          attribute: {
                            kind: "Identifier",
                            name: "b",
                            start: {
                              line: 3,
                              column: 21
                            },
                            end: {
                              line: 3,
                              column: 22
                            }
                          },
                          start: {
                            line: 3,
                            column: 17
                          },
                          end: {
                            line: 3,
                            column: 22
                          }
                        },
                        function: {
                          kind: "FunctionCall",
                          identifier: {
                            kind: "Identifier",
                            name: "length",
                            start: {
                              line: 3,
                              column: 23
                            },
                            end: {
                              line: 3,
                              column: 29
                            }
                          },
                          arguments: [],
                          start: {
                            line: 3,
                            column: 23
                          },
                          end: {
                            line: 3,
                            column: 31
                          }
                        },
                        start: {
                          line: 3,
                          column: 17
                        },
                        end: {
                          line: 3,
                          column: 31
                        }
                      },
                      start: {
                        line: 3,
                        column: 13
                      },
                      end: {
                        line: 3,
                        column: 31
                      }
                    },
                    body: [
                      {
                        kind: "PrintStatement",
                        arguments: [
                          {
                            kind: "Identifier",
                            name: "i",
                            start: {
                              line: 4,
                              column: 13
                            },
                            end: {
                              line: 4,
                              column: 14
                            }
                          }
                        ],
                        start: {
                          line: 4,
                          column: 7
                        },
                        end: {
                          line: 4,
                          column: 15
                        }
                      }
                    ],
                    start: {
                      line: 3,
                      column: 5
                    },
                    end: {
                      line: 5,
                      column: 6
                    }
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
                          name: "x",
                          start: {
                            line: 7,
                            column: 13
                          },
                          end: {
                            line: 7,
                            column: 14
                          }
                        },
                        operator: 5,
                        right: {
                          kind: "Number",
                          value: 2,
                          start: {
                            line: 7,
                            column: 17
                          },
                          end: {
                            line: 7,
                            column: 18
                          }
                        },
                        start: {
                          line: 7,
                          column: 13
                        },
                        end: {
                          line: 7,
                          column: 18
                        }
                      },
                      operator: 15,
                      right: {
                        kind: "Number",
                        value: 0,
                        start: {
                          line: 7,
                          column: 22
                        },
                        end: {
                          line: 7,
                          column: 23
                        }
                      },
                      start: {
                        line: 7,
                        column: 13
                      },
                      end: {
                        line: 7,
                        column: 23
                      }
                    },
                    cases: [],
                    default: [
                      {
                        kind: "ForStatement",
                        iterator: {
                          kind: "Identifier",
                          name: "i",
                          start: {
                            line: 8,
                            column: 12
                          },
                          end: {
                            line: 8,
                            column: 13
                          }
                        },
                        limit: {
                          kind: "MemberAttribute",
                          member: {
                            kind: "FunctionCall",
                            identifier: {
                              kind: "Identifier",
                              name: "a",
                              start: {
                                line: 8,
                                column: 15
                              },
                              end: {
                                line: 8,
                                column: 16
                              }
                            },
                            arguments: [],
                            start: {
                              line: 8,
                              column: 15
                            },
                            end: {
                              line: 8,
                              column: 18
                            }
                          },
                          attribute: {
                            kind: "Identifier",
                            name: "b",
                            start: {
                              line: 8,
                              column: 19
                            },
                            end: {
                              line: 8,
                              column: 20
                            }
                          },
                          start: {
                            line: 8,
                            column: 15
                          },
                          end: {
                            line: 8,
                            column: 20
                          }
                        },
                        body: [
                          {
                            kind: "PrintStatement",
                            arguments: [
                              {
                                kind: "Identifier",
                                name: "i",
                                start: {
                                  line: 9,
                                  column: 15
                                },
                                end: {
                                  line: 9,
                                  column: 16
                                }
                              }
                            ],
                            start: {
                              line: 9,
                              column: 9
                            },
                            end: {
                              line: 9,
                              column: 17
                            }
                          }
                        ],
                        start: {
                          line: 8,
                          column: 7
                        },
                        end: {
                          line: 10,
                          column: 8
                        }
                      }
                    ],
                    start: {
                      line: 7,
                      column: 5
                    },
                    end: {
                      line: 11,
                      column: 6
                    }
                  }
                ],
                start: {
                  line: 2,
                  column: 3
                },
                end: {
                  line: 12,
                  column: 4
                }
              }
            ],
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 13,
              column: 2
            }
          }
        ],
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 13,
          column: 2
        }
      } as Program;

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ComplexFlowControlStatement.dy"), expected);
    });
});
