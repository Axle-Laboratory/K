// index.js

const fs = require('fs');
const path = require('path');
const { Lexer } = require('./src/lexer');
const { Parser } = require('./src/parser');
const { Interpreter } = require('./src/interpreter');

// Load .k file
const filePath = process.argv[2];
if (!filePath) {
  console.error('❌ Please provide a .k file to run');
  process.exit(1);
}

const fullPath = path.resolve(filePath);
const sourceCode = fs.readFileSync(fullPath, 'utf8');

// Run lexer
const lexer = new Lexer(sourceCode);
const tokens = lexer.tokenize();

// Run parser
const parser = new Parser(tokens);
const ast = parser.parse();

// Run interpreter
const interpreter = new Interpreter(ast);
interpreter.run();

