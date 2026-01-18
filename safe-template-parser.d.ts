/**
 * TypeScript type definitions for safe-template-parser
 * A safe template string parser for JavaScript
 */

/**
 * Token types used by the Lexer
 */
export const TokenType: {
  readonly NUMBER: symbol;
  readonly IDENTIFIER: symbol;
  readonly OPERATOR: symbol;
  readonly LEFT_PAREN: symbol;
  readonly RIGHT_PAREN: symbol;
  readonly LEFT_BRACKET: symbol;
  readonly RIGHT_BRACKET: symbol;
  readonly LEFT_BRACE: symbol;
  readonly RIGHT_BRACE: symbol;
  readonly COLON: symbol;
  readonly COMMA: symbol;
  readonly DOT: symbol;
  readonly STRING: symbol;
  readonly BOOLEAN: symbol;
  readonly NULL: symbol;
  readonly EOF: symbol;
};

/**
 * AST node types used by the Parser
 */
export const ASTNodeType: {
  readonly NUMBER: symbol;
  readonly VARIABLE: symbol;
  readonly BINARY_OP: symbol;
  readonly UNARY_OP: symbol;
  readonly FUNCTION_CALL: symbol;
  readonly ARRAY_ACCESS: symbol;
  readonly PROPERTY_ACCESS: symbol;
  readonly TERNARY_OP: symbol;
  readonly ARRAY_LITERAL: symbol;
  readonly OBJECT_LITERAL: symbol;
  readonly NULL: symbol;
};

/**
 * Represents a single token produced by the Lexer
 */
export class Token {
  type: symbol;
  value: string | number | boolean | null;
  constructor(type: symbol, value: string | number | boolean | null);
}

/**
 * AST Node interface representing parsed expression tree nodes
 */
export interface ASTNode {
  type: symbol;
  value?: string | number | boolean | null;
  left?: ASTNode;
  right?: ASTNode;
  operator?: string;
  name?: string;
  args?: ASTNode[];
  object?: ASTNode;
  property?: string | ASTNode;
  condition?: ASTNode;
  trueExpr?: ASTNode;
  falseExpr?: ASTNode;
  elements?: ASTNode[];
  properties?: Array<{ key: string; value: ASTNode }>;
}

/**
 * Lexer class that tokenizes input strings into tokens
 */
export class Lexer {
  /**
   * Creates a new Lexer instance
   * @param input - The input string to tokenize
   */
  constructor(input: string);

  /**
   * Returns the next token from the input
   */
  nextToken(): Token;
}

/**
 * Parser class that converts tokens into an Abstract Syntax Tree (AST)
 */
export class Parser {
  /**
   * Creates a new Parser instance
   * @param lexer - The Lexer instance to read tokens from
   */
  constructor(lexer: Lexer);

  /**
   * Parses the token stream and returns the root AST node
   */
  parse(): ASTNode;
}

/**
 * Type for allowed functions that can be used in templates
 */
export type AllowedFunctions = Record<string, (...args: unknown[]) => unknown>;

/**
 * Type for template data object
 */
export type TemplateData = Record<string, unknown>;

/**
 * Interpreter class that evaluates an AST with given data
 */
export class Interpreter {
  /**
   * Creates a new Interpreter instance
   * @param tree - The AST to interpret
   * @param data - The data object containing variable values
   * @param allowedFunctions - Optional map of allowed functions
   */
  constructor(
    tree: ASTNode,
    data: TemplateData,
    allowedFunctions?: AllowedFunctions
  );

  /**
   * Interprets the AST and returns the result
   */
  interpret(): unknown;
}

/**
 * Parses a template string and replaces expressions with evaluated values
 *
 * @param templateString - The template string containing {{expression}} placeholders
 * @param data - The data object containing variable values
 * @param allowedFunctions - Optional map of user-defined functions
 * @returns The template string with all expressions evaluated and replaced
 *
 * @example
 * ```typescript
 * import { parseTemplateString } from 'safe-template-parser';
 *
 * const template = "Hello, {{name}}! You have {{count}} messages.";
 * const data = { name: "Alice", count: 5 };
 * const result = parseTemplateString(template, data);
 * // Result: "Hello, Alice! You have 5 messages."
 * ```
 *
 * @example
 * ```typescript
 * // With expressions
 * const template = "Total: {{price * quantity}}";
 * const data = { price: 100, quantity: 3 };
 * const result = parseTemplateString(template, data);
 * // Result: "Total: 300"
 * ```
 *
 * @example
 * ```typescript
 * // With custom functions
 * const template = "Formatted: {{formatCurrency(amount)}}";
 * const data = { amount: 1234.56 };
 * const functions = {
 *   formatCurrency: (n: number) => `$${n.toFixed(2)}`
 * };
 * const result = parseTemplateString(template, data, functions);
 * // Result: "Formatted: $1234.56"
 * ```
 */
export function parseTemplateString(
  templateString: string,
  data: TemplateData,
  allowedFunctions?: AllowedFunctions
): string;

export default parseTemplateString;
