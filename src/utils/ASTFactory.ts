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
import { Location } from "./location";

export class ASTFactory {
  static createProgram(
    body: Statement[],
    start: Location,
    end: Location,
  ): Program {
    return { kind: "Program", body, start, end };
  }

  static createType(
    name: string,
    depth: number,
    start: Location,
    end: Location,
  ): Type {
    return { kind: "Type", name, depth, start, end };
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
    return { kind: "UnaryExpression", operator, base, start, end };
  }

  static createArrayNode(
    elements: Expression[],
    start: Location,
    end: Location,
  ): ArrayNode {
    return { kind: "Array", elements, start, end };
  }

  static createArrayElement(
    array: Expression,
    indexes: Expression[],
    start: Location,
    end: Location,
  ): ArrayElement {
    return { kind: "ArrayElement", array, indexes, start, end };
  }

  static createFString(
    value: Expression[],
    start: Location,
    end: Location,
  ): FString {
    return { kind: "F-String", value, start, end };
  }

  static createFunctionCall(
    identifier: Identifier,
    args: Expression[],
    start: Location,
    end: Location,
  ): FunctionCall {
    return { kind: "FunctionCall", identifier, arguments: args, start, end };
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
    operator: Tag,
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
    return { kind: "ClassDeclaration", identifier, body, start, end };
  }

  static createIfStatement(
    condition: Expression,
    body: Statement[],
    elseBody: Statement[],
    start: Location,
    end: Location,
  ): IfStatement {
    return { kind: "IfStatement", condition, body, elseBody, start, end };
  }

  static createWhileStatement(
    condition: Expression,
    body: Statement[],
    start: Location,
    end: Location,
  ): WhileStatement {
    return { kind: "WhileStatement", condition, body, start, end };
  }

  static createForStatement(
    iterator: Identifier,
    limit: Expression,
    body: Statement[],
    start: Location,
    end: Location,
  ): ForStatement {
    return { kind: "ForStatement", iterator, limit, body, start, end };
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
    return { kind: "CaseStatement", values, body, start, end };
  }

  static createPrintStatement(
    args: Expression[],
    start: Location,
    end: Location,
  ): PrintStatement {
    return { kind: "PrintStatement", arguments: args, start, end };
  }

  static createReadStatement(
    args: Expression[],
    start: Location,
    end: Location,
  ): ReadStatement {
    return { kind: "ReadStatement", arguments: args, start, end };
  }

  static createReturnStatement(
    values: Expression[],
    start: Location,
    end: Location,
  ): ReturnStatement {
    return { kind: "ReturnStatement", values, start, end };
  }
}
