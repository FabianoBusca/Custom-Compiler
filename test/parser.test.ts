import {Lexer} from "../src/Lexer";
import {Parser} from "../src/Simple";

test('Class declaration', () => {
    const source = `
                           class Dog = {
                               str name
                               num age
                               Dog = _(str name, num age) {
                                   this.name = name
                                   this.age = age
                               }
                               _ = bark() {
                                   print('Woof')
                               }
                           }
                          `
    const expected = `{
            "kind": "Program",
            "body": [
                {
                    "kind": "ClassDeclaration",
                    "identifier": {
                        "kind": "Identifier",
                        "name": "Dog"
                    },
                    "body": [
                        {
                            "kind": "VariableOperations",
                            "operations": [
                                {
                                    "kind": "VariableDeclaration",
                                    "type": "str",
                                    "identifier": {
                                        "kind": "Identifier",
                                        "name": "name"
                                    }
                                }
                            ],
                            "operator": null,
                            "values": []
                        },
                        {
                            "kind": "VariableOperations",
                            "operations": [
                                {
                                    "kind": "VariableDeclaration",
                                    "type": "num",
                                    "identifier": {
                                        "kind": "Identifier",
                                        "name": "age"
                                    }
                                }
                            ],
                            "operator": null,
                            "values": []
                        },
                        {
                            "kind": "FunctionDeclaration",
                            "returnTypes": [
                                "Dog"
                            ],
                            "identifier": {
                                "kind": "Identifier",
                                "name": "_"
                            },
                            "parameters": [
                                {
                                    "kind": "VariableDeclaration",
                                    "type": "str",
                                    "identifier": {
                                        "kind": "Identifier",
                                        "name": "name"
                                    }
                                },
                                {
                                    "kind": "VariableDeclaration",
                                    "type": "num",
                                    "identifier": {
                                        "kind": "Identifier",
                                        "name": "age"
                                    }
                                }
                            ],
                            "body": [
                                {
                                    "kind": "VariableOperations",
                                    "operations": [
                                        {
                                            "kind": "VariableAssignment",
                                            "element": {
                                                "kind": "MemberAttribute",
                                                "object": {
                                                    "kind": "Identifier",
                                                    "name": "this"
                                                },
                                                "attribute": {
                                                    "kind": "Identifier",
                                                    "name": "name"
                                                }
                                            }
                                        }
                                    ],
                                    "operator": "=",
                                    "values": [
                                        {
                                            "kind": "Identifier",
                                            "name": "name"
                                        }
                                    ]
                                },
                                {
                                    "kind": "VariableOperations",
                                    "operations": [
                                        {
                                            "kind": "VariableAssignment",
                                            "element": {
                                                "kind": "MemberAttribute",
                                                "object": {
                                                    "kind": "Identifier",
                                                    "name": "this"
                                                },
                                                "attribute": {
                                                    "kind": "Identifier",
                                                    "name": "age"
                                                }
                                            }
                                        }
                                    ],
                                    "operator": "=",
                                    "values": [
                                        {
                                            "kind": "Identifier",
                                            "name": "age"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "kind": "FunctionDeclaration",
                            "returnTypes": [
                                "_"
                            ],
                            "identifier": {
                                "kind": "Identifier",
                                "name": "bark"
                            },
                            "parameters": [],
                            "body": [
                                {
                                    "kind": "FunctionCall",
                                    "identifier": {
                                        "kind": "Identifier",
                                        "name": "print"
                                    },
                                    "arguments": [
                                        {
                                            "kind": "F-String",
                                            "value": [
                                                {
                                                    "kind": "String",
                                                    "value": "Woof"
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
        }`
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens, source.split('\n'));
    const ast = parser.parse();
    console.log(JSON.stringify(ast, null, 2));
    //expect(ast.toString()).toEqual(expected);
});