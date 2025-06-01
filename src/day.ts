import * as fs from "fs";
import * as path from "path";
import {execSync} from "child_process";
import {AssemblyGenerator, Lexer, Optimizer, Parser, SymbolTableBuilder, TypeChecker} from "./compiler";
import {DayErr} from "@src/utils";

const scriptsPath = './tests';

function run(source: string, flag: string, name: string = 'out') {
    let errors: DayErr[];
    source = source.replace(/\r\n|\r/g, '\n');

    const lexer = new Lexer(source);
    lexer.tokenize();
    errors = lexer.getErrors();
    if (errors.length > 0) return printErrors(errors);

    const tokens = lexer.getTokens();
    if (flag === '-L') return printAndExit(tokens);

    const parser = new Parser(tokens, source);
    parser.parse();
    errors = parser.getErrors();
    if (errors.length > 0) return printErrors(errors);

    const ast = parser.getAST();
    if (flag === '-P') return printAndExit(ast);

    const symbolTableBuilder = new SymbolTableBuilder(ast, source);
    symbolTableBuilder.build();
    errors = symbolTableBuilder.getErrors();
    if (errors.length > 0) return printErrors(errors);

    const symbolTable = symbolTableBuilder.getSymbolTable();
    if (flag === '-S') return printAndExit(symbolTable.toString());

    const typeChecker = new TypeChecker(ast, symbolTable, source);
    typeChecker.check();
    errors = typeChecker.getErrors();
    if (errors.length > 0) return printErrors(errors);

    if (flag === '-T') return printAndExit("Type checking completed successfully.");

    const optimizer = new Optimizer(ast);
    optimizer.optimize();
    const optimizedAst = optimizer.getOptimizedAST();
    if (flag === '-O') return printAndExit(optimizedAst);

    const assemblyGenerator = new AssemblyGenerator(ast);
    assemblyGenerator.generate();
    const assemblyCode = assemblyGenerator.getAssembly();

    if (flag === '-A') {
        fs.writeFileSync(`${name}.s`, assemblyCode.join('\n'));
        console.log(`Assembly code written to ${name}.s`);
        return true;
    }

    fs.writeFileSync('temp.s', assemblyCode.join('\n'));
    execSync('clang -c temp.s -o temp.o');
    execSync(`clang temp.o -o ${name}`);
    fs.unlinkSync('temp.s');
    fs.unlinkSync('temp.o');

    if (flag === '-C') {
        console.log(`Compiled executable: ${name}`);
        return true;
    }

    try {
        execSync(`./${name}`, {stdio: 'inherit'});
    } catch (err: any) {
        if (err.status !== undefined) {
            console.log(`Execution completed. Program exited with code: ${err.status}`);
            fs.unlinkSync(name);
            return true;
        } else {
            throw err;
        }
    }

    fs.unlinkSync(name);
    console.log(`Execution completed successfully.`);
    return true;
}

function printErrors(errors: DayErr[]): boolean {
    errors.forEach(err => console.error(err.toString()));
    return false;
}

function printAndExit(data: any): boolean {
    console.log(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    return true;
}

function main() {
    if (process.argv.length !== 3 && process.argv.length !== 4) {
        console.error("Usage: node main.js [-L | -P | -S | -T | -O | -A | -C] <filename>.dy");
        return;
    }

    const flags = ['-L', '-P', '-S', '-T', '-O', '-A', '-C'];
    const [, , arg1, arg2] = process.argv;
    const flag = flags.includes(arg1) ? arg1 : null;
    const fileArg = flag ? arg2 : arg1;

    if (!fileArg || fileArg.split('.').pop() !== 'dy') {
        console.error("Usage: node main.js [-L | -P | -S | -T | -O | -A | -C] <filename>.dy");
        return;
    }

    if (process.argv.length === 4 && !flag) {
        console.error("Unknown flag. Usage: node main.js [-L | -P | -S | -T | -O | -A | -C] <filename>.dy");
        return;
    }

    const filePath = path.isAbsolute(fileArg) ? fileArg : path.join(scriptsPath, fileArg);
    let content = '';
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`Unable to read file: ${err}`);
        process.exit(1);
    }

    const success = run(content, flag || "");
    if (!flag && success) {
        console.log("Compilation successful.");
    }
}

main();