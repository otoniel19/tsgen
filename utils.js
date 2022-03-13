const { commandSync } = require("execa");

const exec = async (command, cwd) => {
  try {
    var shell = await commandSync(command, {
      shell: true,
      cwd: typeof cwd != "undefined" ? cwd : process.cwd()
    });
    return shell;
  } catch (e) {
    return e;
  }
};

require("colors");

const log = (...data) => {
  var oldData = data;
  try {
    data = data.map(require("node-emoji").emojify);
  } catch (e) {
    data = oldData;
  }
  console.log.apply(this, [...data]);
};

module.exports = {
  exec,
  log
};
