import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';
import { Lexer } from './src/lexer.js';
import { Parser } from './src/parser.js';
import { Interpreter } from './src/interpreter.js';
import { commandRegistry } from './src/commands.js';

const args = process.argv.slice(2);
const command = args[0];
const filePath = args[1];

if (command === 'ingredients') {
  const flag = args[1];
  const value = args[2]?.toLowerCase();

  if (flag === '-s') {
    if (!value) {
      console.log('🧂 Usage: kake.cmd ingredients -s "keyword"');
      process.exit(1);
    }

    const matches = Object.entries(commandRegistry)
      .filter(([name]) => name.toLowerCase().includes(value));

    if (matches.length === 0) {
      console.log(`❌ No commands found matching "${value}"`);
    } else {
      console.log(`🔍 Found ${matches.length} command(s):`);
      matches.forEach(([name]) => console.log(`- ${name}`));
    }

    process.exit(0);
  }

  if (flag === '-a') {
    console.log('📦 All Available Commands:');
    Object.keys(commandRegistry).forEach(cmd => {
      console.log(`- ${cmd}`);
    });
    process.exit(0);
  }

  console.log('🧂 Usage:');
  console.log('  kake.cmd ingredients -s "keyword"   Search for commands');
  console.log('  kake.cmd ingredients -a             Show all commands');
  process.exit(1);
}

if (command === 'list') {
  console.log('📦 Available Commands:');
  Object.keys(commandRegistry).forEach(cmd => {
    console.log(`- ${cmd}`);
  });
  process.exit(0);
}

if (command === 'help') {
  console.log('🧠 KAKE Help\n');
  console.log('Available commands:');
  console.log('- bake <file.k>       Run a .k file');
  console.log('- ingredients -s "X"  Search for commands');
  console.log('- ingredients -a      Show all commands');
  console.log('- list                Show all available commands');
  console.log('- help                Show this help');
  process.exit(0);
}

if (command === 'bake') {
  if (!filePath) {
    console.log('❌ No .k file provided.');
    console.log('Usage: kake.cmd bake examples/vastcontrol.k');
    process.exit(1);
  }

  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${fullPath}`);
    process.exit(1);
  }

  const sourceCode = fs.readFileSync(fullPath, 'utf8');
  const lexer = new Lexer(sourceCode);
  const tokens = lexer.tokenize();

  const parser = new Parser(tokens);
  const ast = parser.parse();

  const interpreter = new Interpreter(ast);
  interpreter.run();
  process.exit(0);
}

console.log(chalk.cyan.bold('🔁 KAKE REPL MODE'));
console.log(chalk.gray('Type scene logic below. Type "exit" to quit.\n'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'kake> '
});

rl.prompt();

rl.on('line', (line) => {
  if (line.trim().toLowerCase() === 'exit') {
    rl.close();
    return;
  }

  if (line.startsWith('ingredients -s ')) {
    const term = line.split('ingredients -s ')[1].trim().toLowerCase();
    const matches = Object.keys(commandRegistry).filter(cmd =>
      cmd.toLowerCase().includes(term)
    );
    console.log(`🔍 Found ${matches.length} command(s):`);
    matches.forEach(cmd => console.log(`- ${cmd}`));
    rl.prompt();
    return;
  }

  if (line.trim() === 'ingredients -a') {
    console.log('📦 All Available Commands:');
    Object.keys(commandRegistry).forEach(cmd => {
      console.log(`- ${cmd}`);
    });
    rl.prompt();
    return;
  }

  try {
    const lexer = new Lexer(line);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    const interpreter = new Interpreter(ast);
    interpreter.run();
  } catch (err) {
    console.log(chalk.red(`❌ ${err.message}`));
  }

  rl.prompt();
});

rl.on('close', () => {
  console.log(chalk.green('\n👋 Goodbye from KAKE.'));
  process.exit(0);
});
