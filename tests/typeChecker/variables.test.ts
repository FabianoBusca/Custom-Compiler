import {typeCheckerTest} from "@tests/utils";

describe("Variables", () => {
    test("Variable declaration - 1", () => {
        const source = "num x = 5";

        typeCheckerTest(source);
    });

    test("Variable declaration - 2", () => {
        const source = "str y\n" +
            "num, str = foo(str s) {\n" +
            "return(1, s)\n" +
            "}\n" +
            "num x, y, bool b = foo(y), true";

        typeCheckerTest(source);
    });
});