import {parserTest} from "./Utils";

describe("Class Declarations", () => {
    test("Class declaration with constructor and methods", () => {
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
        `;

        const expected = `{
            // JSON structure similar to your example
        }`;

        parserTest(source, JSON.parse(expected));
    });
});

describe("Function Operations", () => {
    test("Function declaration with multiple return types", () => {
        const source = `dog, num = foo(str x, dog dog) {
            print(x)
            dog.bark()
            return(dog, 0)
        }`;
        const expected = `{
            // JSON structure similar to your example
        }`;
        parserTest(source, JSON.parse(expected));
    });

    test("Function call", () => {
        // Add your test for function calls here
    });
});

describe("Control Flow Statements", () => {
    test("Conditional and loop statements", () => {
        const source = `while(x >= 0) {
            if(x % 2 == 0) {
                x--
            } else {
                for(i, x) {
                    print(i)
                }
            }
        }`;
        const expected = `{
            // JSON structure similar to your example
        }`;
        parserTest(source, JSON.parse(expected));
    });
});