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

/**
 * @returns {Promise<>)}
 */
const get = async (url) => {
  return new Promise((resolve, reject) => {
    var { get } = require("https");
    var data = "";
    var req = get(url, (res) => {
      res.on("data", (ch) => (data += ch.toString()));
      res.on("end", () => resolve(Object.assign(res, { data })));
    });
    req.on("error", (e) => {
      console.log(`error`.red, `${e.message}`);
      process.exit();
    });
  });
};

const log = (...data) => {
  var oldData = data;
  try {
    data = data.map(require("node-emoji").emojify);
  } catch (e) {
    data = oldData;
  }
  console.log.apply(this, [...data]);
};

const sleep = (ms) => exec(`sleep ${ms}`);

module.exports = {
  exec,
  log,
  get,
  sleep
};
