import {DayErr} from "@src/utils";
import {typeCheckerTest} from "@tests/utils";

describe("Semantic errors", () => {
    test("Mismatched type declaration", () => {
        const source = "num x = '5'";


        const errors = [
            new DayErr("Variable declaration type mismatch: expected 'num', but got 'str'.", "Semantic Error", 1, 6, 7, "num x = '5'")
        ]

        typeCheckerTest(source, errors);
    });

    test("Wrong arguments number - 1", () => {
        const source = "_ = foo(){}\n" +
            "foo(1)";


        const errors = [
            new DayErr("Number of arguments does not match the declaration.", "Semantic Error", 2, 7, 8, "foo(1)")
        ]

        typeCheckerTest(source, errors);
    });

    test("Wrong arguments number - 2", () => {
        const source = "num, num = foo(){}\n" +
            "num x = foo()";

        const errors = [
            new DayErr("Variable operations expect a single value or the same number of values as operations, but got 2 values and 1 operations.", "Semantic Error", 2, 14, 15, "num x = foo()")
        ]

        typeCheckerTest(source, errors);
    });

    test("Self-increment wrong type", () => {
        const source = "class Dog = {}\n" +
            "Dog d\n" +
            "d += 1";

        const errors = [
            new DayErr("Variable assignment type mismatch: expected 'num', but got 'Dog'.", "Semantic Error", 3, 2, 3, "d += 1")
        ]

        typeCheckerTest(source, errors);
    });

    test("Undeclared member attribute", () => {
        const source = "class Dog = {}\n" +
            "Dog d\n" +
            "print(d.name)";

        const errors = [
            new DayErr("Attribute 'name' is not declared in class 'Dog'.", "Semantic Error", 3, 13, 14, "print(d.name)")
        ]

        typeCheckerTest(source, errors);
    });
});