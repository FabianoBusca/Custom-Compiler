import {Tag} from "@src/data";
import {Location} from "@src/utils";

type NodeType =
    | "Program"
    | "Type"
    | "IfStatement"
    | "WhileStatement"
    | "ForStatement"
    | "SwitchStatement"
    | "CaseStatement"
    | "VariableOperations"
    | "VariableDeclaration"
    | "VariableAssignment"
    | "Identifier"
    | "FunctionDeclaration"
    | "ClassDeclaration"
    | "ReturnStatement"
    | "PrintStatement"
    | "ReadStatement"
    | "MemberFunctionCall"
    | "MemberAttribute"
    | "UnaryExpression"
    | "ArrayElement"
    | "FunctionCall"
    | "LogicalExpression"
    | "BinaryExpression"
    | "Number"
    | "String"
    | "Boolean"
    | "F-String"
    | "Array";

export interface ASTNode {
    kind: NodeType;
    start: Location;
    end: Location;
}

export interface Type extends ASTNode {
    kind: "Type";
    name: string;
    depth: number;
}

export interface Statement extends ASTNode {
}

export interface Program extends ASTNode {
    kind: "Program";
    body: Statement[];
}

export interface IfStatement extends Statement {
    kind: "IfStatement";
    condition: Expression;
    body: Statement[];
    elseBody: Statement[];
}

export interface WhileStatement extends Statement {
    kind: "WhileStatement";
    condition: Expression;
    body: Statement[];
}

export interface ForStatement extends Statement {
    kind: "ForStatement";
    iterator: Identifier;
    limit: Expression;
    body: Statement[];
}

export interface SwitchStatement extends Statement {
    kind: "SwitchStatement";
    expression: Expression;
    cases: CaseStatement[];
    default: Statement[];
}

export interface CaseStatement extends Statement {
    kind: "CaseStatement";
    values: Expression[];
    body: Statement[];
}

export interface FunctionDeclaration extends Statement {
    kind: "FunctionDeclaration";
    returnTypes: Type[];
    identifier: Identifier;
    parameters: VariableDeclaration[];
    body: Statement[];
}

export interface ClassDeclaration extends Statement {
    kind: "ClassDeclaration";
    identifier: Identifier;
    body: Statement[];
}

export interface ReturnStatement extends Statement {
    kind: "ReturnStatement";
    values: Expression[];
}

export interface PrintStatement extends Statement {
    kind: "PrintStatement";
    arguments: Expression[];
}

export interface ReadStatement extends Statement {
    kind: "ReadStatement";
    arguments: Expression[];
}

export interface Expression extends Statement {
}

export interface FunctionCall extends Expression {
    kind: "FunctionCall";
    identifier: Identifier;
    arguments: Expression[];
}

export interface VariableOperations extends Statement {
    kind: "VariableOperations";
    operations: (VariableDeclaration | VariableAssignment)[];
    operator: Tag | null;
    values: Expression[];
}

export interface VariableDeclaration extends Statement {
    kind: "VariableDeclaration";
    type: Type;
    identifier: Identifier;
}

export interface VariableAssignment extends Statement {
    kind: "VariableAssignment";
    element: Expression;
}

export interface Identifier extends Expression {
    kind: "Identifier";
    name: string;
}

export interface MemberFunctionCall extends Expression {
    kind: "MemberFunctionCall";
    member: Expression;
    function: FunctionCall;
}

export interface MemberAttribute extends Expression {
    kind: "MemberAttribute";
    member: Expression;
    attribute: Identifier;
}

export interface UnaryExpression extends Expression {
    kind: "UnaryExpression";
    operator: Tag;
    base: Expression;
}

export interface LogicalExpression extends Expression {
    kind: "LogicalExpression";
    operator: Tag;
    left: Expression;
    right: Expression;
}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression";
    left: Expression;
    operator: Tag;
    right: Expression;
}

export interface NumberNode extends Expression {
    kind: "Number";
    value: number;
}

export interface StringNode extends Expression {
    kind: "String";
    value: string;
}

export interface BooleanNode extends Expression {
    kind: "Boolean";
    value: boolean;
}

export interface FString extends Expression {
    kind: "F-String";
    value: Expression[];
}

export interface ArrayNode extends Expression {
    kind: "Array";
    elements: Expression[];
}

export interface ArrayElement extends Expression {
    kind: "ArrayElement";
    array: Expression;
    indexes: Expression[];
}
