import {
    ArrayNode,
    BinaryExpression,
    BooleanNode,
    Expression,
    LogicalExpression,
    NumberNode,
    Program,
    Statement,
    Tag,
    UnaryExpression,
} from "@src/data";

export class AssemblyGenerator {
    private assembly: string[] = [];
    private intRegCounter: number = 0;
    private floatRegCounter: number = 0;
    private freeIntRegs: string[] = [];
    private freeFloatRegs: string[] = [];
    private regMap: Map<string, { reg: string, float: boolean }> = new Map();

    constructor(private readonly ast: Program) {
    }

    generate(): void {
        this.assembly.push(".section __TEXT,__text,regular,pure_instructions");
        this.assembly.push(".globl _main");
        this.assembly.push(".p2align 2");
        this.assembly.push("_main:");

        this.visitProgram(this.ast);

        this.assembly.push("    ret");
    }

    private newReg(float: boolean): string {
        if (float) {
            return this.freeFloatRegs.pop() ?? `d${this.floatRegCounter++}`;
        } else {
            return this.freeIntRegs.pop() ?? `x${this.intRegCounter++}`;
        }
    }

    private freeReg(reg: string): void {
        if (reg.startsWith("d")) {
            this.freeFloatRegs.push(reg);
        } else {
            this.freeIntRegs.push(reg);
        }
    }

    private visitProgram(program: Program): void {
        program.body.forEach(statement => this.visitStatement(program));
    }

    private visitStatement(node: Statement): void {
        // placeholder for now
    }

    private visitExpression(node: Expression): string {
        switch (node.kind) {
            case "FunctionCall":
                return ""; // Placeholder for now
            case "MemberFunctionCall":
                return ""; // Placeholder for now
            case "MemberAttribute":
                return ""; // Placeholder for now
            case "UnaryExpression":
                return this.visitUnaryExpression(node as UnaryExpression);
            case "LogicalExpression":
                return this.visitLogicalExpression(node as LogicalExpression);
            case "BinaryExpression":
                return this.visitBinaryExpression(node as BinaryExpression);
            case "Identifier":
            case "Number":
                return this.visitNumber(node as NumberNode);
            case "String":
                return ""; // Placeholder for now
            case "Boolean":
                return this.visitBoolean(node as BooleanNode);
            case "F-String":
                return ""; // Placeholder for now
            case "Array":
                return ""; // Placeholder for now
            case "ArrayElement":
                return ""; // Placeholder for now
            default:
                throw new Error(`Unexpected node type '${node.kind}' in expression.`);
        }
    }

    private visitBinaryExpression(node: BinaryExpression): string {
        const leftReg = this.visitExpression(node.left);
        const rightReg = this.visitExpression(node.right);
        let reg: string;

        switch (node.operator) {
            case Tag.PLUS:
                reg = this.newReg(true);
                this.assembly.push(`    fadd ${reg}, ${leftReg}, ${rightReg}`);
                break;
            case Tag.MINUS:
                reg = this.newReg(true);
                this.assembly.push(`    fsub ${reg}, ${leftReg}, ${rightReg}`);
                break;
            case Tag.TIMES:
                reg = this.newReg(true);
                this.assembly.push(`    fmul ${reg}, ${leftReg}, ${rightReg}`);
                break;
            case Tag.DIV:
                reg = this.newReg(true);
                this.assembly.push(`    fdiv ${reg}, ${leftReg}, ${rightReg}`);
                break;
            case Tag.INT_DIV: {
                const tmp = this.newReg(false);
                this.assembly.push(`    fcvtzs x0, ${leftReg}`);
                this.assembly.push(`    fcvtzs x1, ${rightReg}`);
                this.assembly.push(`    sdiv ${tmp}, x0, x1`);
                reg = this.newReg(true);
                this.assembly.push(`    scvtf ${reg}, ${tmp}`);
                this.freeReg(tmp);
                break;
            }
            case Tag.MOD: {
                const tmp = this.newReg(false);
                this.assembly.push(`    fcvtzs x0, ${leftReg}`);
                this.assembly.push(`    fcvtzs x1, ${rightReg}`);
                this.assembly.push(`    sdiv x2, x0, x1`);
                this.assembly.push(`    mul x2, x2, x1`);
                this.assembly.push(`    sub ${tmp}, x0, x2`);
                reg = this.newReg(true);
                this.assembly.push(`    scvtf ${reg}, ${tmp}`);
                this.freeReg(tmp);
                break;
            }
            case Tag.POW:
                reg = this.newReg(true);
                this.assembly.push(`    mov x0, ${leftReg}`);
                this.assembly.push(`    mov x1, ${rightReg}`);
                this.assembly.push(`    bl pow`);
                this.assembly.push(`    fmov ${reg}, x0`);
                break;
            default:
                throw new Error(`Unsupported binary operator '${node.operator}'`);
        }

        this.freeReg(leftReg);
        this.freeReg(rightReg);
        return reg;
    }

    private visitLogicalExpression(node: LogicalExpression): string {
        const leftReg = this.visitExpression(node.left);
        const rightReg = this.visitExpression(node.right);
        const reg = this.newReg(false);

        switch (node.operator) {
            case Tag.EQ:
                this.assembly.push(`    cmp ${leftReg}, ${rightReg}`);
                this.assembly.push(`    mov ${reg}, #0`);
                this.assembly.push(`    cset ${reg}, eq`);
                break;
            case Tag.NE:
                this.assembly.push(`    cmp ${leftReg}, ${rightReg}`);
                this.assembly.push(`    mov ${reg}, #0`);
                this.assembly.push(`    cset ${reg}, ne`);
                break;
            case Tag.GT:
                this.assembly.push(`    cmp ${leftReg}, ${rightReg}`);
                this.assembly.push(`    mov ${reg}, #0`);
                this.assembly.push(`    cset ${reg}, gt`);
                break;
            case Tag.LT:
                this.assembly.push(`    cmp ${leftReg}, ${rightReg}`);
                this.assembly.push(`    mov ${reg}, #0`);
                this.assembly.push(`    cset ${reg}, lt`);
                break;
            case Tag.GE:
                this.assembly.push(`    cmp ${leftReg}, ${rightReg}`);
                this.assembly.push(`    mov ${reg}, #0`);
                this.assembly.push(`    cset ${reg}, ge`);
                break;
            case Tag.LE:
                this.assembly.push(`    cmp ${leftReg}, ${rightReg}`);
                this.assembly.push(`    mov ${reg}, #0`);
                this.assembly.push(`    cset ${reg}, le`);
                break;
            case Tag.AND:
                this.assembly.push(`    and ${reg}, ${leftReg}, ${rightReg}`);
                this.assembly.push(`    and ${reg}, ${reg}, #1`);
                break;
            case Tag.OR:
                this.assembly.push(`    orr ${reg}, ${leftReg}, ${rightReg}`);
                this.assembly.push(`    and ${reg}, ${reg}, #1`);
                break;
            default:
                throw new Error(`Unsupported logical operator '${node.operator}'`);
        }

        this.freeReg(leftReg);
        this.freeReg(rightReg);
        return reg;
    }

    private visitNumber(node: NumberNode): string {
        const reg = this.newReg(true);
        this.assembly.push(`    fmov ${reg}, #${node.value}`);
        return reg;
    }

    private visitBoolean(node: BooleanNode): string {
        const reg = this.newReg(false);
        this.assembly.push(`    mov ${reg}, #${node.value ? 1 : 0}`);
        return reg;
    }

    private visitUnaryExpression(node: UnaryExpression): string {
        const baseReg = this.visitExpression(node.base);
        let reg: string;

        switch (node.operator) {
            case Tag.NOT:
                reg = this.newReg(false);
                this.assembly.push(`    and ${reg}, ${baseReg}, #1`);
                this.assembly.push(`    eor ${reg}, ${reg}, #1`);
                break;
            case Tag.INC:
                reg = this.newReg(true);
                this.assembly.push(`    fadd ${reg}, ${baseReg}, #1.0`);
                break;
            case Tag.DEC:
                reg = this.newReg(true);
                this.assembly.push(`    fsub ${reg}, ${baseReg}, #1.0`);
                break;
            case Tag.MINUS:
                reg = this.newReg(true);
                this.assembly.push(`    fneg ${reg}, ${baseReg}`);
                break;
            default:
                throw new Error(`Unsupported unary operator '${node.operator}'`);
        }

        this.freeReg(baseReg);
        return reg;
    }

    private visitArray(node: ArrayNode): string {
        
    }

    public getAssembly() {
        return this.assembly;
    }
}