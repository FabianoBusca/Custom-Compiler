import {
    ArrayElement,
    ArrayNode,
    BinaryExpression,
    BooleanNode,
    CaseStatement,
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
    Tag,
    Token,
    Type,
    UnaryExpression,
    VariableAssignment,
    VariableDeclaration,
    VariableOperations,
    WhileStatement,
} from "../data";
import {Location} from "./location";

export class ASTFactory {
    static createProgram(
        body: Statement[],
        start: Location,
        end: Location,
    ): Program {
        return {kind: "Program", body, start, end};
    }

    static createType(
        name: string,
        depth: number,
        start: Location,
        end: Location,
    ): Type {
        return {kind: "Type", name, depth, start, end};
    }

    static createIdentifier(token: Token): Identifier {
        return {
            kind: "Identifier",
            name: token.value,
            start: token.start,
            end: token.end,
        };
    }

    static createNumberNode(token: Token): NumberNode {
        return {
            kind: "Number",
            value: Number(token.value),
            start: token.start,
            end: token.end,
        };
    }

    static createStringNode(token: Token): StringNode {
        return {
            kind: "String",
            value: token.value,
            start: token.start,
            end: token.end,
        };
    }

    static createBooleanNode(token: Token): BooleanNode {
        return {
            kind: "Boolean",
            value: token.value === "true",
            start: token.start,
            end: token.end,
        };
    }

    static createBinaryExpression(
        left: Expression,
        operator: Tag,
        right: Expression,
    ): BinaryExpression {
        return {
            kind: "BinaryExpression",
            left,
            operator,
            right,
            start: left.start,
            end: right.end,
        };
    }

    static createLogicalExpression(
        left: Expression,
        operator: Tag,
        right: Expression,
    ): LogicalExpression {
        return {
            kind: "LogicalExpression",
            left,
            operator,
            right,
            start: left.start,
            end: right.end,
        };
    }

    static createUnaryExpression(
        operator: Tag,
        base: Expression,
        start: Location,
        end: Location,
    ): UnaryExpression {
        return {kind: "UnaryExpression", operator, base, start, end};
    }

    static createArrayNode(
        elements: Expression[],
        start: Location,
        end: Location,
    ): ArrayNode {
        return {kind: "Array", elements, start, end};
    }

    static createArrayElement(
        array: Expression,
        indexes: Expression[],
        start: Location,
        end: Location,
    ): ArrayElement {
        return {kind: "ArrayElement", array, indexes, start, end};
    }

    static createFString(
        value: Expression[],
        start: Location,
        end: Location,
    ): FString {
        return {kind: "F-String", expressions: value, start, end};
    }

    static createFunctionCall(
        identifier: Identifier,
        args: Expression[],
        start: Location,
        end: Location,
    ): FunctionCall {
        return {kind: "FunctionCall", identifier, arguments: args, start, end};
    }

    static createMemberAttribute(
        member: Expression,
        attribute: Identifier,
    ): MemberAttribute {
        return {
            kind: "MemberAttribute",
            member,
            attribute,
            start: member.start,
            end: attribute.end,
        };
    }

    static createMemberFunctionCall(
        member: Expression,
        func: FunctionCall,
    ): MemberFunctionCall {
        return {
            kind: "MemberFunctionCall",
            member,
            function: func,
            start: member.start,
            end: func.end,
        };
    }

    static createVariableDeclaration(
        type: Type,
        identifier: Identifier,
    ): VariableDeclaration {
        return {
            kind: "VariableDeclaration",
            type,
            identifier,
            start: type.start,
            end: identifier.end,
        };
    }

    static createVariableAssignment(element: Expression): VariableAssignment {
        return {
            kind: "VariableAssignment",
            element,
            start: element.start,
            end: element.end,
        };
    }

    static createVariableOperations(
        operations: (VariableDeclaration | VariableAssignment)[],
        operator: Tag | null,
        values: Expression[],
        start: Location,
        end: Location,
    ): VariableOperations {
        return {
            kind: "VariableOperations",
            operations,
            operator,
            values,
            start,
            end,
        };
    }

    static createFunctionDeclaration(
        returnTypes: Type[],
        identifier: Identifier,
        parameters: VariableDeclaration[],
        body: Statement[],
        start: Location,
        end: Location,
    ): FunctionDeclaration {
        return {
            kind: "FunctionDeclaration",
            returnTypes,
            identifier,
            parameters,
            body,
            start,
            end,
        };
    }

    static createClassDeclaration(
        identifier: Identifier,
        body: Statement[],
        start: Location,
        end: Location,
    ): ClassDeclaration {
        return {kind: "ClassDeclaration", identifier, body, start, end};
    }

    static createIfStatement(
        condition: Expression,
        body: Statement[],
        elseBody: Statement[],
        start: Location,
        end: Location,
    ): IfStatement {
        return {kind: "IfStatement", condition, body, elseBody, start, end};
    }

    static createWhileStatement(
        condition: Expression,
        body: Statement[],
        start: Location,
        end: Location,
    ): WhileStatement {
        return {kind: "WhileStatement", condition, body, start, end};
    }

    static createForStatement(
        iterator: Identifier,
        limit: Expression,
        body: Statement[],
        start: Location,
        end: Location,
    ): ForStatement {
        return {kind: "ForStatement", iterator, limit, body, start, end};
    }

    static createSwitchStatement(
        expression: Expression,
        cases: CaseStatement[],
        defaultCase: Statement[],
        start: Location,
        end: Location,
    ): SwitchStatement {
        return {
            kind: "SwitchStatement",
            expression,
            cases,
            default: defaultCase,
            start,
            end,
        };
    }

    static createCaseStatement(
        values: Expression[],
        body: Statement[],
        start: Location,
        end: Location,
    ): CaseStatement {
        return {kind: "CaseStatement", values, body, start, end};
    }

    static createPrintStatement(
        args: Expression[],
        start: Location,
        end: Location,
    ): PrintStatement {
        return {kind: "PrintStatement", arguments: args, start, end};
    }

    static createReadStatement(
        args: Expression[],
        start: Location,
        end: Location,
    ): ReadStatement {
        return {kind: "ReadStatement", arguments: args, start, end};
    }

    static createReturnStatement(
        values: Expression[],
        start: Location,
        end: Location,
    ): ReturnStatement {
        return {kind: "ReturnStatement", values, start, end};
    }

    static cloneProgram(program: Program): Program {
        return ASTFactory.createProgram(program.body.map(statement => this.cloneStatement(statement)), program.start, program.end);
    }

    static cloneStatement(statement: Statement): Statement {
        switch (statement.kind) {
            case 'VariableOperations':
                return this.cloneVariableOperations(statement as VariableOperations);
            case 'FunctionDeclaration':
                return this.cloneFunctionDeclaration(statement as FunctionDeclaration);
            case 'ClassDeclaration':
                return this.cloneClassDeclaration(statement as ClassDeclaration);
            case 'IfStatement':
                return this.cloneIfStatement(statement as IfStatement);
            case 'WhileStatement':
                return this.cloneWhileStatement(statement as WhileStatement);
            case 'ForStatement':
                return this.cloneForStatement(statement as ForStatement);
            case 'SwitchStatement':
                return this.cloneSwitchStatement(statement as SwitchStatement);
            case 'ReturnStatement':
                return this.cloneReturnStatement(statement as ReturnStatement);
            case 'PrintStatement':
            case 'ReadStatement':
                return this.cloneIOStatement(statement as PrintStatement | ReadStatement);
            case 'FunctionCall':
                return this.cloneFunctionCall(statement as FunctionCall);
            case 'MemberFunctionCall':
                return this.cloneMemberFunctionCall(statement as MemberFunctionCall);
            case 'UnaryExpression':
                return this.cloneUnaryExpression(statement as UnaryExpression);
            default:
                throw new Error(`Unexpected statement type '${statement.kind}'`);
        }
    }

    static cloneVariableOperations(node: VariableOperations): VariableOperations {
        return ASTFactory.createVariableOperations(
            node.operations.map(op => {
                if (op.kind === 'VariableDeclaration') {
                    return this.cloneVariableDeclaration(op);
                } else {
                    return this.cloneVariableAssignment(op);
                }
            }),
            node.operator,
            node.values.map(ex => this.cloneExpression(ex)),
            node.start,
            node.end
        );
    }

    static cloneVariableDeclaration(decl: VariableDeclaration): VariableDeclaration {
        return {
            ...decl,
            type: this.cloneType(decl.type),
            identifier: this.cloneSimpleExpression(decl.identifier) as Identifier,
        };
    }

    static cloneVariableAssignment(assignment: VariableAssignment): VariableAssignment {
        return {
            ...assignment,
            element: this.cloneExpression(assignment.element),
        };
    }

    static cloneFunctionDeclaration(decl: FunctionDeclaration): FunctionDeclaration {
        return {
            ...decl,
            returnTypes: decl.returnTypes.map(type => this.cloneType(type)),
            identifier: this.cloneSimpleExpression(decl.identifier) as Identifier,
            parameters: decl.parameters.map(param => this.cloneVariableDeclaration(param)),
            body: decl.body.map(statement => this.cloneStatement(statement)),
        };
    }

    static cloneClassDeclaration(decl: ClassDeclaration): ClassDeclaration {
        return {
            ...decl,
            identifier: this.cloneSimpleExpression(decl.identifier) as Identifier,
            body: decl.body.map(statement => this.cloneStatement(statement)),
        };
    }

    static cloneIfStatement(ifStmt: IfStatement): IfStatement {
        return ASTFactory.createIfStatement(
            this.cloneExpression(ifStmt.condition),
            ifStmt.body.map(statement => this.cloneStatement(statement)),
            ifStmt.elseBody.map(statement => this.cloneStatement(statement)),
            ifStmt.start,
            ifStmt.end
        );
    }

    static cloneWhileStatement(whileStmt: WhileStatement): WhileStatement {
        return ASTFactory.createWhileStatement(
            this.cloneExpression(whileStmt.condition),
            whileStmt.body.map(statement => this.cloneStatement(statement)),
            whileStmt.start,
            whileStmt.end
        );
    }

    static cloneForStatement(forStmt: ForStatement): ForStatement {
        return ASTFactory.createForStatement(
            this.cloneSimpleExpression(forStmt.iterator) as Identifier,
            this.cloneExpression(forStmt.limit),
            forStmt.body.map(statement => this.cloneStatement(statement)),
            forStmt.start,
            forStmt.end
        );
    }

    static cloneSwitchStatement(switchStmt: SwitchStatement): SwitchStatement {
        return ASTFactory.createSwitchStatement(
            this.cloneExpression(switchStmt.expression),
            switchStmt.cases.map(caseStmt => this.cloneCaseStatement(caseStmt)),
            switchStmt.default.map(statement => this.cloneStatement(statement)),
            switchStmt.start,
            switchStmt.end
        );
    }

    static cloneCaseStatement(caseStmt: CaseStatement): CaseStatement {
        return ASTFactory.createCaseStatement(
            caseStmt.values.map(value => this.cloneExpression(value)),
            caseStmt.body.map(statement => this.cloneStatement(statement)),
            caseStmt.start,
            caseStmt.end
        );
    }

    static cloneReturnStatement(returnStmt: ReturnStatement): ReturnStatement {
        return ASTFactory.createReturnStatement(
            returnStmt.values.map(value => this.cloneExpression(value)),
            returnStmt.start,
            returnStmt.end
        );
    }

    static cloneIOStatement(statement: PrintStatement | ReadStatement): PrintStatement | ReadStatement {
        return statement.kind === "PrintStatement"
            ? ASTFactory.createPrintStatement(
                statement.arguments.map(arg => this.cloneExpression(arg)),
                statement.start,
                statement.end
            )
            : ASTFactory.createReadStatement(
                statement.arguments.map(arg => this.cloneExpression(arg)),
                statement.start,
                statement.end
            );
    }

    static cloneExpression(expression: Expression): Expression {
        switch (expression.kind) {
            case "FunctionCall":
                return this.cloneFunctionCall(expression as FunctionCall);
            case "MemberFunctionCall":
                return this.cloneMemberFunctionCall(expression as MemberFunctionCall);
            case "MemberAttribute":
                return this.cloneMemberAttribute(expression as MemberAttribute);
            case "UnaryExpression":
                return this.cloneUnaryExpression(expression as UnaryExpression);
            case "LogicalExpression":
            case "BinaryExpression":
                return this.cloneBinaryExpression(expression as LogicalExpression | BinaryExpression);
            case "Identifier":
            case "Number":
            case "String":
            case "Boolean":
                return this.cloneSimpleExpression(expression as Identifier | NumberNode | StringNode | BooleanNode);
            case "F-String":
                return this.cloneFString(expression as FString);
            case "Array":
                return this.cloneArray(expression as ArrayNode);
            case "ArrayElement":
                return this.cloneArrayElement(expression as ArrayElement);
            default:
                throw new Error(`Unexpected node type '${expression.kind}' in expression.`);
        }
    }

    static cloneFunctionCall(call: FunctionCall): FunctionCall {
        return ASTFactory.createFunctionCall(
            this.cloneSimpleExpression(call.identifier) as Identifier,
            call.arguments.map(arg => this.cloneExpression(arg)),
            call.start,
            call.end
        );
    }

    static cloneMemberFunctionCall(call: MemberFunctionCall): MemberFunctionCall {
        return ASTFactory.createMemberFunctionCall(
            this.cloneExpression(call.member),
            this.cloneFunctionCall(call.function),
        );
    }

    static cloneMemberAttribute(attr: MemberAttribute): MemberAttribute {
        return ASTFactory.createMemberAttribute(
            this.cloneExpression(attr.member),
            this.cloneSimpleExpression(attr.attribute) as Identifier,
        );
    }

    static cloneUnaryExpression(expr: UnaryExpression): UnaryExpression {
        return ASTFactory.createUnaryExpression(
            expr.operator,
            this.cloneExpression(expr.base),
            expr.start,
            expr.end
        );
    }

    static cloneBinaryExpression(expr: LogicalExpression | BinaryExpression): LogicalExpression | BinaryExpression {
        return ASTFactory.createLogicalExpression(
            this.cloneExpression(expr.left),
            expr.operator,
            this.cloneExpression(expr.right),
        );
    }

    static cloneSimpleExpression(expr: Identifier | NumberNode | StringNode | BooleanNode): Identifier | NumberNode | StringNode | BooleanNode {
        switch (expr.kind) {
            case "Identifier":
                return this.createIdentifier({tag: Tag.ID, value: expr.name, start: expr.start, end: expr.end});
            case "Number":
                return this.createNumberNode({
                    tag: Tag.NUMBER,
                    value: String(expr.value),
                    start: expr.start,
                    end: expr.end
                });
            case "String":
                return this.createStringNode({tag: Tag.STR, value: expr.value, start: expr.start, end: expr.end});
            case "Boolean":
                return this.createBooleanNode({
                    tag: Tag.BOOL,
                    value: expr.value ? "true" : "false",
                    start: expr.start,
                    end: expr.end
                });
        }
    }

    static cloneFString(fString: FString): FString {
        return ASTFactory.createFString(
            fString.expressions.map(expr => this.cloneExpression(expr)),
            fString.start,
            fString.end
        );
    }

    static cloneArray(array: ArrayNode): ArrayNode {
        return ASTFactory.createArrayNode(
            array.elements.map(elem => this.cloneExpression(elem)),
            array.start,
            array.end
        );
    }

    static cloneArrayElement(element: ArrayElement): ArrayElement {
        return ASTFactory.createArrayElement(
            this.cloneExpression(element.array),
            element.indexes.map(index => this.cloneExpression(index)),
            element.start,
            element.end
        );
    }

    static cloneType(type: Type): Type {
        return ASTFactory.createType(type.name, type.depth, type.start, type.end);
    }
}
