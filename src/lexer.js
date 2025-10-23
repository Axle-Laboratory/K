// src/lexer.js

export class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

export class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.tokens = [];
  }

  isWhitespace(char) {
    return /\s/.test(char);
  }

  isLetter(char) {
    return /[a-zA-Z]/.test(char);
  }

  isDigit(char) {
    return /[0-9]/.test(char);
  }

  isQuote(char) {
    return char === '"' || char === "'";
  }

  readWhile(condition) {
    let result = '';
    while (this.position < this.input.length && condition(this.input[this.position])) {
      result += this.input[this.position++];
    }
    return result;
  }

  readIdentifier() {
    return new Token('IDENTIFIER', this.readWhile(char => this.isLetter(char) || this.isDigit(char) || char === '_'));
  }

  readNumber() {
    return new Token('NUMBER', this.readWhile(char => this.isDigit(char)));
  }

  readString() {
    const quote = this.input[this.position++];
    let result = '';
    while (this.position < this.input.length && this.input[this.position] !== quote) {
      result += this.input[this.position++];
    }
    this.position++; // skip closing quote
    return new Token('STRING', result);
  }

  tokenize() {
    while (this.position < this.input.length) {
      const char = this.input[this.position];

      if (this.isWhitespace(char)) {
        this.position++;
        continue;
      }

      if (this.isLetter(char)) {
        this.tokens.push(this.readIdentifier());
        continue;
      }

      if (this.isDigit(char)) {
        this.tokens.push(this.readNumber());
        continue;
      }

      if (this.isQuote(char)) {
        this.tokens.push(this.readString());
        continue;
      }

      switch (char) {
        case '{':
          this.tokens.push(new Token('LBRACE', '{'));
          break;
        case '}':
          this.tokens.push(new Token('RBRACE', '}'));
          break;
        case '(':
          this.tokens.push(new Token('LPAREN', '('));
          break;
        case ')':
          this.tokens.push(new Token('RPAREN', ')'));
          break;
        case ',':
          this.tokens.push(new Token('COMMA', ','));
          break;
        default:
          this.tokens.push(new Token('SYMBOL', char));
          break;
      }

      this.position++;
    }

    return this.tokens;
  }
}
