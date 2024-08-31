import { parserTest } from "../../utils/utils";
import {Program} from "../../../src/data";
import {getTestFilePath, SOURCE_FOLDER} from "../../utils/constat";

const SUIT_FOLDER = "functions";

describe("Function calls and declarations", () => {

    test("Function declaration - 1", () => {

        const expected = {
            kind: "Program",
            body: [
                {
                    kind: "FunctionDeclaration",
                    returnTypes: [
                        "a"
                    ],
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
                    parameters: [],
                    body: [],
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

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "FunctionDeclaration-1.dy"), expected);
    });

    test("Function declaration - 2", () => {

        const expected = {
            kind: "Program",
            body: [
                {
                    kind: "FunctionDeclaration",
                    returnTypes: [
                        "a"
                    ],
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
                    parameters: [
                        {
                            kind: "VariableDeclaration",
                            type: "num",
                            identifier: {
                                kind: "Identifier",
                                name: "a",
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
                        }
                    ],
                    body: [],
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 18
                    }
                }
            ],
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 18
            }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "FunctionDeclaration-2.dy"), expected);
    });

    test("Function declaration - 3", () => {

        const expected = {
            kind: "Program",
            body: [
                {
                    kind: "FunctionDeclaration",
                    returnTypes: [
                        "a"
                    ],
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
                    parameters: [
                        {
                            kind: "VariableDeclaration",
                            type: "b[]",
                            identifier: {
                                kind: "Identifier",
                                name: "c",
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
                        }
                    ],
                    body: [],
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 18
                    }
                }
            ],
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 18
            }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "FunctionDeclaration-3.dy"), expected);
    })

    test("Function call assignment - 1", () => {

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
                        }
                    ],
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
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 10
            }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "FunctionCallAssignment-1.dy"), expected);
    })

    test("Function call assignment - 2", () => {

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
                                                        column: 9
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 10
                                                    }
                                                },
                                                function: {
                                                    kind: "FunctionCall",
                                                    identifier: {
                                                        kind: "Identifier",
                                                        name: "j",
                                                        start: {
                                                            line: 1,
                                                            column: 11
                                                        },
                                                        end: {
                                                            line: 1,
                                                            column: 12
                                                        }
                                                    },
                                                    arguments: [],
                                                    start: {
                                                        line: 1,
                                                        column: 11
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
                                            attribute: {
                                                kind: "Identifier",
                                                name: "l",
                                                start: {
                                                    line: 1,
                                                    column: 15
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 16
                                                }
                                            },
                                            start: {
                                                line: 1,
                                                column: 9
                                            },
                                            end: {
                                                line: 1,
                                                column: 16
                                            }
                                        },
                                        indexes: [
                                            {
                                                kind: "Number",
                                                value: 0,
                                                start: {
                                                    line: 1,
                                                    column: 17
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 18
                                                }
                                            }
                                        ],
                                        start: {
                                            line: 1,
                                            column: 9
                                        },
                                        end: {
                                            line: 1,
                                            column: 19
                                        }
                                    }
                                ],
                                start: {
                                    line: 1,
                                    column: 5
                                },
                                end: {
                                    line: 1,
                                    column: 20
                                }
                            },
                            indexes: [
                                {
                                    kind: "Number",
                                    value: 0,
                                    start: {
                                        line: 1,
                                        column: 21
                                    },
                                    end: {
                                        line: 1,
                                        column: 22
                                    }
                                }
                            ],
                            start: {
                                line: 1,
                                column: 5
                            },
                            end: {
                                line: 1,
                                column: 23
                            }
                        }
                    ],
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 23
                    }
                }
            ],
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 23
            }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "FunctionCallAssignment-2.dy"), expected);
    })

    test("Function call assignment - 3", () => {

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
                        },
                        {
                            kind: "VariableAssignment",
                            element: {
                                kind: "Identifier",
                                name: "b",
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
                            kind: "VariableDeclaration",
                            type: "str",
                            identifier: {
                                kind: "Identifier",
                                name: "d",
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
                                column: 7
                            },
                            end: {
                                line: 1,
                                column: 12
                            }
                        }
                    ],
                    operator: 21,
                    values: [
                        {
                            kind: "BinaryExpression",
                            left: {
                                kind: "MemberFunctionCall",
                                member: {
                                    kind: "FunctionCall",
                                    identifier: {
                                        kind: "Identifier",
                                        name: "foo",
                                        start: {
                                            line: 1,
                                            column: 15
                                        },
                                        end: {
                                            line: 1,
                                            column: 18
                                        }
                                    },
                                    arguments: [],
                                    start: {
                                        line: 1,
                                        column: 15
                                    },
                                    end: {
                                        line: 1,
                                        column: 20
                                    }
                                },
                                function: {
                                    kind: "FunctionCall",
                                    identifier: {
                                        kind: "Identifier",
                                        name: "k",
                                        start: {
                                            line: 1,
                                            column: 21
                                        },
                                        end: {
                                            line: 1,
                                            column: 22
                                        }
                                    },
                                    arguments: [
                                        {
                                            kind: "BinaryExpression",
                                            left: {
                                                kind: "Number",
                                                value: 7,
                                                start: {
                                                    line: 1,
                                                    column: 23
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 24
                                                }
                                            },
                                            operator: 6,
                                            right: {
                                                kind: "Number",
                                                value: 2,
                                                start: {
                                                    line: 1,
                                                    column: 28
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 29
                                                }
                                            },
                                            start: {
                                                line: 1,
                                                column: 23
                                            },
                                            end: {
                                                line: 1,
                                                column: 29
                                            }
                                        }
                                    ],
                                    start: {
                                        line: 1,
                                        column: 21
                                    },
                                    end: {
                                        line: 1,
                                        column: 30
                                    }
                                },
                                start: {
                                    line: 1,
                                    column: 15
                                },
                                end: {
                                    line: 1,
                                    column: 30
                                }
                            },
                            operator: 1,
                            right: {
                                kind: "Number",
                                value: 1,
                                start: {
                                    line: 1,
                                    column: 33
                                },
                                end: {
                                    line: 1,
                                    column: 34
                                }
                            },
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 34
                            }
                        },
                        {
                            kind: "Number",
                            value: 5,
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
                            kind: "F-String",
                            value: [
                                {
                                    kind: "String",
                                    value: "Hello",
                                    start: {
                                        line: 1,
                                        column: 40
                                    },
                                    end: {
                                        line: 1,
                                        column: 45
                                    }
                                }
                            ],
                            start: {
                                line: 1,
                                column: 39
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

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "FunctionCallAssignment-3.dy"), expected);
    })
});

describe("Underscore functions", () => {

    test("Constructor declaration - 1", () => {

        const expected = {
            kind: "Program",
            body: [
                {
                    kind: "FunctionDeclaration",
                    returnTypes: [
                        "a"
                    ],
                    identifier: {
                        kind: "Identifier",
                        name: "_",
                        start: {
                            line: 1,
                            column: 5
                        },
                        end: {
                            line: 1,
                            column: 6
                        }
                    },
                    parameters: [],
                    body: [],
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            ],
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 11
            }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ConstructorDeclaration-1.dy"), expected);
    })

    test("Constructor declaration - 2", () => {

        const expected = {
            kind: "Program",
            body: [
                {
                    kind: "FunctionDeclaration",
                    returnTypes: [
                        "a"
                    ],
                    identifier: {
                        kind: "Identifier",
                        name: "_",
                        start: {
                            line: 1,
                            column: 5
                        },
                        end: {
                            line: 1,
                            column: 6
                        }
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
                                    column: 11
                                },
                                end: {
                                    line: 1,
                                    column: 12
                                }
                            },
                            start: {
                                line: 1,
                                column: 7
                            },
                            end: {
                                line: 1,
                                column: 12
                            }
                        }
                    ],
                    body: [],
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 16
                    }
                }
            ],
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 16
            }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ConstructorDeclaration-2.dy"), expected);
    })

    test("Constructor declaration - 3", () => {

        const expected = {
            kind: "Program",
            body: [
                {
                    kind: "FunctionDeclaration",
                    returnTypes: [
                        "a"
                    ],
                    identifier: {
                        kind: "Identifier",
                        name: "_",
                        start: {
                            line: 1,
                            column: 5
                        },
                        end: {
                            line: 1,
                            column: 6
                        }
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
                                    column: 11
                                },
                                end: {
                                    line: 1,
                                    column: 12
                                }
                            },
                            start: {
                                line: 1,
                                column: 7
                            },
                            end: {
                                line: 1,
                                column: 12
                            }
                        }
                    ],
                    body: [],
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 16
                    }
                }
            ],
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 16
            }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ConstructorDeclaration-3.dy"), expected);
    })

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
                            kind: "FunctionCall",
                            identifier: {
                                kind: "Identifier",
                                name: "_",
                                start: {
                                    line: 1,
                                    column: 5
                                },
                                end: {
                                    line: 1,
                                    column: 6
                                }
                            },
                            arguments: [],
                            start: {
                                line: 1,
                                column: 5
                            },
                            end: {
                                line: 1,
                                column: 8
                            }
                        }
                    ],
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 8
                    }
                }
            ],
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 8
            }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ConstructorCall-1.dy"), expected);
    })

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
                                    column: 3
                                },
                                end: {
                                    line: 1,
                                    column: 4
                                }
                            },
                            start: {
                                line: 1,
                                column: 1
                            },
                            end: {
                                line: 1,
                                column: 4
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
                                    column: 7
                                },
                                end: {
                                    line: 1,
                                    column: 8
                                }
                            },
                            arguments: [],
                            start: {
                                line: 1,
                                column: 7
                            },
                            end: {
                                line: 1,
                                column: 10
                            }
                        }
                    ],
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
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 10
            }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ConstructorCall-2.dy"), expected);
    })

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
                                            column: 5
                                        },
                                        end: {
                                            line: 1,
                                            column: 6
                                        }
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
                                                            column: 7
                                                        },
                                                        end: {
                                                            line: 1,
                                                            column: 8
                                                        }
                                                    },
                                                    function: {
                                                        kind: "FunctionCall",
                                                        identifier: {
                                                            kind: "Identifier",
                                                            name: "j",
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
                                                    start: {
                                                        line: 1,
                                                        column: 7
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 12
                                                    }
                                                },
                                                attribute: {
                                                    kind: "Identifier",
                                                    name: "l",
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
                                                    column: 7
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 14
                                                }
                                            },
                                            indexes: [
                                                {
                                                    kind: "Number",
                                                    value: 0,
                                                    start: {
                                                        line: 1,
                                                        column: 15
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 16
                                                    }
                                                }
                                            ],
                                            start: {
                                                line: 1,
                                                column: 7
                                            },
                                            end: {
                                                line: 1,
                                                column: 17
                                            }
                                        }
                                    ],
                                    start: {
                                        line: 1,
                                        column: 5
                                    },
                                    end: {
                                        line: 1,
                                        column: 18
                                    }
                                },
                                indexes: [
                                    {
                                        kind: "Number",
                                        value: 0,
                                        start: {
                                            line: 1,
                                            column: 19
                                        },
                                        end: {
                                            line: 1,
                                            column: 20
                                        }
                                    }
                                ],
                                start: {
                                    line: 1,
                                    column: 5
                                },
                                end: {
                                    line: 1,
                                    column: 21
                                }
                            },
                            attribute: {
                                kind: "Identifier",
                                name: "d",
                                start: {
                                    line: 1,
                                    column: 22
                                },
                                end: {
                                    line: 1,
                                    column: 23
                                }
                            },
                            start: {
                                line: 1,
                                column: 5
                            },
                            end: {
                                line: 1,
                                column: 23
                            }
                        }
                    ],
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 23
                    }
                }
            ],
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 23
            }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ConstructorCall-3.dy"), expected);
    })

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
                                kind: "FunctionCall",
                                identifier: {
                                    kind: "Identifier",
                                    name: "_",
                                    start: {
                                        line: 1,
                                        column: 5
                                    },
                                    end: {
                                        line: 1,
                                        column: 6
                                    }
                                },
                                arguments: [],
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
                                kind: "Number",
                                value: 1,
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
                                column: 5
                            },
                            end: {
                                line: 1,
                                column: 12
                            }
                        }
                    ],
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 12
                    }
                }
            ],
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 12
            }
        } as Program;

        parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ConstructorCall-4.dy"), expected);
    })
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
                        kind: "VariableDeclaration",
                        type: "str",
                        identifier: {
                            kind: "Identifier",
                            name: "y",
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
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 9
                        }
                    },
                    {
                        kind: "VariableDeclaration",
                        type: "bool[]",
                        identifier: {
                            kind: "Identifier",
                            name: "w",
                            start: {
                                line: 1,
                                column: 18
                            },
                            end: {
                                line: 1,
                                column: 19
                            }
                        },
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 1,
                            column: 19
                        }
                    },
                    {
                        kind: "VariableAssignment",
                        element: {
                            kind: "Identifier",
                            name: "_",
                            start: {
                                line: 1,
                                column: 21
                            },
                            end: {
                                line: 1,
                                column: 22
                            }
                        },
                        start: {
                            line: 1,
                            column: 21
                        },
                        end: {
                            line: 1,
                            column: 22
                        }
                    },
                    {
                        kind: "VariableAssignment",
                        element: {
                            kind: "Identifier",
                            name: "_",
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
                            column: 24
                        },
                        end: {
                            line: 1,
                            column: 25
                        }
                    },
                    {
                        kind: "VariableDeclaration",
                        type: "dog[][][]",
                        identifier: {
                            kind: "Identifier",
                            name: "d",
                            start: {
                                line: 1,
                                column: 37
                            },
                            end: {
                                line: 1,
                                column: 38
                            }
                        },
                        start: {
                            line: 1,
                            column: 27
                        },
                        end: {
                            line: 1,
                            column: 38
                        }
                    }
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
                                column: 41
                            },
                            end: {
                                line: 1,
                                column: 47
                            }
                        },
                        arguments: [],
                        start: {
                            line: 1,
                            column: 41
                        },
                        end: {
                            line: 1,
                            column: 49
                        }
                    }
                ],
                start: {
                    line: 1,
                    column: 1
                },
                end: {
                    line: 1,
                    column: 49
                }
            }
        ],
        start: {
            line: 1,
            column: 1
        },
        end: {
            line: 1,
            column: 49
        }
    } as Program;

    parserTest(getTestFilePath(SUIT_FOLDER, SOURCE_FOLDER, "ComplexFunctionStatement.dy"), expected);
})