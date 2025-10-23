// src/interpreter.js

export class Interpreter {
  constructor(ast) {
    this.ast = ast;
  }

  run() {
    for (const node of this.ast) {
      if (node.type === 'Scene') {
        this.runScene(node);
      } else {
        console.warn(`Unknown top-level node: ${node.type}`);
      }
    }
  }

  runScene(scene) {
    console.log(`\n🎬 Scene: ${scene.name}`);
    for (const element of scene.body) {
      switch (element.type) {
        case 'Pad':
          this.runPad(element);
          break;
        case 'Panel':
          this.runPanel(element);
          break;
        case 'Trigger':
          this.runTrigger(element);
          break;
        default:
          console.warn(`Unknown scene element: ${element.type}`);
      }
    }
  }

  runPad(pad) {
    console.log(`🎛 Pad [${pad.id}]`);
    console.log(`   Color: ${pad.color}`);
    console.log(`   Trigger: ${pad.trigger.call}("${pad.trigger.arg}")`);
  }

  runPanel(panel) {
    console.log(`📊 Panel`);
    console.log(`   Source: ${panel.source}`);
    console.log(`   Refresh: ${panel.refresh}s`);
  }

  runTrigger(trigger) {
    console.log(`🎤 Trigger`);
    console.log(`   Voice: "${trigger.voice}"`);
    console.log(`   Action: ${trigger.action.call}("${trigger.action.arg}")`);
  }
}
