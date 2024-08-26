import * as fs from "fs";
import * as path from "path";
import {Lexer, Parser, SymbolTableBuilder, TypeChecker} from "./compiler";

const scriptsPath = './tests';
function compile(source: string, flag: string) {
    let errors;
    source = source.replace('\n\r', '\n');

    const lexer = new Lexer(source);
    lexer.tokenize();
    errors = lexer.getErrors();
    if (errors.length > 0) {
        errors.forEach(error => {
            console.error(error.toString());
        });
        return;
    }

    const tokens = lexer.getTokens();

    if (flag === '-L') {
        console.log(tokens);
        return;
    }

    const parser = new Parser(tokens, source);
    parser.parse();
    errors = parser.getErrors();
    if (errors.length > 0) {
        errors.forEach(error => {
            console.error(error.toString());
        });
        return;
    }

    const ast = parser.getAST();

    if (flag === '-P') {
        console.log(JSON.stringify(ast, null, 2));
        return;
    }

    const symbolTableBuilder = new SymbolTableBuilder(ast);
    const symbolTable = symbolTableBuilder.build();

    if (flag === '-S') {
        console.log(symbolTable.toString())
        return;
    }

    const typeChecker = new TypeChecker(ast, symbolTable);
    typeChecker.check();

    if (flag === '-T') {
        return;
    }

}

async function main() {

    if (process.argv.length != 3 && process.argv.length != 4) {
        console.error("Usage...");
        return;
    }

    const flags = ['-L', '-P', '-S', '-T'];

    if (process.argv.length == 4 && !flags.includes(process.argv[2])) {
        console.error("Usage...");
        return;
    }

    if (process.argv[process.argv.length - 1].split('.').pop() !== 'dy') {
        console.error("Usage...");
        return;
    }

    const filePath = path.join(scriptsPath, process.argv[process.argv.length - 1]);
    let content = '';
    try {
        content = await fs.promises.readFile(filePath, 'utf8');
    } catch (err) {
        console.error(`Unable to read file: ${err}`);
        process.exit(1);
    }

    compile(content, process.argv[2]);
}

await main();