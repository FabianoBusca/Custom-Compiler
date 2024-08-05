// Node Types
export type NodeType =
    | 'Program'
    | 'Statement'
    | 'VariableOperations'
    | 'VariableDeclaration'
    | 'VariableAssignment'
    | 'ClassDeclaration'
    | 'FunctionDeclaration'
    | 'SelfAssignment'
    | 'IfStatement'
    | 'WhileStatement'
    | 'ForStatement'
    | 'Expression'
    | 'LogicalExpression'
    | 'BinaryExpression'
    | 'UnaryExpression'
    | 'FunctionCall'
    | 'MemberFunctionCall'
    | 'MemberAttribute'
    | 'Identifier'
    | 'Number'
    | 'String'
    | 'Boolean'
    | 'F-String'
    | 'Array'
    | 'ArrayElement';

// Operators
export type Operator =
    | '+'
    | '-'
    | '*'
    | '/'
    | '//'
    | '%'
    | '**'
    | '++'
    | '--'
    | '!';

export type LogicalOperator =
    | '&'
    | '|'
    | '=='
    | '!='
    | '>'
    | '<'
    | '>='
    | '<='
    | '!';

// Base interface for AST Nodes
export interface ASTNode {
    kind: NodeType;
}

// Statement export interface
export interface Statement extends ASTNode {}

// Program export interface
export interface Program extends ASTNode {
    kind: 'Program';
    body: Statement[];
}

// Variable Declaration export interfaces
export interface VariableOperations extends Statement {
    kind: 'VariableOperations';
    operations: (VariableDeclaration | VariableAssignment)[];
    operator: Operator;
    values: Expression[];
}

export interface VariableDeclaration extends Statement {
    kind: 'VariableDeclaration';
    type: string;
    identifier: Identifier;
}

export interface VariableAssignment extends Statement {
    kind: 'VariableAssignment';
    element: Expression;
}

// Class Declaration export interface
export interface ClassDeclaration extends Statement {
    kind: 'ClassDeclaration';
    identifier: Identifier;
    body: Statement[];
}

// Function Declaration export interface
export interface FunctionDeclaration extends Statement {
    kind: 'FunctionDeclaration';
    returnTypes: string[];
    identifier: Identifier;
    parameters: VariableDeclaration[];
    body: Statement[];
}

// If Statement export interface
export interface IfStatement extends Statement {
    kind: 'IfStatement';
    condition: Expression;
    body: Statement[];
    elseBody: Statement[];
}

// While Statement export interface
export interface WhileStatement extends Statement {
    kind: 'WhileStatement';
    condition: Expression;
    body: Statement[];
}

// For Statement export interface
export interface ForStatement extends Statement {
    kind: 'ForStatement';
    iterator: Identifier;
    limit: Expression;
    body: Statement[];
}

// Expression export interface
export interface Expression extends Statement {}

// Logical Expression export interface
export interface LogicalExpression extends Expression {
    kind: 'LogicalExpression';
    operator: LogicalOperator;
    left: Expression;
    right: Expression;
}

// Binary Expression export interface
export interface BinaryExpression extends Expression {
    kind: 'BinaryExpression';
    left: Expression;
    operator: Operator;
    right: Expression;
}

// Unary Expression export interface
export interface UnaryExpression extends Expression {
    kind: 'UnaryExpression';
    operator: Operator;
    base: Expression;
}

// Function Call export interface
export interface FunctionCall extends Expression {
    kind: 'FunctionCall';
    identifier: Identifier;
    arguments: Expression[];
}

// Member Function Call export interface
export interface MemberFunctionCall extends Expression {
    kind: 'MemberFunctionCall';
    member: Identifier;
    function: FunctionCall;
}

// Member Attribute export interface
export interface MemberAttribute extends Expression {
    kind: 'MemberAttribute';
    member: Identifier;
    attribute: Expression;
}

// Identifier export interface
export interface Identifier extends Expression {
    kind: 'Identifier';
    name: string;
}

// Literal Node export interfaces
export interface NumberNode extends Expression {
    kind: 'Number';
    value: number;
}

export interface StringNode extends Expression {
    kind: 'String';
    value: string;
}

export interface BooleanNode extends Expression {
    kind: 'Boolean';
    value: boolean;

}

export interface FString extends Expression {
    kind: 'F-String';
    value: Expression[];
}

// Array Node export interface
export interface ArrayNode extends Expression {
    kind: 'Array';
    elements: Expression[];
}

// Array Element export interface
export interface ArrayElement extends Expression {
    kind: 'ArrayElement';
    array: Identifier;
    indices: Expression[];
}
