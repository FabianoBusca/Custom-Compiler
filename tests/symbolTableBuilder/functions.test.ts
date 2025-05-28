import {SymbolTable} from "@src/data";
import {ASTFactory} from "@src/utils";
import {symbolTableBuilderTest} from "@tests/utils";

describe("Functions", () => {
    test("Function declaration - 1", () => {
        const source = "_ = bark(){}";

        const symbolTable = new SymbolTable();
        const new_scope = symbolTable.createChildScope();
        symbolTable.addFunction("bark", [], [], new_scope);

        symbolTableBuilderTest(source, symbolTable);
    });

    test("Function declaration - 2", () => {
        const source = "str, num = bark(num x, str y){}";

        const symbolTable = new SymbolTable();
        const new_scope = symbolTable.createChildScope();
        symbolTable.addFunction("bark", [
            ASTFactory.createType("str", 0, {line: 1, column: 1}, {line: 1, column: 4}),
            ASTFactory.createType("num", 0, {line: 1, column: 5}, {line: 1, column: 8})
        ], [
            {
                type: ASTFactory.createType("num", 0, {line: 1, column: 9}, {line: 1, column: 12}),
                name: "x"
            },
            {
                type: ASTFactory.createType("str", 0, {line: 1, column: 13}, {line: 1, column: 16}),
                name: "y"
            }
        ], new_scope);
        new_scope.addVariable("x", ASTFactory.createType("num", 0, {line: 1, column: 9}, {line: 1, column: 12}));
        new_scope.addVariable("y", ASTFactory.createType("str", 0, {line: 1, column: 13}, {line: 1, column: 16}));

        symbolTableBuilderTest(source, symbolTable);
    });

    test("Function declaration - 3", () => {
        const source = "class Dog = {}\n" +
            "Dog = _(bool b){}";

        const symbolTable = new SymbolTable();
        const new_scope = symbolTable.createChildScope();
        symbolTable.addClass("Dog", new SymbolTable());
        symbolTable.addFunction("_", [ASTFactory.createType("Dog", 0, {line: 2, column: 1}, {
            line: 2,
            column: 4
        })], [{
            type: ASTFactory.createType("bool", 0, {line: 2, column: 9}, {line: 2, column: 13}),
            name: "b"
        }], new_scope);
        new_scope.addVariable("b", ASTFactory.createType("bool", 0, {line: 2, column: 9}, {line: 2, column: 13}));

        symbolTableBuilderTest(source, symbolTable);
    })
});