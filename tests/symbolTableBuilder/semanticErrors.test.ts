import {SymbolTable} from "@src/data";
import {ASTFactory, DayErr} from "@src/utils";
import {symbolTableBuilderTest} from "@tests/utils";

describe("Semantic errors", () => {
    test("Undeclared variable", () => {
        const source = "x = 1"

        const symbolTable = new SymbolTable();

        const errors: DayErr[] = [
            new DayErr("Variable 'x' is not declared.", "Semantic Error", 1, 1, 2, "x = 1")
        ];

        symbolTableBuilderTest(source, symbolTable, errors);
    })

    test("Undeclared function", () => {
        const source = "num x = foo()"

        const symbolTable = new SymbolTable();
        symbolTable.addVariable("x", ASTFactory.createType("num", 0, {line: 1, column: 1}, {line: 1, column: 4}));

        const errors: DayErr[] = [
            new DayErr("Function 'foo' is not declared.", "Semantic Error", 1, 9, 12, "num x = foo()")
        ];

        symbolTableBuilderTest(source, symbolTable, errors);
    })

    test("Undeclared class", () => {
        const source = "Dog d = _Dog()"

        const symbolTable = new SymbolTable();

        const errors: DayErr[] = [
            new DayErr("Type 'Dog' is not a valid type.", "Semantic Error", 1, 1, 4, "Dog d = _Dog()")
        ]

        symbolTableBuilderTest(source, symbolTable, errors);
    })

    test("Redeclaration of variable", () => {
        const source = "num x = 1\n" +
            "num x = 2"

        const symbolTable = new SymbolTable();
        symbolTable.addVariable("x", ASTFactory.createType("num", 0, {line: 1, column: 1}, {line: 1, column: 4}));

        const errors: DayErr[] = [
            new DayErr("Symbol 'x' is already declared in the current scope.", "Semantic Error", 2, 5, 6, "num x = 2")
        ];

        symbolTableBuilderTest(source, symbolTable, errors);
    })
});