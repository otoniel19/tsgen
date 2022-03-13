# super-prompt

> Ask Prompts on terminal with history and keypress events.

# install

> npm install @otoniel19/super-prompt

# usage

> super-prompt already have jsdocs

```js
const superPrompt = require("@otoniel19/super-prompt");
const question = new superPrompt("historyFile", {
  persist: false,
  close: true
});
question.ask("enter name: ".red, (cb) => {
  console.log(cb);
});
```
