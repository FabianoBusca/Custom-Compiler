import {Program} from "../../../src/data";
import {getTestFilePath, parserTest, SOURCE_FOLDER} from "../../utils";

const SUIT_FOLDER = "variables";

describe("Variables declarations and assignment", () => {

    test("Variable declaration - 1", () => {

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
                  name: "x",
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 6
                  }
                },
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 6
                }
              }
            ],
            operator: null,
            values: [],
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 6
            }
          }
        ],
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 6
        }
      } as Program;

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "VariableDeclaration-1.dy"), expected);
    });

    test("Variable declaration - 2", () => {

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
                  name: "x",
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 6
                  }
                },
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 6
                }
              },
              {
                kind: "VariableDeclaration",
                type: "str",
                identifier: {
                  kind: "Identifier",
                  name: "y",
                  start: {
                    line: 1,
                    column: 12
                  },
                  end: {
                    line: 1,
                    column: 13
                  }
                },
                start: {
                  line: 1,
                  column: 8
                },
                end: {
                  line: 1,
                  column: 13
                }
              },
              {
                kind: "VariableDeclaration",
                type: "bool",
                identifier: {
                  kind: "Identifier",
                  name: "z",
                  start: {
                    line: 1,
                    column: 20
                  },
                  end: {
                    line: 1,
                    column: 21
                  }
                },
                start: {
                  line: 1,
                  column: 15
                },
                end: {
                  line: 1,
                  column: 21
                }
              }
            ],
            operator: null,
            values: [],
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 6
            }
          }
        ],
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 21
        }
      } as Program;

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "VariableDeclaration-2.dy"), expected);
    });

    test("Variable declaration - 3", () => {

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
                  name: "d",
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 6
                  }
                },
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 6
                }
              }
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
                    column: 9
                  },
                  end: {
                    line: 1,
                    column: 10
                  }
                },
                arguments: [
                  {
                    kind: "F-String",
                    value: [
                      {
                        kind: "String",
                        value: "Buddy",
                        start: {
                          line: 1,
                          column: 12
                        },
                        end: {
                          line: 1,
                          column: 17
                        }
                      }
                    ],
                    start: {
                      line: 1,
                      column: 11
                    },
                    end: {
                      line: 1,
                      column: 18
                    }
                  },
                  {
                    kind: "Number",
                    value: 5,
                    start: {
                      line: 1,
                      column: 20
                    },
                    end: {
                      line: 1,
                      column: 21
                    }
                  }
                ],
                start: {
                  line: 1,
                  column: 9
                },
                end: {
                  line: 1,
                  column: 22
                }
              }
            ],
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 22
            }
          }
        ],
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 22
        }
      } as Program;

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "VariableDeclaration-3.dy"), expected);
    });

    test("Variable declaration - 4", () => {

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
                  name: "d",
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 6
                  }
                },
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 6
                }
              },
              {
                kind: "VariableAssignment",
                element: {
                  kind: "Identifier",
                  name: "x",
                  start: {
                    line: 1,
                    column: 8
                  },
                  end: {
                    line: 1,
                    column: 9
                  }
                },
                start: {
                  line: 1,
                  column: 8
                },
                end: {
                  line: 1,
                  column: 9
                }
              },
              {
                kind: "VariableAssignment",
                element: {
                  kind: "Identifier",
                  name: "_",
                  start: {
                    line: 1,
                    column: 11
                  },
                  end: {
                    line: 1,
                    column: 12
                  }
                },
                start: {
                  line: 1,
                  column: 11
                },
                end: {
                  line: 1,
                  column: 12
                }
              },
              {
                kind: "VariableDeclaration",
                type: "bool",
                identifier: {
                  kind: "Identifier",
                  name: "b",
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
                  column: 14
                },
                end: {
                  line: 1,
                  column: 20
                }
              }
            ],
            operator: 21,
            values: [
              {
                kind: "Number",
                value: 0,
                start: {
                  line: 1,
                  column: 23
                },
                end: {
                  line: 1,
                  column: 24
                }
              }
            ],
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 24
            }
          }
        ],
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 24
        }
      } as Program;

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "VariableDeclaration-4.dy"), expected);
    });

    test("Variable assignment - 1", () => {

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
                    column: 1
                  },
                  end: {
                    line: 1,
                    column: 2
                  }
                },
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 2
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
                    name: "foo",
                    start: {
                      line: 1,
                      column: 5
                    },
                    end: {
                      line: 1,
                      column: 8
                    }
                  },
                  arguments: [],
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 10
                  }
                },
                indexes: [
                  {
                    kind: "Number",
                    value: 0,
                    start: {
                      line: 1,
                      column: 11
                    },
                    end: {
                      line: 1,
                      column: 12
                    }
                  }
                ],
                start: {
                  line: 1,
                  column: 5
                },
                end: {
                  line: 1,
                  column: 13
                }
              }
            ],
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 13
            }
          }
        ],
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 13
        }
      } as Program;

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "VariableAssignment-1.dy"), expected);
    });

    test("Variable assignment - 2", () => {

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
                    column: 1
                  },
                  end: {
                    line: 1,
                    column: 2
                  }
                },
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 2
                }
              }
            ],
            operator: 21,
            values: [
              {
                kind: "BinaryExpression",
                left: {
                  kind: "String",
                  value: "a",
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 8
                  }
                },
                operator: 1,
                right: {
                  kind: "F-String",
                  value: [
                    {
                      kind: "String",
                      value: "f ",
                      start: {
                        line: 1,
                        column: 12
                      },
                      end: {
                        line: 1,
                        column: 14
                      }
                    },
                    {
                      kind: "MemberAttribute",
                      member: {
                        kind: "Identifier",
                        name: "x",
                        start: {
                          line: 1,
                          column: 15
                        },
                        end: {
                          line: 1,
                          column: 16
                        }
                      },
                      attribute: {
                        kind: "Identifier",
                        name: "y",
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
                        column: 15
                      },
                      end: {
                        line: 1,
                        column: 18
                      }
                    }
                  ],
                  start: {
                    line: 1,
                    column: 11
                  },
                  end: {
                    line: 1,
                    column: 20
                  }
                },
                start: {
                  line: 1,
                  column: 5
                },
                end: {
                  line: 1,
                  column: 20
                }
              }
            ],
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 20
            }
          }
        ],
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 20
        }
      } as Program;

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "VariableAssignment-2.dy"), expected);
    });

    test("Variable assignment - 3", () => {

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
                    column: 1
                  },
                  end: {
                    line: 1,
                    column: 2
                  }
                },
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 2
                }
              },
              {
                kind: "VariableAssignment",
                element: {
                  kind: "Identifier",
                  name: "y",
                  start: {
                    line: 1,
                    column: 4
                  },
                  end: {
                    line: 1,
                    column: 5
                  }
                },
                start: {
                  line: 1,
                  column: 4
                },
                end: {
                  line: 1,
                  column: 5
                }
              },
              {
                kind: "VariableAssignment",
                element: {
                  kind: "Identifier",
                  name: "z",
                  start: {
                    line: 1,
                    column: 7
                  },
                  end: {
                    line: 1,
                    column: 8
                  }
                },
                start: {
                  line: 1,
                  column: 7
                },
                end: {
                  line: 1,
                  column: 8
                }
              }
            ],
            operator: 21,
            values: [
              {
                kind: "Number",
                value: 5.23,
                start: {
                  line: 1,
                  column: 11
                },
                end: {
                  line: 1,
                  column: 15
                }
              },
              {
                kind: "F-String",
                value: [
                  {
                    kind: "String",
                    value: "Hello ",
                    start: {
                      line: 1,
                      column: 18
                    },
                    end: {
                      line: 1,
                      column: 24
                    }
                  },
                  {
                    kind: "Identifier",
                    name: "x",
                    start: {
                      line: 1,
                      column: 25
                    },
                    end: {
                      line: 1,
                      column: 26
                    }
                  }
                ],
                start: {
                  line: 1,
                  column: 17
                },
                end: {
                  line: 1,
                  column: 28
                }
              },
              {
                kind: "String",
                value: "World",
                start: {
                  line: 1,
                  column: 30
                },
                end: {
                  line: 1,
                  column: 37
                }
              }
            ],
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 37
            }
          }
        ],
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 37
        }
      } as Program;

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "VariableAssignment-3.dy"), expected);
    });

    test("Variable assignment - 4", () => {

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
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 10
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
                    elements: [],
                    start: {
                      line: 1,
                      column: 14
                    },
                    end: {
                      line: 1,
                      column: 16
                    }
                  },
                  {
                    kind: "Array",
                    elements: [
                      {
                        kind: "Number",
                        value: 1,
                        start: {
                          line: 1,
                          column: 19
                        },
                        end: {
                          line: 1,
                          column: 20
                        }
                      },
                      {
                        kind: "Number",
                        value: 2,
                        start: {
                          line: 1,
                          column: 22
                        },
                        end: {
                          line: 1,
                          column: 23
                        }
                      },
                      {
                        kind: "Number",
                        value: 3,
                        start: {
                          line: 1,
                          column: 25
                        },
                        end: {
                          line: 1,
                          column: 26
                        }
                      },
                      {
                        kind: "Number",
                        value: 4,
                        start: {
                          line: 1,
                          column: 28
                        },
                        end: {
                          line: 1,
                          column: 29
                        }
                      },
                      {
                        kind: "Number",
                        value: 5,
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
                      column: 18
                    },
                    end: {
                      line: 1,
                      column: 33
                    }
                  },
                  {
                    kind: "Array",
                    elements: [
                      {
                        kind: "Number",
                        value: 1,
                        start: {
                          line: 1,
                          column: 36
                        },
                        end: {
                          line: 1,
                          column: 37
                        }
                      },
                      {
                        kind: "Number",
                        value: 3,
                        start: {
                          line: 1,
                          column: 39
                        },
                        end: {
                          line: 1,
                          column: 40
                        }
                      }
                    ],
                    start: {
                      line: 1,
                      column: 35
                    },
                    end: {
                      line: 1,
                      column: 41
                    }
                  },
                  {
                    kind: "Array",
                    elements: [],
                    start: {
                      line: 1,
                      column: 43
                    },
                    end: {
                      line: 1,
                      column: 45
                    }
                  }
                ],
                start: {
                  line: 1,
                  column: 13
                },
                end: {
                  line: 1,
                  column: 46
                }
              }
            ],
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 46
            }
          }
        ],
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 46
        }
      } as Program;

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "VariableAssignment-4.dy"), expected);
    });
});