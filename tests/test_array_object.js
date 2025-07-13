import { Lexer, Parser, Interpreter, TokenType, ASTNodeType } from '../safe-template-parser.js';

export const arrayObjectTests = [
  {
    name: "Array Literal Test",
    expression: "[1, 'two', true]",
    data: {},
    expected: [1, 'two', true],
  },
  {
    name: "Object Literal Test",
    expression: "{a: 1, b: 'hello'}.a",
    data: {},
    expected: 1,
  },
  {
    name: "Nested Object Literal Test",
    expression: "{user: {name: 'Alice'}}.user.name",
    data: {},
    expected: "Alice",
  },
  {
    name: "Array of Objects Test",
    expression: "[{id: 1}, {id: 2}][1].id",
    data: {},
    expected: 2,
  },
  {
    name: "Empty Array Literal",
    expression: "[]",
    data: {},
    expected: [],
  },
  {
    name: "Empty Object Literal",
    expression: "{}",
    data: {},
    expected: {},
  },
  {
    name: "Array with Mixed Types",
    expression: "[1, 'test', true, null]",
    data: {},
    expected: [1, 'test', true, null],
  },
  {
    name: "Object with Numeric Key",
    expression: "{'1': 'value'}['1']",
    data: {},
    expected: "value",
  },
  {
    name: "Variable in Object Literal",
    expression: "{name: myName}.name",
    data: { myName: "Test" },
    expected: "Test",
  },
  {
    name: "Object Literal with mixed key types",
    expression: "{'key': 1, 2: 'value'}['key']",
    data: {},
    expected: 1,
  },
  {
    name: "Object Literal with mixed key types 2",
    expression: "{'key': 1, 2: 'value'}[2]",
    data: {},
    expected: "value",
  },
  {
    name: "Accessing nested array element",
    expression: "[[1,2],[3,4]][0][1]",
    data: {},
    expected: 2,
  },
  {
    name: "Accessing nested object property",
    expression: "{a: {b: {c: 10}}}.a.b.c",
    data: {},
    expected: 10,
  },
  {
    name: "Boolean literal in array",
    expression: "[true, false][0]",
    data: {},
    expected: true,
  },
  {
    name: "Null literal in array",
    expression: "[null, 'test'][0]",
    data: {},
    expected: null,
  },
  // New tests
  {
    name: "Array length property",
    expression: "[1,2,3].length",
    data: {},
    expected: 3,
  },
  
  {
    name: "Accessing non-existent array index",
    expression: "[1,2,3][5]",
    data: {},
    expected: undefined,
  },
  {
    name: "Accessing non-existent object property",
    expression: "{a:1}.b",
    data: {},
    expected: undefined,
  },
  {
    name: "Array of arrays",
    expression: "[[1,2],[3,4]]",
    data: {},
    expected: [[1,2],[3,4]],
  },
  {
    name: "Object with nested objects and arrays",
    expression: "{data: {users: [{id:1, name:'A'},{id:2, name:'B'}]}}.data.users[0].name",
    data: {},
    expected: "A",
  },
];