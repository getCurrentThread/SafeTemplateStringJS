import { Lexer, Parser, Interpreter, TokenType, ASTNodeType } from '../safe-template-parser.js';

export const stringMethodTests = [
  {
    name: "String toUpperCase() Test",
    expression: "'hello'.toUpperCase()",
    data: {},
    expected: "HELLO",
  },
  {
    name: "String toLowerCase() Test",
    expression: "'WORLD'.toLowerCase()",
    data: {},
    expected: "world",
  },
  {
    name: "String substring() Test",
    expression: "'abcdef'.substring(1, 4)",
    data: {},
    expected: "bcd",
  },
  {
    name: "String length property Test",
    expression: "'test'.length",
    data: {},
    expected: 4,
  },
  {
    name: "String indexOf() Test",
    expression: "'hello world'.indexOf('world')",
    data: {},
    expected: 6,
  },
  {
    name: "String trim()",
    expression: "'  hello  '.trim()",
    data: {},
    expected: "hello",
  },
  {
    name: "String startsWith()",
    expression: "'hello world'.startsWith('hello')",
    data: {},
    expected: true,
  },
  {
    name: "String replace()",
    expression: "'hello'.replace('l', 'x')",
    data: {},
    expected: "hexlo",
  },
  {
    name: "String replaceAll()",
    expression: "'banana'.replaceAll('a', 'o')",
    data: {},
    expected: "bonono",
  },
  // New tests
  {
    name: "String endsWith()",
    expression: "'hello world'.endsWith('world')",
    data: {},
    expected: true,
  },
  {
    name: "String includes()",
    expression: "'hello world'.includes('lo')",
    data: {},
    expected: true,
  },
  {
    name: "String charAt()",
    expression: "'hello'.charAt(1)",
    data: {},
    expected: "e",
  },
  {
    name: "String concat()",
    expression: "'hello'.concat(' ', 'world')",
    data: {},
    expected: "hello world",
  },
  {
    name: "String slice()",
    expression: "'abcdef'.slice(1, 4)",
    data: {},
    expected: "bcd",
  },
  {
    name: "String repeat()",
    expression: "'abc'.repeat(2)",
    data: {},
    expected: "abcabc",
  },
];