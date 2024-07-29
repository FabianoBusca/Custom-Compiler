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

// Base Interface for AST Nodes
export interface ASTNode {
    kind: NodeType;
}

// Statement Interface
export interface Statement extends ASTNode {}

// Program Interface
export interface Program extends ASTNode {
    kind: 'Program';
    body: Statement[];
}

// Variable Declaration Interfaces
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
    element: Identifier | ArrayElement;
}

// Class Declaration Interface
export interface ClassDeclaration extends Statement {
    kind: 'ClassDeclaration';
    identifier: Identifier;
    body: Statement[];
}

// Function Declaration Interface
export interface FunctionDeclaration extends Statement {
    kind: 'FunctionDeclaration';
    returnTypes: string[];
    identifier: Identifier;
    parameters: VariableDeclaration[];
    body: Statement[];
}

// If Statement Interface
export interface IfStatement extends Statement {
    kind: 'IfStatement';
    condition: Expression;
    body: Statement[];
    elseBody: Statement[];
}

// While Statement Interface
export interface WhileStatement extends Statement {
    kind: 'WhileStatement';
    condition: Expression;
    body: Statement[];
}

// For Statement Interface
export interface ForStatement extends Statement {
    kind: 'ForStatement';
    iterator: Identifier;
    limit: Expression;
    body: Statement[];
}

// Expression Interface
export interface Expression extends Statement {}

// Logical Expression Interface
export interface LogicalExpression extends Expression {
    kind: 'LogicalExpression';
    operator: LogicalOperator;
    left: Expression;
    right: Expression;
}

// Binary Expression Interface
export interface BinaryExpression extends Expression {
    kind: 'BinaryExpression';
    left: Expression;
    operator: Operator;
    right: Expression;
}

// Unary Expression Interface
export interface UnaryExpression extends Expression {
    kind: 'UnaryExpression';
    operator: Operator;
    base: Expression;
}

// Function Call Interface
export interface FunctionCall extends Expression {
    kind: 'FunctionCall';
    identifier: Identifier;
    arguments: Expression[];
}

// Member Function Call Interface
export interface MemberFunctionCall extends Expression {
    kind: 'MemberFunctionCall';
    member: Identifier;
    function: FunctionCall;
}

// Member Attribute Interface
export interface MemberAttribute extends Expression {
    kind: 'MemberAttribute';
    member: Identifier;
    attribute: Expression;
}

// Identifier Interface
export interface Identifier extends Expression {
    kind: 'Identifier';
    name: string;
}

// Literal Node Interfaces
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

// Array Node Interface
export interface ArrayNode extends Expression {
    kind: 'Array';
    elements: Expression[];
}

// Array Element Interface
export interface ArrayElement extends Expression {
    kind: 'ArrayElement';
    array: Identifier;
    indices: Expression[];
}
