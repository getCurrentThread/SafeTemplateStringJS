import { Lexer, Parser, Interpreter, TokenType, ASTNodeType } from '../safe-template-parser.js';

export const errorFunctionTests = [
  {
    name: "Function Call with Multiple Args",
    expression: "max(10, 20, 5)",
    data: {},
    expected: 20,
  },
  {
    name: "Custom Function Call",
    expression: "add(5, 3)",
    data: { add: (a, b) => a + b },
    expected: 8,
  },
  {
    name: "Function Call with too few arguments",
    expression: "min(10)",
    data: {},
    expected: 10,
  },
  {
    name: "Function Call with too many arguments",
    expression: "abs(10, 20)",
    data: {},
    expected: 10,
  },
  {
    name: "Math.floor()",
    expression: "floor(5.9)",
    data: {},
    expected: 5,
  },
  {
    name: "Math.ceil()",
    expression: "ceil(5.1)",
    data: {},
    expected: 6,
  },
  {
    name: "Undefined Variable Access (should throw error)",
    expression: "nonExistentVar",
    data: {},
    expectedError: "Undefined variable: nonExistentVar",
  },
  {
    name: "Syntax Error Test (unclosed parenthesis)",
    expression: "(1 + 2",
    data: {},
    expectedError: "Expected RIGHT_PAREN, got EOF",
  },
  {
    name: "Invalid Operator Test",
    expression: "10 @ 5",
    data: {},
    expectedError: "Unexpected character: @",
  },
  {
    name: "Array Access Out of Bounds",
    expression: "[1,2,3][5]",
    data: {},
    expected: undefined,
  },
  {
    name: "Property Access on Null",
    expression: "nullVar.prop",
    data: { nullVar: null },
    expected: undefined,
  },
  {
    name: "Method Call on Non-Function",
    expression: "'string'.toFixed()",
    data: {},
    expectedError: "Cannot access property 'toFixed' of \"string\"",
  },
  {
    name: "Undefined variable in expression",
    expression: "1 + undefinedVar",
    data: {},
    expectedError: "Undefined variable: undefinedVar",
  },
  // New tests
  {
    name: "Accessing property on undefined variable",
    expression: "undefinedVar.prop",
    data: {},
    expectedError: "Undefined variable: undefinedVar",
  },
  {
    name: "Calling non-existent method on object",
    expression: "{}.nonExistentMethod()",
    data: {},
    expectedError: "Unknown function or non-callable: undefined",
  },
  {
    name: "Invalid number format",
    expression: "1.2.3",
    data: {},
    expectedError: "Invalid number format: multiple decimal points in 1.2.",
  },
  {
    name: "Unexpected token in expression",
    expression: "10 + * 5",
    data: {},
    expectedError: "Unexpected token: *",
  },
  {
    name: "Accessing property on a number",
    expression: "10.toFixed()",
    data: {},
    expectedError: "Unexpected token: toFixed",
  },
  {
    name: "Invalid function call syntax",
    expression: "myFunc(1,)",
    data: { myFunc: (a) => a },
    expectedError: "Unexpected token: )",
  },
  {
    name: "Calling function from data (should fail)",
    expression: "maliciousFunction()",
    data: { maliciousFunction: () => { console.log('Malicious code executed!'); } },
    expectedError: "Unknown function or non-callable: \"maliciousFunction\"",
  },
];
