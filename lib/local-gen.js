var cmd =
  "tsc --init --allowJs --target esnext --module commonjs --lib esnext --checkJs --declaration --emitDeclarationOnly --outDir types";
var sh = require("shelljs");
sh.config.silent = true;

var fs = require("fs");
const log = (...data) => {
  data = data.map((o) => require("node-emoji").emojify(o));
  console.log.apply(this, data);
};

module.exports = (name) => {
  if (!fs.existsSync("./tsconfig.json")) {
    log(":arrow_right: rm -rf types; mkdir -p types");
    sh.exec("rm -rf types; mkdir -p types");
    log(":arrow_right: " + cmd);
    sh.exec(cmd);
    log(":arrow_right: npx tsc -p tsconfig.json");
    var i = sh.exec("npx tsc -p tsconfig.json");
    !i.stderr
      ? log(":white_check_mark: succefully generated ts definitions")
      : log(":x: failed to generate ts definitions");
  } else {
    log(":arrow_right: rm -rf types; mkdir -p types");
    sh.exec("rm -rf types; mkdir -p types");
    log(":arrow_right: npx tsc -p tsconfig.json");
    var i = sh.exec("npx tsc -p tsconfig.json");
    !i.stderr
      ? log(":white_check_mark: succefully generated ts definitions")
      : log(":x: failed to generate ts definitions");
  }
};
