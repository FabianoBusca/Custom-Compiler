import * as fs from "fs";
import * as path from "path";
import { Error, ErrorType } from "./Error";
import {Lexer} from "./Lexer";
//import {Parser} from "./Parser";
import {Parser} from "./Simple";

const scriptsPath = './scripts';

function readFile(filePath: string, content: { src: string }): Promise<Error> {
    return new Promise((resolve) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                resolve(new Error(ErrorType.ERROR_READ, `Unable to read file: ${err}`));
            } else {
                content.src = data;
                resolve(new Error(ErrorType.ERROR_NONE, ''));
            }
        });
    });
}

function compile(source: string, flag: string) {
    source = source.replace('\n\r', '\n');
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    if (flag === '-L') {
        tokens.forEach(token => {
            console.log(token);
        });
        return;
    }

    const parser = new Parser(tokens, source.split('\n'));
    const ast = parser.parse();

    if (flag === '-P') {
        console.log(JSON.stringify(ast, null, 2));
        return;
    }

    console.log("Parsing...");
}

async function main() {

    if (process.argv.length != 3 && process.argv.length != 4) {
        console.error("Usage...");
        return;
    }

    const flags = ['-L', '-P', '-A'];

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

main();