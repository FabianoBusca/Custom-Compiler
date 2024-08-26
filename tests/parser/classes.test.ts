import {parserTest} from "../utils/utils";
import {Program} from "../../src/data";

describe("Class Declarations", () => {
    test("Class declaration - 1", () => {
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
                _ = setOwner(owner owner) {
                    owner.setDog(this)
                }
            }`;

        const expected = {
                                  kind: "Program",
                                  body: [
                                    {
                                      kind: "ClassDeclaration",
                                      identifier: {
                                        kind: "Identifier",
                                        name: "Dog"
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
                                                name: "name"
                                              }
                                            }
                                          ],
                                          operator: null,
                                          values: []
                                        },
                                        {
                                          kind: "VariableOperations",
                                          operations: [
                                            {
                                              kind: "VariableDeclaration",
                                              type: "num",
                                              identifier: {
                                                kind: "Identifier",
                                                name: "age"
                                              }
                                            }
                                          ],
                                          operator: null,
                                          values: []
                                        },
                                        {
                                          kind: "FunctionDeclaration",
                                          returnTypes: [
                                            "Dog"
                                          ],
                                          identifier: {
                                            kind: "Identifier",
                                            name: "_"
                                          },
                                          parameters: [
                                            {
                                              kind: "VariableDeclaration",
                                              type: "str",
                                              identifier: {
                                                kind: "Identifier",
                                                name: "name"
                                              }
                                            },
                                            {
                                              kind: "VariableDeclaration",
                                              type: "num",
                                              identifier: {
                                                kind: "Identifier",
                                                name: "age"
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
                                                      name: "this"
                                                    },
                                                    attribute: {
                                                      kind: "Identifier",
                                                      name: "name"
                                                    }
                                                  }
                                                }
                                              ],
                                              operator: 21,
                                              values: [
                                                {
                                                  kind: "Identifier",
                                                  name: "name"
                                                }
                                              ]
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
                                                      name: "this"
                                                    },
                                                    attribute: {
                                                      kind: "Identifier",
                                                      name: "age"
                                                    }
                                                  }
                                                }
                                              ],
                                              operator: 21,
                                              values: [
                                                {
                                                  kind: "Identifier",
                                                  name: "age"
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        {
                                          kind: "FunctionDeclaration",
                                          returnTypes: [
                                            "_"
                                          ],
                                          identifier: {
                                            kind: "Identifier",
                                            name: "bark"
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
                                                      value: "Woof"
                                                    }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        {
                                          kind: "FunctionDeclaration",
                                          returnTypes: [
                                            "_"
                                          ],
                                          identifier: {
                                            kind: "Identifier",
                                            name: "setOwner"
                                          },
                                          parameters: [
                                            {
                                              kind: "VariableDeclaration",
                                              type: "owner",
                                              identifier: {
                                                kind: "Identifier",
                                                name: "owner"
                                              }
                                            }
                                          ],
                                          body: [
                                            {
                                              kind: "MemberFunctionCall",
                                              member: {
                                                kind: "Identifier",
                                                name: "owner"
                                              },
                                              function: {
                                                kind: "FunctionCall",
                                                identifier: {
                                                  kind: "Identifier",
                                                  name: "setDog"
                                                },
                                                arguments: [
                                                  {
                                                    kind: "Identifier",
                                                    name: "this"
                                                  }
                                                ]
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
});
