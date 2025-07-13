const TokenType = Object.freeze({
  NUMBER: Symbol("NUMBER"),
  IDENTIFIER: Symbol("IDENTIFIER"),
  OPERATOR: Symbol("OPERATOR"),
  LEFT_PAREN: Symbol("LEFT_PAREN"),
  RIGHT_PAREN: Symbol("RIGHT_PAREN"),
  LEFT_BRACKET: Symbol("LEFT_BRACKET"),
  RIGHT_BRACKET: Symbol("RIGHT_BRACKET"),
  LEFT_BRACE: Symbol("LEFT_BRACE"),
  RIGHT_BRACE: Symbol("RIGHT_BRACE"),
  COLON: Symbol("COLON"),
  COMMA: Symbol("COMMA"),
  DOT: Symbol("DOT"),
  STRING: Symbol("STRING"),
  BOOLEAN: Symbol("BOOLEAN"),
  NULL: Symbol("NULL"),
  EOF: Symbol("EOF"),
});

const ASTNodeType = Object.freeze({
  NUMBER: Symbol("NUMBER"),
  VARIABLE: Symbol("VARIABLE"),
  BINARY_OP: Symbol("BINARY_OP"),
  UNARY_OP: Symbol("UNARY_OP"),
  FUNCTION_CALL: Symbol("FUNCTION_CALL"),
  ARRAY_ACCESS: Symbol("ARRAY_ACCESS"),
  PROPERTY_ACCESS: Symbol("PROPERTY_ACCESS"),
  TERNARY_OP: Symbol("TERNARY_OP"),
  ARRAY_LITERAL: Symbol("ARRAY_LITERAL"),
  OBJECT_LITERAL: Symbol("OBJECT_LITERAL"),
  NULL: Symbol("NULL"),
});

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
  }

  nextToken() {
    this.skipWhitespace();
    if (this.position >= this.input.length) {
      return new Token(TokenType.EOF, null);
    }

    const char = this.input[this.position];
    let token;

    if (char === '=' && this.input[this.position + 1] === '=' && this.input[this.position + 2] === '=') {
      this.advance();
      this.advance();
      this.advance();
      token = new Token(TokenType.OPERATOR, '===');
    } else if (char === '!' && this.input[this.position + 1] === '=' && this.input[this.position + 2] === '=') {
      this.advance();
      this.advance();
      this.advance();
      token = new Token(TokenType.OPERATOR, '!==');
    } else if (char === '=' && this.input[this.position + 1] === '=') {
      this.advance();
      this.advance();
      token = new Token(TokenType.OPERATOR, '==');
    } else if (char === '!' && this.input[this.position + 1] === '=') {
      this.advance();
      this.advance();
      token = new Token(TokenType.OPERATOR, '!=');
    } else if (char === '<' && this.input[this.position + 1] === '=') {
      this.advance();
      this.advance();
      token = new Token(TokenType.OPERATOR, '<=');
    } else if (char === '>' && this.input[this.position + 1] === '=') {
      this.advance();
      this.advance();
      token = new Token(TokenType.OPERATOR, '>=');
    } else if (char === '&' && this.input[this.position + 1] === '&') {
      this.advance();
      this.advance();
      token = new Token(TokenType.OPERATOR, '&&');
    } else if (char === '|' && this.input[this.position + 1] === '|') {
      this.advance();
      this.advance();
      token = new Token(TokenType.OPERATOR, '||');
    } else if (this.isDigit(char)) {
      token = this.readNumber();
    } else if (this.isAlpha(char)) {
      token = this.readIdentifier();
    } else if (this.isOperator(char)) {
      token = new Token(TokenType.OPERATOR, this.advance());
    } else if (char === "(") {
      token = new Token(TokenType.LEFT_PAREN, this.advance());
    } else if (char === ")") {
      token = new Token(TokenType.RIGHT_PAREN, this.advance());
    } else if (char === "[") {
      token = new Token(TokenType.LEFT_BRACKET, this.advance());
    } else if (char === "]") {
      token = new Token(TokenType.RIGHT_BRACKET, this.advance());
    } else if (char === ",") {
      token = new Token(TokenType.COMMA, this.advance());
    } else if (char === ".") {
      token = new Token(TokenType.DOT, this.advance());
    } else if (char === "?") {
      token = new Token(TokenType.OPERATOR, this.advance());
    } else if (char === ":") {
      token = new Token(TokenType.COLON, this.advance());
    } else if (char === "{") {
      token = new Token(TokenType.LEFT_BRACE, this.advance());
    } else if (char === "}") {
      token = new Token(TokenType.RIGHT_BRACE, this.advance());
    } else if (char === "'" || char === '"') {
      token = this.readString(char);
    } else {
      throw new Error(`Unexpected character: ${char}`);
    }
    return token;
  }

  readNumber() {
    let result = "";
    let hasDecimal = false;
    while (this.position < this.input.length) {
      const char = this.input[this.position];
      if (this.isDigit(char)) {
        result += this.advance();
      } else if (char === ".") {
        if (hasDecimal) {
          throw new Error(`Invalid number format: multiple decimal points in ${result + char}`);
        }
        hasDecimal = true;
        result += this.advance();
      } else {
        break;
      }
    }
    return new Token(TokenType.NUMBER, parseFloat(result));
  }

  readIdentifier() {
    let result = "";
    while (this.position < this.input.length && (this.isAlpha(this.input[this.position]) || this.isDigit(this.input[this.position]))) {
      result += this.advance();
    }

    if (result === 'true') {
      return new Token(TokenType.BOOLEAN, true);
    }
    if (result === 'false') {
      return new Token(TokenType.BOOLEAN, false);
    }
    if (result === 'null') {
      return new Token(TokenType.NULL, null);
    }

    return new Token(TokenType.IDENTIFIER, result);
  }

  readString(quoteType) {
    let result = "";
    this.advance(); // opening quote
    while (this.position < this.input.length && this.input[this.position] !== quoteType) {
      result += this.advance();
    }
    this.advance(); // closing quote
    return new Token(TokenType.STRING, result);
  }

  isDigit(char) {
    return char >= "0" && char <= "9";
  }

  isAlpha(char) {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || char === "_";
  }

  isOperator(char) {
    return ["+", "-", "*", "/", "%", "^", "<", ">", "!"].includes(char);
  }

  skipWhitespace() {
    while (this.position < this.input.length && /\s/.test(this.input[this.position])) {
      this.position++;
    }
  }

  advance() {
    return this.input[this.position++];
  }
}

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.nextToken();
  }

  parse() {
    const result = this.expression();
    if (this.currentToken.type !== TokenType.EOF) {
      throw new Error(`Unexpected token: ${this.currentToken.value}`);
    }
    return result;
  }

  expression() {
    return this.conditional();
  }

  conditional() {
    let node = this.logicalOr();

    if (this.currentToken.type === TokenType.OPERATOR && this.currentToken.value === '?') {
      this.eat(TokenType.OPERATOR);
      const trueExpr = this.expression();
      this.eat(TokenType.COLON); // Expecting ':'
      const falseExpr = this.expression();
      node = { type: ASTNodeType.TERNARY_OP, condition: node, trueExpr: trueExpr, falseExpr: falseExpr };
    }

    return node;
  }

  logicalOr() {
    let node = this.logicalAnd();

    while (this.currentToken.type === TokenType.OPERATOR && this.currentToken.value === '||') {
      const token = this.currentToken;
      this.eat(TokenType.OPERATOR);
      node = { type: ASTNodeType.BINARY_OP, left: node, op: token.value, right: this.logicalAnd() };
    }

    return node;
  }

  logicalAnd() {
    let node = this.comparison();

    while (this.currentToken.type === TokenType.OPERATOR && this.currentToken.value === '&&') {
      const token = this.currentToken;
      this.eat(TokenType.OPERATOR);
      node = { type: ASTNodeType.BINARY_OP, left: node, op: token.value, right: this.comparison() };
    }

    return node;
  }

  comparison() {
    let node = this.additive();

    while (this.currentToken.type === TokenType.OPERATOR && ['==', '!=', '<', '<=', '>', '>=', '===', '!=='].includes(this.currentToken.value)) {
      const token = this.currentToken;
      this.eat(TokenType.OPERATOR);
      node = { type: ASTNodeType.BINARY_OP, left: node, op: token.value, right: this.additive() };
    }

    return node;
  }

  additive() {
    let node = this.multiplicative();

    while (this.currentToken.type === TokenType.OPERATOR && (this.currentToken.value === "+" || this.currentToken.value === "-")) {
      const token = this.currentToken;
      this.eat(TokenType.OPERATOR);
      node = { type: ASTNodeType.BINARY_OP, left: node, op: token.value, right: this.multiplicative() };
    }

    return node;
  }

  multiplicative() {
    let node = this.exponential();

    while (this.currentToken.type === TokenType.OPERATOR && (this.currentToken.value === "*" || this.currentToken.value === "/" || this.currentToken.value === "%")) {
      const token = this.currentToken;
      this.eat(TokenType.OPERATOR);
      node = { type: ASTNodeType.BINARY_OP, left: node, op: token.value, right: this.exponential() };
    }

    return node;
  }

  exponential() {
    let node = this.unary();

    while (this.currentToken.type === TokenType.OPERATOR && this.currentToken.value === "^") {
      const token = this.currentToken;
      this.eat(TokenType.OPERATOR);
      node = { type: ASTNodeType.BINARY_OP, left: node, op: token.value, right: this.unary() };
    }

    return node;
  }

  unary() {
    let node;
    if (this.currentToken.type === TokenType.OPERATOR && (this.currentToken.value === "+" || this.currentToken.value === "-" || this.currentToken.value === "!")) {
      const token = this.currentToken;
      this.eat(TokenType.OPERATOR);
      node = { type: ASTNodeType.UNARY_OP, op: token.value, expr: this.unary() };
    } else {
      node = this.primary();
    }

    while (true) {
      if (this.currentToken.type === TokenType.DOT) {
        this.eat(TokenType.DOT);
        if (this.currentToken.type !== TokenType.IDENTIFIER) {
          throw new Error("Expected property name after '.'");
        }
        node = { type: ASTNodeType.PROPERTY_ACCESS, object: node, property: this.currentToken.value };
        this.eat(TokenType.IDENTIFIER);
      } else if (this.currentToken.type === TokenType.LEFT_BRACKET) {
        node = this.arrayAccess(node);
      } else if (this.currentToken.type === TokenType.LEFT_PAREN) {
        this.eat(TokenType.LEFT_PAREN);
        const args = this.argumentList();
        this.eat(TokenType.RIGHT_PAREN);
        node = { type: ASTNodeType.FUNCTION_CALL, callee: node, arguments: args };
      } else {
        break;
      }
    }
    return node;
  }

  primary() {
    let node;
    if (this.currentToken.type === TokenType.NUMBER) {
      const token = this.currentToken;
      this.eat(TokenType.NUMBER);
      node = { type: ASTNodeType.NUMBER, value: token.value };
    } else if (this.currentToken.type === TokenType.STRING) {
      const token = this.currentToken;
      this.eat(TokenType.STRING);
      node = { type: ASTNodeType.STRING, value: token.value };
    } else if (this.currentToken.type === TokenType.BOOLEAN) {
      const token = this.currentToken;
      this.eat(TokenType.BOOLEAN);
      node = { type: ASTNodeType.BOOLEAN, value: token.value };
    } else if (this.currentToken.type === TokenType.NULL) {
      const token = this.currentToken;
      this.eat(TokenType.NULL);
      node = { type: ASTNodeType.NULL, value: null };
    } else if (this.currentToken.type === TokenType.IDENTIFIER) {
      const token = this.currentToken;
      this.eat(TokenType.IDENTIFIER);
      node = { type: ASTNodeType.VARIABLE, name: token.value };
    } else if (this.currentToken.type === TokenType.LEFT_PAREN) {
      this.eat(TokenType.LEFT_PAREN);
      node = this.expression();
      this.eat(TokenType.RIGHT_PAREN);
    } else if (this.currentToken.type === TokenType.LEFT_BRACKET) {
      node = this.parseArrayLiteral();
    } else if (this.currentToken.type === TokenType.LEFT_BRACE) {
      node = this.parseObjectLiteral();
    } else {
      throw new Error(`Unexpected token: ${this.currentToken.value}`);
    }
    return node;
  }

  argumentList() {
    const args = [];
    if (this.currentToken.type !== TokenType.RIGHT_PAREN) {
      args.push(this.expression());
      while (this.currentToken.type === TokenType.COMMA) {
        this.eat(TokenType.COMMA);
        args.push(this.expression());
      }
    }
    return args;
  }

  arrayAccess(node) {
    this.eat(TokenType.LEFT_BRACKET);
    const index = this.expression();
    this.eat(TokenType.RIGHT_BRACKET);
    return { type: ASTNodeType.ARRAY_ACCESS, array: node, index: index };
  }

  parseArrayLiteral() {
    this.eat(TokenType.LEFT_BRACKET);
    const elements = [];
    if (this.currentToken.type !== TokenType.RIGHT_BRACKET) {
      elements.push(this.expression());
      while (this.currentToken.type === TokenType.COMMA) {
        this.eat(TokenType.COMMA);
        elements.push(this.expression());
      }
    }
    this.eat(TokenType.RIGHT_BRACKET);
    return { type: ASTNodeType.ARRAY_LITERAL, elements: elements };
  }

  parseObjectLiteral() {
    this.eat(TokenType.LEFT_BRACE);
    const properties = [];

    // Check for empty object literal {}
    if (this.currentToken.type === TokenType.RIGHT_BRACE) {
      this.eat(TokenType.RIGHT_BRACE);
      return { type: ASTNodeType.OBJECT_LITERAL, properties: properties };
    }

    // Parse at least one key-value pair
    let key;
    if (this.currentToken.type === TokenType.IDENTIFIER) {
        key = this.currentToken.value;
        this.eat(TokenType.IDENTIFIER);
      } else if (this.currentToken.type === TokenType.STRING) {
        key = this.currentToken.value;
        this.eat(TokenType.STRING);
      } else if (this.currentToken.type === TokenType.NUMBER) {
        key = this.currentToken.value.toString(); // Convert number to string for key
        this.eat(TokenType.NUMBER);
      } else {
        throw new Error(`Expected identifier, string, or number for object key, got ${this.currentToken.type.description}`);
      }
    this.eat(TokenType.COLON);
    const value = this.expression();
    properties.push({ key: key, value: value });

    // Parse remaining key-value pairs separated by commas
    while (this.currentToken.type === TokenType.COMMA) {
      this.eat(TokenType.COMMA);
      // Handle trailing comma (optional in some JS contexts, but our parser is strict)
      if (this.currentToken.type === TokenType.RIGHT_BRACE) {
        break; // Allow trailing comma
      }

      if (this.currentToken.type === TokenType.IDENTIFIER) {
        key = this.currentToken.value;
        this.eat(TokenType.IDENTIFIER);
      } else if (this.currentToken.type === TokenType.STRING) {
        key = this.currentToken.value;
        this.eat(TokenType.STRING);
      } else if (this.currentToken.type === TokenType.NUMBER) {
        key = this.currentToken.value.toString(); // Convert number to string for key
        this.eat(TokenType.NUMBER);
      } else {
        throw new Error(`Expected identifier, string, or number for object key after comma, got ${this.currentToken.type.description}`);
      }
      this.eat(TokenType.COLON);
      const value = this.expression();
      properties.push({ key: key, value: value });
    }

    this.eat(TokenType.RIGHT_BRACE); // Expect closing brace
    return { type: ASTNodeType.OBJECT_LITERAL, properties: properties };
  }

  eat(tokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.nextToken();
    } else {
      throw new Error(`Expected ${tokenType.description}, got ${this.currentToken.type.description}`);
    }
  }
}

class Interpreter {
  constructor(tree, data, allowedFunctions = {}) {
    this.tree = tree;
    this.data = data;
    this.allowedFunctions = allowedFunctions;
  }

  interpret() {
    return this.visit(this.tree);
  }

  visit(node) {
    switch (node.type) {
      case ASTNodeType.NUMBER:
        return node.value;
      case ASTNodeType.STRING:
        return node.value;
      case ASTNodeType.BOOLEAN:
        return node.value;
      case ASTNodeType.NULL:
        return null;
      case ASTNodeType.TERNARY_OP:
        const condition = this.visit(node.condition);
        return condition ? this.visit(node.trueExpr) : this.visit(node.falseExpr);
      case ASTNodeType.ARRAY_LITERAL:
        return node.elements.map(element => this.visit(element));
      case ASTNodeType.OBJECT_LITERAL:
        const obj = {};
        node.properties.forEach(prop => {
          obj[prop.key] = this.visit(prop.value);
        });
        return obj;
      case ASTNodeType.VARIABLE:
        return this.getValueFromData(node.name, this.data);
      case ASTNodeType.BINARY_OP:
        return this.visitBinaryOp(node);
      case ASTNodeType.UNARY_OP:
        return this.visitUnaryOp(node);
      case ASTNodeType.FUNCTION_CALL:
        return this.visitFunctionCall(node);
      case ASTNodeType.ARRAY_ACCESS:
        return this.visitArrayAccess(node);
      case ASTNodeType.PROPERTY_ACCESS:
        return this.visitPropertyAccess(node);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  visitArrayAccess(node) {
    const collection = this.visit(node.array);
    const key = this.visit(node.index);

    // Handle array access with numeric index
    if (Array.isArray(collection)) {
      if (typeof key !== 'number' || key < 0 || key >= collection.length) {
        return undefined; // Return undefined for out-of-bounds access
      }
      return collection[key];
    }

    // Handle object property access with string or numeric key
    if (typeof collection === 'object' && collection !== null && (typeof key === 'string' || typeof key === 'number')) {
      const propKey = String(key); // Convert numeric key to string for object access
      if (Object.prototype.hasOwnProperty.call(collection, propKey)) {
        return collection[propKey];
      }
      return undefined; // Return undefined for non-existent property
    }

    return undefined; // Return undefined for other cases where property access is not valid
  }

  visitPropertyAccess(node) {
    const obj = this.visit(node.object);
    const prop = node.property;

    // Handle string properties/methods
    if (typeof obj === 'string') {
      if (prop === 'length') {
        return obj.length;
      }
      if (typeof String.prototype[prop] === 'function') {
        // Return a function that can be called later by visitFunctionCall
        return (...args) => obj[prop](...args);
      } else {
        throw new Error(`Cannot access property '${prop}' of "${obj}"`);
      }
    }

    // Handle properties on other primitive types (numbers, booleans, null, undefined)
    if (obj === null || typeof obj === 'undefined' || typeof obj === 'number' || typeof obj === 'boolean') {
      return undefined; // Properties on primitives (except string methods) are undefined
    }

    // Original object property access
    if (typeof obj === "object" && obj.hasOwnProperty(prop)) {
      return obj[prop];
    }
    return undefined; // Return undefined for non-existent property

    // Handle properties on other primitive types (numbers, booleans, null, undefined)
    if (obj === null || typeof obj === 'undefined' || typeof obj === 'number' || typeof obj === 'boolean') {
      return undefined; // Properties on primitives (except string methods) are undefined
    }

    // Original object property access
    if (typeof obj === "object" && obj.hasOwnProperty(prop)) {
      return obj[prop];
    }
    return undefined; // Return undefined for non-existent property
  }

  visitBinaryOp(node) {
    if (node.op === '&&') {
      return this.visit(node.left) && this.visit(node.right);
    }
    if (node.op === '||') {
      return this.visit(node.left) || this.visit(node.right);
    }

    const left = this.visit(node.left);
    const right = this.visit(node.right);
    switch (node.op) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "%":
        return left % right;
      case "^":
        return Math.pow(left, right);
      case "==":
        return left == right;
      case "===":
        return left === right;
      case "!=":
        return left != right;
      case "!==":
        return left !== right;
      case "<":
        return left < right;
      case "<=":
        return left <= right;
      case ">":
        return left > right;
      case ">=":
        return left >= right;
      default:
        throw new Error(`Unknown operator: ${node.op}`);
    }
  }

  visitUnaryOp(node) {
    const expr = this.visit(node.expr);
    switch (node.op) {
      case "+":
        return +expr;
      case "-":
        return -expr;
      case "!":
        return !expr;
      default:
        throw new Error(`Unknown unary operator: ${node.op}`);
    }
  }

  visitFunctionCall(node) {
    let calleeFunction;
    const args = node.arguments.map((arg) => this.visit(arg));

    if (node.callee.type === ASTNodeType.VARIABLE) {
      const functionName = node.callee.name;

      // Check for built-in functions first
      switch (functionName.toLowerCase()) {
        case "min":
          calleeFunction = Math.min;
          break;
        case "max":
          calleeFunction = Math.max;
          break;
        case "abs":
          calleeFunction = Math.abs;
          break;
        case "round":
          calleeFunction = Math.round;
          break;
        case "floor":
          calleeFunction = Math.floor;
          break;
        case "ceil":
          calleeFunction = Math.ceil;
          break;
        default:
          // If not a built-in, try to get it from allowedFunctions
          calleeFunction = this.allowedFunctions[functionName];
          break;
      }
    } else {
      // For property access or other complex callees, evaluate them
      calleeFunction = this.visit(node.callee);
    }

    if (typeof calleeFunction === 'function') {
      return calleeFunction(...args);
    }
    
    throw new Error(`Unknown function or non-callable: ${JSON.stringify(node.callee.name || calleeFunction)}`);
  }

  getValueFromData(key, data) {
    // The parser already handles nested property access through PROPERTY_ACCESS nodes.
    // This function should only retrieve a value from the top-level of the current data context.
    if (data && data.hasOwnProperty(key)) {
      return data[key];
    }
    throw new Error(`Undefined variable: ${key}`);
  }
}

function parseTemplateString(templateString, data, allowedFunctions = {}) {
  const regex = /\{\{(.+?)\}\}/g;

  return templateString.replace(regex, (match, expression) => {
    try {
      const lexer = new Lexer(expression.trim());
      const parser = new Parser(lexer);
      const tree = parser.parse();
      const interpreter = new Interpreter(tree, data, allowedFunctions);
      return interpreter.interpret();
    } catch (error) {
      console.error(`Error evaluating expression: ${expression}`, error);
      return match; // 오류 발생 시 원래 텍스트 반환
    }
  });
}

// Support for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = {
    parseTemplateString,
    TokenType,
    ASTNodeType,
    Token,
    Lexer,
    Parser,
    Interpreter
  };
} else if (typeof exports !== 'undefined') {
  // CommonJS (alternative)
  exports.parseTemplateString = parseTemplateString;
  exports.TokenType = TokenType;
  exports.ASTNodeType = ASTNodeType;
  exports.Token = Token;
  exports.Lexer = Lexer;
  exports.Parser = Parser;
  exports.Interpreter = Interpreter;
} else if (typeof define === 'function' && define.amd) {
  // AMD
  define([], function() {
    return {
      parseTemplateString,
      TokenType,
      ASTNodeType,
      Token,
      Lexer,
      Parser,
      Interpreter
    };
  });
} else if (typeof window !== 'undefined') {
  // Browser global
  window.parseTemplateString = parseTemplateString;
  window.TokenType = TokenType;
  window.ASTNodeType = ASTNodeType;
  window.Token = Token;
  window.Lexer = Lexer;
  window.Parser = Parser;
  window.Interpreter = Interpreter;
}

// ES modules
export {
  parseTemplateString,
  TokenType,
  ASTNodeType,
  Token,
  Lexer,
  Parser,
  Interpreter
};


""
