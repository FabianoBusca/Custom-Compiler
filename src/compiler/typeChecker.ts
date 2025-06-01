import {ASTFactory, DayErr, Location} from "@src/utils";
import {
    ArrayElement,
    ArrayNode,
    ASTNode,
    BinaryExpression,
    BooleanNode,
    ClassDeclaration,
    Expression,
    ForStatement,
    FString,
    FunctionCall,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    LogicalExpression,
    MemberAttribute,
    MemberFunctionCall,
    NumberNode,
    PrintStatement,
    Program,
    ReadStatement,
    ReturnStatement,
    Statement,
    StringNode,
    SwitchStatement,
    SymbolTable,
    Tag,
    Type,
    UnaryExpression,
    VariableAssignment,
    VariableDeclaration,
    VariableOperations,
    WhileStatement
} from "@src/data";

export class TypeChecker {
    private readonly errors: DayErr[] = [];

    constructor(
        private readonly ast: Program,
        private symbolTable: SymbolTable,
        private readonly source: string,
    ) {
    }

    check() {
        try {
            this.checkProgram(this.ast);
        } catch (error) {
            if (error instanceof DayErr) {
                return false;
            } else
                throw error;
        }

        return true;
    }

    private compareTypes(actual: Type, expected: Type): boolean {
        return actual.name === expected.name && actual.depth === expected.depth;
    }

    private throwError(message: string, node: ASTNode): never {
        const error = new DayErr(
            message,
            "Semantic Error",
            node.start.line,
            node.end.column,
            node.end.column + 1,
            this.source.split("\n")[node.start.line - 1],
        );
        this.errors.push(error);
        // TODO shouldn't be thrown here
        throw error;
    }

    private formatType(type: Type): string {
        return `${type.name}${"[]".repeat(type.depth)}`;
    }

    private checkProgram(program: Program) {
        program.body.forEach(statement => this.checkStatement(statement));
    }

    private checkStatement(node: Statement) {
        switch (node.kind) {
            case 'IfStatement':
                return this.checkIfStatement(node as IfStatement);
            case 'WhileStatement':
                return this.checkWhileStatement(node as WhileStatement);
            case 'ForStatement':
                return this.checkForStatement(node as ForStatement);
            case 'SwitchStatement':
                return this.checkSwitchStatement(node as SwitchStatement);
            case 'FunctionDeclaration':
                return this.checkFunctionDeclaration(node as FunctionDeclaration);
            case 'ReturnStatement':
                return
            case 'ClassDeclaration':
                return this.checkClassDeclaration(node as ClassDeclaration);
            case 'PrintStatement':
                return this.checkPrintStatement(node as PrintStatement);
            case 'ReadStatement':
                return this.checkReadStatement(node as ReadStatement);
            case 'VariableOperations':
                return this.checkVariableOperations(node as VariableOperations);
            case 'FunctionCall':
                return this.checkFunctionCall(node as FunctionCall);
            case 'MemberFunctionCall':
                return this.checkMemberFunctionCall(node as MemberFunctionCall);
            case 'UnaryExpression':
                return this.checkUnaryExpression(node as UnaryExpression);
            default:
                throw Error(`Unknown statement type: ${node.kind}`);
        }
    }

    private checkIfStatement(node: IfStatement) {
        const conditionTypes = this.checkExpression(node.condition);
        if (conditionTypes.length !== 1 || conditionTypes[0].name !== 'bool') {
            this.throwError(`Condition of 'if' statement must be of type 'bool', but got '${conditionTypes[0].name}'.`, node.condition);
        }

        node.body.forEach(statement => this.checkStatement(statement));
        node.elseBody.forEach(statement => this.checkStatement(statement));
    }

    private checkWhileStatement(node: WhileStatement) {
        const conditionTypes = this.checkExpression(node.condition);
        if (conditionTypes.length !== 1 || conditionTypes[0].name !== 'bool') {
            this.throwError(`Condition of 'while' statement must be of type 'bool', but got '${conditionTypes[0].name}'.`, node.condition);
        }

        node.body.forEach(statement => this.checkStatement(statement));
    }

    private checkForStatement(node: ForStatement) {
        const iteratorType = this.symbolTable.variableLookup(node.iterator.name)
        if (!iteratorType) {
            throw new Error(`Iterator '${node.iterator.name}' is not declared.`);
        }

        const limitTypes = this.checkExpression(node.limit);
        if (limitTypes.length !== 1) {
            this.throwError(`Limit expression of 'for' statement must be a single type, but got ${limitTypes.length} types.`, node.limit);
        }

        if (limitTypes[0].name === 'num' && limitTypes[0].depth === 0) {
            if (this.compareTypes(iteratorType.type, ASTFactory.createType("unknown", 0, null as unknown as Location, null as unknown as Location))) {
                this.symbolTable.variableUpdate(node.iterator.name, ASTFactory.createType("num", 0, node.iterator.start, node.iterator.end));
            } else {
                if (!this.compareTypes(iteratorType.type, ASTFactory.createType("num", 0, null as unknown as Location, null as unknown as Location))) {
                    this.throwError(`Iterator '${node.iterator.name}' must be of type 'num', but got '${this.formatType(iteratorType.type)}'.`, node.iterator);
                }
            }
        } else if (limitTypes[0].depth < 1) {
            this.throwError(`Limit must be a 'num' or an array, but got '${limitTypes[0].name}'.`, node.limit);
        } else {
            if (this.compareTypes(iteratorType.type, ASTFactory.createType("unknown", 0, null as unknown as Location, null as unknown as Location))) {
                this.symbolTable.variableUpdate(node.iterator.name, ASTFactory.createType("num", limitTypes[0].depth - 1, node.iterator.start, node.iterator.end));
            } else {
                if (!this.compareTypes(iteratorType.type, ASTFactory.createType(limitTypes[0].name, limitTypes[0].depth - 1, null as unknown as Location, null as unknown as Location))) {
                    this.throwError(`Iterator '${node.iterator.name}' must be of type '${limitTypes[0].name + "[]".repeat(limitTypes[0].depth - 1)}' or an array of 'num', but got '${this.formatType(iteratorType.type)}''.`, node.iterator);
                }
            }
        }

        node.body.forEach(statement => this.checkStatement(statement));
    }

    private checkSwitchStatement(node: SwitchStatement) {
        const expressionTypes = this.checkExpression(node.expression);
        if (expressionTypes.length !== 1) {
            this.throwError(`Switch expression must be a single type, but got ${expressionTypes.length} types.`, node.expression);
        }

        node.cases.forEach(caseStatement => {
            caseStatement.values.forEach(value => {
                const valueTypes = this.checkExpression(value);
                if (valueTypes.length !== 1) {
                    this.throwError(`Case value must be a single type, but got ${valueTypes.length} types.`, value);
                } else if (!this.compareTypes(valueTypes[0], expressionTypes[0])) {
                    this.throwError(`Case value must be of type '${expressionTypes[0].name}', but got '${valueTypes[0].name}'.`, value);
                }
            });
            caseStatement.body.forEach(statement => this.checkStatement(statement));
        });

        node.default.forEach(statement => this.checkStatement(statement));
    }

    private checkFunctionDeclaration(node: FunctionDeclaration): void {
        const functionEntry = this.symbolTable.functionLookup(node.identifier.name);
        if (!functionEntry) {
            throw Error('Internal error: Symbol table builder should have created a function entry for the function declaration.');
        }
        const tmp = this.symbolTable
        this.symbolTable = functionEntry.scope;

        if (node.returnTypes.length > 0) {
            const returnStatements = node.body.filter(stmt => stmt.kind === 'ReturnStatement') as ReturnStatement[];

            returnStatements.forEach(statement => {
                const expected = node.returnTypes;
                const actual: Type[] = []

                for (const expr of statement.values) {
                    const types = this.checkExpression(expr);
                    actual.push(...types);
                }

                if (actual.length !== expected.length) {
                    this.throwError(
                        `Return arity mismatch: expected ${expected.length} value(s), but got ${actual.length}.`,
                        statement
                    );
                }

                actual.forEach((type, index) => {
                    if (!this.compareTypes(type, expected[index])) {
                        this.throwError(
                            `Return type mismatch: expected '${this.formatType(expected[index])}', but got '${this.formatType(type)}'.`,
                            statement
                        );
                    }

                })
            });
        }

        node.body.forEach(statement => this.checkStatement(statement));
        this.symbolTable = tmp;
    }

    private checkClassDeclaration(node: ClassDeclaration): void {
        const classEntry = this.symbolTable.classLookup(node.identifier.name);
        if (!classEntry) {
            throw Error('Internal error: Symbol table builder should have created a class entry for the class declaration.');
        }
        const tmp = this.symbolTable;
        this.symbolTable = classEntry.scope;
        node.body.forEach(statement => this.checkStatement(statement));
        this.symbolTable = tmp;
    }

    private checkPrintStatement(node: PrintStatement): void {
        const args = node.arguments.map(arg => this.checkExpression(arg)).flat();
        args.forEach(arg => {
            if (arg.name !== "num" &&
                arg.name !== "str" &&
                arg.name !== "bool") {
                this.throwError(`Print statement can only print 'num', 'str', or 'bool', but got '${this.formatType(arg)}'.`, node);
            }
        })
    }

    private checkReadStatement(node: ReadStatement): void {
        const args = node.arguments.map(arg => this.checkExpression(arg)).flat();
        args.forEach(arg => {
            if (!this.compareTypes(arg, ASTFactory.createType("num", 0, null as unknown as Location, null as unknown as Location)) &&
                !this.compareTypes(arg, ASTFactory.createType("str", 0, null as unknown as Location, null as unknown as Location)) &&
                !this.compareTypes(arg, ASTFactory.createType("bool", 0, null as unknown as Location, null as unknown as Location))) {
                this.throwError(`Read statement can only read into 'num', 'str', or 'bool', but got '${this.formatType(arg)}'.`, node);
            }
        });
    }

    private checkVariableOperations(node: VariableOperations): void {
        if (node.operator === null) return;

        const valueTypes = node.values.flatMap(value => this.checkExpression(value));

        if (valueTypes.length !== 1 && node.operations.length !== valueTypes.length) {
            this.throwError(
                `Variable operations expect a single value or the same number of values as operations, but got ${valueTypes.length} values and ${node.operations.length} operations.`,
                node
            );
        }

        const isSelfOp = node.operator === Tag.SELF_INC || node.operator === Tag.SELF_DEC;

        const expectedTypes = (valueTypes.length === 1)
            ? node.operations.map(() => valueTypes[0])
            : valueTypes;

        const isAllowedSelfOpType = (type: Type) => {
            const num = ASTFactory.createType("num", 0, null as unknown as Location, null as unknown as Location);
            const str = ASTFactory.createType("str", 0, null as unknown as Location, null as unknown as Location);
            return this.compareTypes(type, num) || this.compareTypes(type, str);
        }

        node.operations.forEach((op, index) => {
            const rhsType = expectedTypes[index];

            if (op.kind === 'VariableDeclaration') {
                const decl = op as VariableDeclaration;
                if (!this.compareTypes(rhsType, decl.type)) {
                    this.throwError(
                        `Variable declaration type mismatch: expected '${this.formatType(decl.type)}', but got '${this.formatType(rhsType)}'.`,
                        decl
                    );
                }
                if (isSelfOp && !isAllowedSelfOpType(rhsType)) {
                    this.throwError(
                        `Self-increment/decrement operators can only be applied to 'num' or 'str', but got '${this.formatType(rhsType)}'.`,
                        decl
                    );
                }
            } else {
                const assign = op as VariableAssignment;
                const lhsTypes = this.checkExpression(assign.element);
                if (lhsTypes.length !== 1 || !this.compareTypes(lhsTypes[0], rhsType)) {
                    this.throwError(
                        `Variable assignment type mismatch: expected '${this.formatType(rhsType)}', but got '${this.formatType(lhsTypes[0])}'.`,
                        assign
                    );
                }
                if (isSelfOp && !isAllowedSelfOpType(lhsTypes[0])) {
                    this.throwError(
                        `Self-increment/decrement operators can only be applied to 'num' or 'str', but got '${this.formatType(lhsTypes[0])}'.`,
                        assign
                    );
                }
            }
        });
    }


    private checkExpression(node: Expression): Type[] {
        switch (node.kind) {
            case "FunctionCall":
                return this.checkFunctionCall(node as FunctionCall);
            case "Identifier":
                return this.checkIdentifier(node as Identifier);
            case "MemberFunctionCall":
                return this.checkMemberFunctionCall(node as MemberFunctionCall);
            case "MemberAttribute":
                return this.checkMemberAttribute(node as MemberAttribute);
            case "UnaryExpression":
                return this.checkUnaryExpression(node as UnaryExpression);
            case "LogicalExpression":
                return this.checkLogicalExpression(node as LogicalExpression);
            case "BinaryExpression":
                return this.checkBinaryExpression(node as BinaryExpression);
            case "Number":
                return this.checkNumber(node as NumberNode);
            case "String":
                return this.checkString(node as StringNode);
            case "Boolean":
                return this.checkBoolean(node as BooleanNode);
            case "F-String":
                return this.checkFString(node as FString);
            case "Array":
                return this.checkArray(node as ArrayNode);
            case "ArrayElement":
                return this.checkArrayElement(node as ArrayElement);
            default:
                this.throwError(`Unexpected node type '${node.kind}' in expression.`, node);
        }
    }

    private checkFunctionCall(node: FunctionCall, st = this.symbolTable): Type[] {
        const functionDeclaration = st.functionLookup(node.identifier.name);
        if (!functionDeclaration) {
            this.throwError(`Function '${node.identifier.name}' is not declared.`, node.identifier);
        }

        const argumentsType = node.arguments.map(value => this.checkExpression(value)).flat();
        if (argumentsType.length !== functionDeclaration.parameters.length) {
            this.throwError('Number of arguments does not match the declaration.', node);
        }

        node.arguments.forEach((argument, index) => {
            if (!this.compareTypes(argumentsType[index], functionDeclaration.parameters[index].type)) {
                this.throwError(`Type mismatch: cannot assign a value of type '${argumentsType[index]}' to a parameter of type '${functionDeclaration.parameters[index].type}'.`, argument);
            }
        });

        return functionDeclaration.returnTypes;
    }

    private checkIdentifier(node: Identifier): Type[] {
        const variableEntry = this.symbolTable.variableLookup(node.name);
        if (!variableEntry) {
            this.throwError(`Variable '${node.name}' is not declared.`, node);
        }

        return [variableEntry.type];
    }

    private checkMemberFunctionCall(node: MemberFunctionCall): Type[] {
        if (node.member.kind === 'Identifier' && (node.member as Identifier).name === 'this') {
            return this.checkFunctionCall(node.function);
        }

        const types = this.checkExpression(node.member);
        if (types.length !== 1) {
            this.throwError(
                `Member function call expects a single type, but got ${types.length} types.`,
                node.member
            );
        }

        const type = types[0];
        const classEntry = this.symbolTable.classLookup(type.name);
        if (!classEntry) {
            this.throwError(
                `Function '${node.function.identifier.name}' is not declared for type ''${this.formatType(type)}'.`,
                node.function.identifier
            );
        }

        return this.checkFunctionCall(node.function, classEntry.scope);
    }

    private checkMemberAttribute(node: MemberAttribute): Type[] {
        const types = this.checkExpression(node.member);
        if (types.length !== 1) {
            this.throwError(
                `Member attribute access expects a single type, but got ${types.length} types.`,
                node.member
            );
        }

        const type = types[0];
        const classEntry = this.symbolTable.classLookup(type.name);
        if (!classEntry) {
            this.throwError(
                `Class '${type.name}' is not declared.`,
                node.member
            );
        }

        const attributeType = classEntry.scope.variableLookup(node.attribute.name);
        if (!attributeType) {
            this.throwError(
                `Attribute '${node.attribute.name}' is not declared in class '${type.name}'.`,
                node.attribute
            );
        }

        return [attributeType.type];
    }

    private checkUnaryExpression(node: UnaryExpression): Type[] {
        const types = this.checkExpression(node.base);
        if (types.length !== 1) {
            this.throwError(
                `Unary expression expects a single type, but got ${types.length} types.`,
                node.base
            );
        }

        const type = types[0];
        switch (node.operator) {
            case Tag.MINUS:
                if (type.name !== 'num' || type.depth !== 0) {
                    this.throwError(`Unary '-' operator can only be applied to 'num', but got '${this.formatType(type)}'.`, node);
                }
                break;
            case Tag.NOT:
                if (type.name !== 'bool') {
                    this.throwError(`Unary '!' operator can only be applied to 'bool', but got '${this.formatType(type)}'.`, node);
                }
                break;
            case Tag.INC:
                if (type.name !== 'num' || type.depth !== 0) {
                    this.throwError(`Unary '++' operator can only be applied to 'num', but got '${this.formatType(type)}'.`, node);
                }
                break;
            case Tag.DEC:
                if (type.name !== 'num' || type.depth !== 0) {
                    this.throwError(`Unary '--' operator can only be applied to 'num', but got '${this.formatType(type)}'.`, node);
                }
                break;
        }

        return [type];
    }

    private checkLogicalExpression(node: LogicalExpression): Type[] {
        const leftTypes = this.checkExpression(node.left);
        const rightTypes = this.checkExpression(node.right);

        if (leftTypes.length !== 1 || rightTypes.length !== 1) {
            this.throwError(
                `Logical expression expects a single type on both sides, but got ${leftTypes.length} and ${rightTypes.length} types.`,
                node
            );
        }

        const leftType = leftTypes[0];
        const rightType = rightTypes[0];

        switch (node.operator) {
            case Tag.AND:
            case Tag.OR:
                if (!this.compareTypes(leftType, ASTFactory.createType("bool", 0, null as unknown as Location, null as unknown as Location)) || !this.compareTypes(rightType, ASTFactory.createType("bool", 0, null as unknown as Location, null as unknown as Location))) {
                    this.throwError(
                        `Logical operator '${Tag[node.operator]}' can only be applied to 'bool', but got '${this.formatType(leftType)}' and '${this.formatType(rightType)}'.`,
                        node
                    );
                }
                break;
            case Tag.GT:
            case Tag.LT:
            case Tag.GE:
            case Tag.LE:
                if (!this.compareTypes(leftType, ASTFactory.createType("num", 0, null as unknown as Location, null as unknown as Location)) || !this.compareTypes(rightType, ASTFactory.createType("num", 0, null as unknown as Location, null as unknown as Location))) {
                    this.throwError(
                        `Comparison operator '${Tag[node.operator]}' can only be applied to 'num', but got '${this.formatType(leftType)}' and '${this.formatType(rightType)}'.`,
                        node
                    );
                }
                break;
            case Tag.EQ:
            case Tag.NE:
                if (!this.compareTypes(leftType, rightType)) {
                    this.throwError(
                        `Equality operator '${Tag[node.operator]}' can only be applied to the same type, but got '${this.formatType(leftType)}' and '${this.formatType(rightType)}'.`,
                        node
                    );
                }
                break;
        }

        return [ASTFactory.createType('bool', 0, node.start, node.end)];
    }

    private checkBinaryExpression(node: BinaryExpression): Type[] {
        const leftTypes = this.checkExpression(node.left);
        const rightTypes = this.checkExpression(node.right);

        if (leftTypes.length !== 1 || rightTypes.length !== 1) {
            this.throwError(
                `Binary expression expects a single type on both sides, but got ${leftTypes.length} and ${rightTypes.length} types.`,
                node
            );
        }

        const leftType = leftTypes[0];
        const rightType = rightTypes[0];

        switch (node.operator) {
            case Tag.PLUS:
                if (
                    !(this.compareTypes(leftType, rightType) &&
                        (this.compareTypes(leftType, ASTFactory.createType("num", 0, null as unknown as Location, null as unknown as Location)) ||
                            this.compareTypes(leftType, ASTFactory.createType("str", 0, null as unknown as Location, null as unknown as Location))))
                ) {
                    this.throwError(
                        `Operator '+' can only be applied to two 'num' or two 'str' values, but got '${this.formatType(leftType)}' and '${this.formatType(rightType)}'.`,
                        node
                    );
                }
                return [leftType];

            case Tag.MINUS:
            case Tag.MOD:
            case Tag.POW:
            case Tag.INT_DIV:
            case Tag.DIV:
                if (
                    !this.compareTypes(leftType, ASTFactory.createType("num", 0, null as unknown as Location, null as unknown as Location)) ||
                    !this.compareTypes(rightType, ASTFactory.createType("num", 0, null as unknown as Location, null as unknown as Location))
                ) {
                    this.throwError(
                        `Operator '${node.operator}' can only be applied to 'num', but got '${this.formatType(leftType)}' and '${this.formatType(rightType)}'.`,
                        node
                    );
                }
                return [leftType];

            case Tag.TIMES:
                if (
                    !(this.compareTypes(leftType, ASTFactory.createType("num", 0, null as unknown as Location, null as unknown as Location)) &&
                        this.compareTypes(rightType, ASTFactory.createType("num", 0, null as unknown as Location, null as unknown as Location))) &&
                    !(this.compareTypes(leftType, ASTFactory.createType("str", 0, null as unknown as Location, null as unknown as Location)) &&
                        this.compareTypes(rightType, ASTFactory.createType("num", 0, null as unknown as Location, null as unknown as Location)))
                ) {
                    this.throwError(
                        `Operator '*' can be applied to two 'num' values or 'str' and 'num' (in that order), but got '${this.formatType(leftType)}' and '${this.formatType(rightType)}'.`,
                        node
                    );
                }
                return [leftType];

            default:
                this.throwError(`Unknown binary operator '${node.operator}'.`, node);
        }
    }

    private checkNumber(node: NumberNode): Type[] {
        return [ASTFactory.createType("num", 0, node.start, node.end)];
    }

    private checkString(node: StringNode): Type[] {
        return [ASTFactory.createType("str", 0, node.start, node.end)];
    }

    private checkBoolean(node: BooleanNode): Type[] {
        return [ASTFactory.createType("bool", 0, node.start, node.end)];
    }

    private checkFString(node: FString): Type[] {
        const args = node.expressions.map(arg => this.checkExpression(arg)).flat();
        args.forEach(arg => {
            if (arg.name !== "num" &&
                arg.name !== "str" &&
                arg.name !== "bool") {
                this.throwError(`F-string can encode only 'num', 'str', or 'bool', but got '${this.formatType(arg)}'.`, node);
            }
        })

        return [ASTFactory.createType("str", 0, node.start, node.end)];
    }

    private checkArray(node: ArrayNode): Type[] {
        if (node.elements.length === 0) {
            this.throwError("Array cannot be empty.", node);
        }

        const elementTypes = node.elements.map(element => this.checkExpression(element)).flat();
        if (elementTypes.length === 0) {
            this.throwError("Array cannot be empty.", node);
        }

        const firstType = elementTypes[0];

        elementTypes.forEach(type => {
            if (!this.compareTypes(type, firstType)) {
                this.throwError(`All array elements must have the same type, but got '${this.formatType(type)}' and '${this.formatType(firstType)}'.`, node);
            }
        });

        return [ASTFactory.createType(firstType.name, firstType.depth + 1, node.start, node.end)];
    }

    private checkArrayElement(node: ArrayElement): Type[] {
        const types = this.checkExpression(node.array);
        if (types.length !== 1) {
            this.throwError(
                `Array element access expects a single type, but got ${types.length} types.`,
                node.array
            )
        }

        node.indexes.forEach(idx => {
            const types = this.checkExpression(idx);
            if (types.length !== 1 || types[0].name !== 'num' || types[0].depth !== 0) {
                this.throwError(
                    `Array index must be of type 'num', but got '${this.formatType(types[0])}'.`,
                    idx
                );
            }
        })

        const type = types[0];
        type.depth -= node.indexes.length
        if (type.depth < 0) {
            this.throwError(
                `Array element access exceeds array depth for type '${type.name}'.`,
                node
            );
        }

        return [type]
    }

    public getErrors(): DayErr[] {
        return this.errors;
    }
}