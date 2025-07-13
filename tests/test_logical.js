import { Lexer, Parser, Interpreter, TokenType, ASTNodeType } from '../safe-template-parser.js';

export const logicalTests = [
  {
    name: "Logical AND Test (true)",
    expression: "10 > 5 && true",
    data: {},
    expected: true,
  },
  {
    name: "Logical AND Test (false)",
    expression: "10 < 5 && true",
    data: {},
    expected: false,
  },
  {
    name: "Logical OR Test (true)",
    expression: "10 < 5 || true",
    data: {},
    expected: true,
  },
  {
    name: "Logical NOT Test",
    expression: "!false",
    data: {},
    expected: true,
  },
  {
    name: "Complex Logical Test",
    expression: "(10 > 5 && 'a' == 'a') || !true",
    data: {},
    expected: true,
  },
  {
    name: "Logical AND with numbers",
    expression: "5 && 0",
    data: {},
    expected: 0,
  },
  {
    name: "Logical OR with strings",
    expression: "'' || 'fallback'",
    data: {},
    expected: "fallback",
  },
  {
    name: "Nested Ternary Operator",
    expression: "true ? (false ? 'A' : 'B') : 'C'",
    data: {},
    expected: "B",
  },
  {
    name: "Ternary Operator Test (true case)",
    expression: "10 > 5 ? 'Greater' : 'Smaller'",
    data: {},
    expected: "Greater",
  },
  {
    name: "Ternary Operator Test (false case)",
    expression: "10 < 5 ? 'Greater' : 'Smaller'",
    data: {},
    expected: "Smaller",
  },
  {
    name: "Ternary Operator with variables",
    expression: "age > 18 ? 'Adult' : 'Minor'",
    data: { age: 20 },
    expected: "Adult",
  },
  // New tests
  {
    name: "Logical NOT on number",
    expression: "!0",
    data: {},
    expected: true,
  },
  {
    name: "Logical NOT on string",
    expression: "!'hello'",
    data: {},
    expected: false,
  },
  {
    name: "Logical AND with null",
    expression: "null && true",
    data: {},
    expected: null,
  },
  {
    name: "Logical OR with null",
    expression: "null || 'default'",
    data: {},
    expected: "default",
  },
  {
    name: "Ternary with null condition",
    expression: "null ? 'A' : 'B'",
    data: {},
    expected: "B",
  },
  {
    name: "Ternary with numeric condition",
    expression: "1 ? 'A' : 'B'",
    data: {},
    expected: "A",
  },
];