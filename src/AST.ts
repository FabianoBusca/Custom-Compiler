// Node Types
export type NodeType =
    | 'Program'
    | 'Statement'
    | 'VariableDeclarations'
    | 'VariableDeclaration'
    | 'VariableAssignment'
    | 'FunctionDeclaration'
    | 'SelfAssignment'
    | 'Expression'
    | 'LogicalExpression'
    | 'BinaryExpression'
    | 'UnaryExpression'
    | 'FunctionCall'
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
export interface VariableDeclarations extends Statement {
    kind: 'VariableDeclarations';
    declarations: (VariableDeclaration | VariableAssignment)[];
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

// Function Declaration Interface
export interface FunctionDeclaration extends Statement {
    kind: 'FunctionDeclaration';
    returnTypes: string[];
    identifier: Identifier;
    parameters: VariableDeclaration[];
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
