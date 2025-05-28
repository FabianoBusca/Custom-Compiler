import {ASTFactory} from "@src/utils";
import {symbolTableBuilderTest} from "@tests/utils";
import {SymbolTable} from "@src/data";

describe("Variables", () => {
    test("Variable declaration - 1", () => {
        const source = "num x = 6";

        const symbolTable = new SymbolTable();
        symbolTable.addVariable("x", ASTFactory.createType("num", 0, {line: 1, column: 1}, {line: 1, column: 3}));

        symbolTableBuilderTest(source, symbolTable);
    });

    test("Variable declaration - 2", () => {
        const source = "str s = 'hello {5}'";

        const symbolTable = new SymbolTable();
        symbolTable.addVariable("s", ASTFactory.createType("str", 0, {line: 1, column: 1}, {line: 1, column: 3}));

        symbolTableBuilderTest(source, symbolTable);
    });

    test("Variable declaration - 3", () => {
        const source = "bool b = true";

        const symbolTable = new SymbolTable();
        symbolTable.addVariable("b", ASTFactory.createType("bool", 0, {line: 1, column: 1}, {line: 1, column: 4}));

        symbolTableBuilderTest(source, symbolTable);
    });

    test("Variable declaration - 4", () => {
        const source =
            "class Dog = {}\n" +
            "Dog d";

        const symbolTable = new SymbolTable();
        symbolTable.addClass("Dog", new SymbolTable());
        symbolTable.addVariable("d", ASTFactory.createType("Dog", 0, {line: 2, column: 1}, {line: 2, column: 3}));

        symbolTableBuilderTest(source, symbolTable);
    });

    test("Variable declaration - 5", () => {
        const source =
            "num = foo(str s) {}\n" +
            "num x = foo()";

        let symbolTable = new SymbolTable();
        const newScope = symbolTable.createChildScope();
        symbolTable.addFunction("foo", [ASTFactory.createType("num", 0, {line: 1, column: 1}, {
            line: 1,
            column: 3
        })], [{
            name: "s",
            type: ASTFactory.createType("str", 0, {line: 1, column: 5}, {line: 1, column: 7})
        }], newScope);
        newScope.addVariable("s", ASTFactory.createType("str", 0, {line: 1, column: 5}, {line: 1, column: 7}));
        symbolTable.addVariable("x", ASTFactory.createType("num", 0, {line: 2, column: 1}, {line: 2, column: 3}));

        symbolTableBuilderTest(source, symbolTable);
    });
});