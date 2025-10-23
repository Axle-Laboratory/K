// src/parser.js

export class ASTNode {
  constructor(type, props = {}) {
    this.type = type;
    Object.assign(this, props);
  }
}

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek(offset = 0) {
    return this.tokens[this.position + offset];
  }

  consume(expectedType = null) {
    const token = this.tokens[this.position++];
    if (expectedType && token.type !== expectedType) {
      throw new Error(`Expected ${expectedType}, got ${token.type}`);
    }
    return token;
  }

  parseScene() {
    this.consume('IDENTIFIER'); // 'scene'
    const name = this.consume('IDENTIFIER').value;
    this.consume('LBRACE');

    const body = [];

    while (this.peek().type !== 'RBRACE') {
      const next = this.peek();
      if (next.value === 'pad') {
        body.push(this.parsePad());
      } else if (next.value === 'panel') {
        body.push(this.parsePanel());
      } else if (next.value === 'trigger') {
        body.push(this.parseTrigger());
      } else {
        throw new Error(`Unknown scene element: ${next.value}`);
      }
    }

    this.consume('RBRACE');

    return new ASTNode('Scene', { name, body });
  }

  parsePad() {
    this.consume(); // 'pad'
    const id = this.consume('IDENTIFIER').value;
    this.consume(); // 'color'
    const colorValue = this.consume('IDENTIFIER').value;
    this.consume(); // 'trigger'
    const triggerCall = this.consume('IDENTIFIER').value;
    this.consume('LPAREN');
    const arg = this.consume('STRING').value;
    this.consume('RPAREN');

    return new ASTNode('Pad', {
      id,
      color: colorValue,
      trigger: { call: triggerCall, arg }
    });
  }

  parsePanel() {
    this.consume(); // 'panel'
    this.consume(); // 'source'
    const sourceValue = this.consume('STRING').value;
    this.consume(); // 'refresh'
    const refreshValue = this.consume('NUMBER').value;

    return new ASTNode('Panel', {
      source: sourceValue,
      refresh: refreshValue
    });
  }

  parseTrigger() {
    this.consume(); // 'trigger'
    this.consume(); // 'voice'
    const voiceValue = this.consume('STRING').value;
    this.consume(); // 'action'
    const actionCall = this.consume('IDENTIFIER').value;
    this.consume('LPAREN');
    const arg = this.consume('STRING').value;
    this.consume('RPAREN');

    return new ASTNode('Trigger', {
      voice: voiceValue,
      action: { call: actionCall, arg }
    });
  }

  parse() {
    const ast = [];
    while (this.position < this.tokens.length) {
      const token = this.peek();
      if (token.value === 'scene') {
        ast.push(this.parseScene());
      } else {
        throw new Error(`Unexpected token: ${token.value}`);
      }
    }
    return ast;
  }
}
