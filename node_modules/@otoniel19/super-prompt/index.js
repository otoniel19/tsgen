const { log } = require("console");

var readline = require("readline"),
  //fs for reading history file and etc
  fs = require("fs"),
  //stdin for listen keypress and open prompt
  //stdout for write
  { stdin, stdout } = process,
  //EventEmitter for emit events
  { EventEmitter } = require("events");

//listen for keypress events
readline.emitKeypressEvents(stdin);

require("colors");

const loadHistory = (fileName) => {
  const args = fs.readFileSync(fileName, "utf8").split(/\r?\n/);
  prompter.history = args;
};

var prompter = readline.createInterface({
  input: stdin,
  output: stdout,
  historySize: Infinity
});

if (stdin.isTTY) stdin.setRawMode(true);

class SuperPrompt extends EventEmitter {
  /**
   * @param {String} historyFile the file to save the history
   */
  constructor(
    historyFile,
    opts = {
      close: true,
      persist: false
    }
  ) {
    super();
    this.historyFile = historyFile;
    this.opts = opts;
  }
  on(event, cb) {
    super.on(event, cb);
  }
  /**
   * @param {String} name the question name to ask
   * ```js
   * var prompt = new SuperPrompt("./myhistory",{ close: true })
   * prompt.ask("enter name",(questionData) => console.log(`hi ${questionData}`))
   * ```
   * @param {Function} fn the callback function to read the asked data
   */
  ask(name, fn) {
    stdin.on("keypress", (ch, key) => this.emit("keypress", key));
    loadHistory(this.historyFile);
    prompter.question(name, (text) => {
      fn(text);
      //save history
      fs.appendFileSync(this.historyFile, text + "\n");
      if (this.opts.close) {
        this.emit("close");
        prompter.close();
      }
      //continue with the prompt
      if (this.opts.persist) {
        this.ask(name, fn);
      }
    });
  }
  /**
   * the SuperPrompt readline
   * @returns {typeof readline}
   */
  get readline() {
    return readline;
  }
  /**
   * the SuperPrompt interface
   * @returns {typeof prompter}
   */
  get interface() {
    return prompter;
  }
}

module.exports = SuperPrompt;
