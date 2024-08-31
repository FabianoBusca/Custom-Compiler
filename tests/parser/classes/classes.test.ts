import {parserTest} from "../../utils/utils";
import {Program} from "../../../src/data";
import * as path from "path";
import {getTestFilePath, SOURCE_FOLDER} from "../../utils/constat";

const SUIT_FOLDER = 'classes';

describe("Class Declarations", () => {
    test("Class declaration - 1", async () => {

      const expected = {
        kind: "Program",
        body: [
          {
            kind: "ClassDeclaration",
            identifier: {
              kind: "Identifier",
              name: "Dog",
              start: {
                line: 1,
                column: 7
              },
              end: {
                line: 1,
                column: 10
              }
            },
            body: [
              {
                kind: "VariableOperations",
                operations: [
                  {
                    kind: "VariableDeclaration",
                    type: "str",
                    identifier: {
                      kind: "Identifier",
                      name: "name",
                      start: {
                        line: 2,
                        column: 7
                      },
                      end: {
                        line: 2,
                        column: 11
                      }
                    },
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
                operator: null,
                values: [],
                start: {
                  line: 2,
                  column: 3
                },
                end: {
                  line: 2,
                  column: 11
                }
              },
              {
                kind: "VariableOperations",
                operations: [
                  {
                    kind: "VariableDeclaration",
                    type: "num",
                    identifier: {
                      kind: "Identifier",
                      name: "age",
                      start: {
                        line: 3,
                        column: 7
                      },
                      end: {
                        line: 3,
                        column: 10
                      }
                    },
                    start: {
                      line: 3,
                      column: 3
                    },
                    end: {
                      line: 3,
                      column: 10
                    }
                  }
                ],
                operator: null,
                values: [],
                start: {
                  line: 3,
                  column: 3
                },
                end: {
                  line: 3,
                  column: 10
                }
              },
              {
                kind: "FunctionDeclaration",
                returnTypes: [
                  "Dog"
                ],
                identifier: {
                  kind: "Identifier",
                  name: "_",
                  start: {
                    line: 4,
                    column: 9
                  },
                  end: {
                    line: 4,
                    column: 10
                  }
                },
                parameters: [
                  {
                    kind: "VariableDeclaration",
                    type: "str",
                    identifier: {
                      kind: "Identifier",
                      name: "name",
                      start: {
                        line: 4,
                        column: 15
                      },
                      end: {
                        line: 4,
                        column: 19
                      }
                    },
                    start: {
                      line: 4,
                      column: 11
                    },
                    end: {
                      line: 4,
                      column: 19
                    }
                  },
                  {
                    kind: "VariableDeclaration",
                    type: "num",
                    identifier: {
                      kind: "Identifier",
                      name: "age",
                      start: {
                        line: 4,
                        column: 25
                      },
                      end: {
                        line: 4,
                        column: 28
                      }
                    },
                    start: {
                      line: 4,
                      column: 21
                    },
                    end: {
                      line: 4,
                      column: 28
                    }
                  }
                ],
                body: [
                  {
                    kind: "VariableOperations",
                    operations: [
                      {
                        kind: "VariableAssignment",
                        element: {
                          kind: "MemberAttribute",
                          member: {
                            kind: "Identifier",
                            name: "this",
                            start: {
                              line: 5,
                              column: 5
                            },
                            end: {
                              line: 5,
                              column: 9
                            }
                          },
                          attribute: {
                            kind: "Identifier",
                            name: "name",
                            start: {
                              line: 5,
                              column: 10
                            },
                            end: {
                              line: 5,
                              column: 14
                            }
                          },
                          start: {
                            line: 5,
                            column: 5
                          },
                          end: {
                            line: 5,
                            column: 14
                          }
                        },
                        start: {
                          line: 5,
                          column: 5
                        },
                        end: {
                          line: 5,
                          column: 14
                        }
                      }
                    ],
                    operator: 21,
                    values: [
                      {
                        kind: "Identifier",
                        name: "name",
                        start: {
                          line: 5,
                          column: 17
                        },
                        end: {
                          line: 5,
                          column: 21
                        }
                      }
                    ],
                    start: {
                      line: 5,
                      column: 5
                    },
                    end: {
                      line: 5,
                      column: 21
                    }
                  },
                  {
                    kind: "VariableOperations",
                    operations: [
                      {
                        kind: "VariableAssignment",
                        element: {
                          kind: "MemberAttribute",
                          member: {
                            kind: "Identifier",
                            name: "this",
                            start: {
                              line: 6,
                              column: 5
                            },
                            end: {
                              line: 6,
                              column: 9
                            }
                          },
                          attribute: {
                            kind: "Identifier",
                            name: "age",
                            start: {
                              line: 6,
                              column: 10
                            },
                            end: {
                              line: 6,
                              column: 13
                            }
                          },
                          start: {
                            line: 6,
                            column: 5
                          },
                          end: {
                            line: 6,
                            column: 13
                          }
                        },
                        start: {
                          line: 6,
                          column: 5
                        },
                        end: {
                          line: 6,
                          column: 13
                        }
                      }
                    ],
                    operator: 21,
                    values: [
                      {
                        kind: "Identifier",
                        name: "age",
                        start: {
                          line: 6,
                          column: 16
                        },
                        end: {
                          line: 6,
                          column: 19
                        }
                      }
                    ],
                    start: {
                      line: 6,
                      column: 5
                    },
                    end: {
                      line: 6,
                      column: 19
                    }
                  }
                ],
                start: {
                  line: 4,
                  column: 3
                },
                end: {
                  line: 7,
                  column: 4
                }
              },
              {
                kind: "FunctionDeclaration",
                returnTypes: [
                  "_"
                ],
                identifier: {
                  kind: "Identifier",
                  name: "bark",
                  start: {
                    line: 8,
                    column: 7
                  },
                  end: {
                    line: 8,
                    column: 11
                  }
                },
                parameters: [],
                body: [
                  {
                    kind: "PrintStatement",
                    arguments: [
                      {
                        kind: "F-String",
                        value: [
                          {
                            kind: "String",
                            value: "Woof",
                            start: {
                              line: 9,
                              column: 12
                            },
                            end: {
                              line: 9,
                              column: 16
                            }
                          }
                        ],
                        start: {
                          line: 9,
                          column: 11
                        },
                        end: {
                          line: 9,
                          column: 17
                        }
                      }
                    ],
                    start: {
                      line: 9,
                      column: 5
                    },
                    end: {
                      line: 9,
                      column: 18
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
              },
              {
                kind: "FunctionDeclaration",
                returnTypes: [
                  "_"
                ],
                identifier: {
                  kind: "Identifier",
                  name: "setOwner",
                  start: {
                    line: 11,
                    column: 7
                  },
                  end: {
                    line: 11,
                    column: 15
                  }
                },
                parameters: [
                  {
                    kind: "VariableDeclaration",
                    type: "owner",
                    identifier: {
                      kind: "Identifier",
                      name: "owner",
                      start: {
                        line: 11,
                        column: 22
                      },
                      end: {
                        line: 11,
                        column: 27
                      }
                    },
                    start: {
                      line: 11,
                      column: 16
                    },
                    end: {
                      line: 11,
                      column: 27
                    }
                  }
                ],
                body: [
                  {
                    kind: "MemberFunctionCall",
                    member: {
                      kind: "Identifier",
                      name: "owner",
                      start: {
                        line: 12,
                        column: 5
                      },
                      end: {
                        line: 12,
                        column: 10
                      }
                    },
                    function: {
                      kind: "FunctionCall",
                      identifier: {
                        kind: "Identifier",
                        name: "setDog",
                        start: {
                          line: 12,
                          column: 11
                        },
                        end: {
                          line: 12,
                          column: 17
                        }
                      },
                      arguments: [
                        {
                          kind: "Identifier",
                          name: "this",
                          start: {
                            line: 12,
                            column: 18
                          },
                          end: {
                            line: 12,
                            column: 22
                          }
                        }
                      ],
                      start: {
                        line: 12,
                        column: 11
                      },
                      end: {
                        line: 12,
                        column: 23
                      }
                    },
                    start: {
                      line: 12,
                      column: 5
                    },
                    end: {
                      line: 12,
                      column: 23
                    }
                  }
                ],
                start: {
                  line: 11,
                  column: 3
                },
                end: {
                  line: 13,
                  column: 4
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

      parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ClassDeclaration-1.dy"), expected);
    });
});
