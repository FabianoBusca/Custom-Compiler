import {typeCheckerTest} from "@tests/utils";

describe("Type tests", () => {
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

    test("Variable declaration - 3", () => {
        const source = "num[] i\n" +
            "num[][] arr = [[1, 2], [2, 3]]\n" +
            "for(i, arr) {\n" +
            "  for(j, 2) {\n" +
            "    print(arr[j])\n" +
            "  }\n" +
            "}";

        typeCheckerTest(source);
    });

    test("Variable declaration - 4", () => {
        const source = "bool x\n" +
            "switch (x) {\n" +
            "  case true {\n" +
            "    x = false\n" +
            "  }\n" +
            "  case false {\n" +
            "    x = !x\n" +
            "  }\n" +
            "  x = true\n" +
            "}";

        typeCheckerTest(source);
    });

    test("Variable declaration - 5", () => {
        const source = "bool x, num y\n" +
            "if (x & y > 6 + 2) {\n" +
            "    y = 3\n" +
            "} else {\n" +
            "    y = 4\n" +
            "}";

        typeCheckerTest(source);
    });
});