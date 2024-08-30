class TokenType {
  static NUMBER = "NUMBER";
  static IDENTIFIER = "IDENTIFIER";
  static OPERATOR = "OPERATOR";
  static LEFT_PAREN = "LEFT_PAREN";
  static RIGHT_PAREN = "RIGHT_PAREN";
  static COMMA = "COMMA";
  static EOF = "EOF";
}

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

    if (this.isDigit(char)) {
      return this.readNumber();
    } else if (this.isAlpha(char)) {
      return this.readIdentifier();
    } else if (this.isOperator(char)) {
      return new Token(TokenType.OPERATOR, this.advance());
    } else if (char === "(") {
      return new Token(TokenType.LEFT_PAREN, this.advance());
    } else if (char === ")") {
      return new Token(TokenType.RIGHT_PAREN, this.advance());
    } else if (char === ",") {
      return new Token(TokenType.COMMA, this.advance());
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  readNumber() {
    let result = "";
    while (this.position < this.input.length && (this.isDigit(this.input[this.position]) || this.input[this.position] === ".")) {
      result += this.advance();
    }
    return new Token(TokenType.NUMBER, parseFloat(result));
  }

  readIdentifier() {
    let result = "";
    while (this.position < this.input.length && (this.isAlpha(this.input[this.position]) || this.isDigit(this.input[this.position]) || this.input[this.position] === ".")) {
      result += this.advance();
    }
    return new Token(TokenType.IDENTIFIER, result);
  }

  isDigit(char) {
    return char >= "0" && char <= "9";
  }

  isAlpha(char) {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || char === "_";
  }

  isOperator(char) {
    return ["+", "-", "*", "/", "%", "^"].includes(char);
  }

  skipWhitespace() {
    while (this.position < this.input.length && this.input[this.position] === " ") {
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
    return this.additive();
  }

  additive() {
    let node = this.multiplicative();

    while (this.currentToken.type === TokenType.OPERATOR && (this.currentToken.value === "+" || this.currentToken.value === "-")) {
      const token = this.currentToken;
      this.eat(TokenType.OPERATOR);
      node = { type: "BinaryOp", left: node, op: token.value, right: this.multiplicative() };
    }

    return node;
  }

  multiplicative() {
    let node = this.exponential();

    while (this.currentToken.type === TokenType.OPERATOR && (this.currentToken.value === "*" || this.currentToken.value === "/" || this.currentToken.value === "%")) {
      const token = this.currentToken;
      this.eat(TokenType.OPERATOR);
      node = { type: "BinaryOp", left: node, op: token.value, right: this.exponential() };
    }

    return node;
  }

  exponential() {
    let node = this.unary();

    while (this.currentToken.type === TokenType.OPERATOR && this.currentToken.value === "^") {
      const token = this.currentToken;
      this.eat(TokenType.OPERATOR);
      node = { type: "BinaryOp", left: node, op: token.value, right: this.unary() };
    }

    return node;
  }

  unary() {
    if (this.currentToken.type === TokenType.OPERATOR && (this.currentToken.value === "+" || this.currentToken.value === "-")) {
      const token = this.currentToken;
      this.eat(TokenType.OPERATOR);
      return { type: "UnaryOp", op: token.value, expr: this.unary() };
    }
    return this.primary();
  }

  primary() {
    if (this.currentToken.type === TokenType.NUMBER) {
      const token = this.currentToken;
      this.eat(TokenType.NUMBER);
      return { type: "Number", value: token.value };
    } else if (this.currentToken.type === TokenType.IDENTIFIER) {
      const token = this.currentToken;
      this.eat(TokenType.IDENTIFIER);
      if (this.currentToken.type === TokenType.LEFT_PAREN) {
        return this.functionCall(token.value);
      }
      return { type: "Variable", name: token.value };
    } else if (this.currentToken.type === TokenType.LEFT_PAREN) {
      this.eat(TokenType.LEFT_PAREN);
      const node = this.expression();
      this.eat(TokenType.RIGHT_PAREN);
      return node;
    }

    throw new Error(`Unexpected token: ${this.currentToken.value}`);
  }

  functionCall(name) {
    this.eat(TokenType.LEFT_PAREN);
    const args = this.argumentList();
    this.eat(TokenType.RIGHT_PAREN);
    return { type: "FunctionCall", name: name, arguments: args };
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

  eat(tokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.nextToken();
    } else {
      throw new Error(`Expected ${tokenType}, got ${this.currentToken.type}`);
    }
  }
}

class Interpreter {
  constructor(tree, data) {
    this.tree = tree;
    this.data = data;
  }

  interpret() {
    return this.visit(this.tree);
  }

  visit(node) {
    if (node.type === "Number") {
      return node.value;
    } else if (node.type === "Variable") {
      return this.getValueFromData(node.name, this.data);
    } else if (node.type === "BinaryOp") {
      return this.visitBinaryOp(node);
    } else if (node.type === "UnaryOp") {
      return this.visitUnaryOp(node);
    } else if (node.type === "FunctionCall") {
      return this.visitFunctionCall(node);
    }
    throw new Error(`Unknown node type: ${node.type}`);
  }

  visitBinaryOp(node) {
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
      default:
        throw new Error(`Unknown unary operator: ${node.op}`);
    }
  }

  visitFunctionCall(node) {
    const args = node.arguments.map((arg) => this.visit(arg));
    switch (node.name.toLowerCase()) {
      case "min":
        return Math.min(...args);
      case "max":
        return Math.max(...args);
      case "abs":
        return Math.abs(args[0]);
      case "round":
        return Math.round(args[0]);
      case "floor":
        return Math.floor(args[0]);
      case "ceil":
        return Math.ceil(args[0]);
      default:
        throw new Error(`Unknown function: ${node.name}`);
    }
  }

  getValueFromData(key, data) {
    const keys = key.split(".");
    let value = data;
    for (const k of keys) {
      if (value && value.hasOwnProperty(k)) {
        value = value[k];
      } else {
        throw new Error(`Undefined variable: ${key}`);
      }
    }
    return value;
  }
}

function parseTemplateString(templateString, data) {
  const regex = /\{\{(.+?)\}\}/g;

  return templateString.replace(regex, (match, expression) => {
    try {
      const lexer = new Lexer(expression.trim());
      const parser = new Parser(lexer);
      const tree = parser.parse();
      const interpreter = new Interpreter(tree, data);
      return interpreter.interpret();
    } catch (error) {
      console.error(`Error evaluating expression: ${expression}`, error);
      return match; // 오류 발생 시 원래 텍스트 반환
    }
  });
}

// // 사용 예시
// const template =
//   "안녕하세요, {{name}}님. 당신의 나이는 {{age}}세이고, {{address.city}}에 살고 계시네요. " +
//   "5년 후의 나이는 {{age + 5}}세입니다. " +
//   "10년 전의 나이는 {{age - 10}}세였습니다. " +
//   "나이를 2배로 하면 {{age * 2}}세입니다. " +
//   "나이의 제곱근은 {{round(abs(age) ^ 0.5)}}입니다. " +
//   "당신과 친구들 중 가장 나이가 많은 사람은 {{max(age, friendAge1, friendAge2)}}세입니다.";
//
// const data = {
//   name: "홍길동",
//   age: 30,
//   address: {
//     city: "서울",
//   },
//   friendAge1: 28,
//   friendAge2: 35,
// };
//
// const result = parseTemplateString(template, data);
// console.log(result);
