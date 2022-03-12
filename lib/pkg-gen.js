const shell = require("shelljs");
shell.config.silent = true;
const fs = require("fs");
const { resolve } = require("path");

global.sh = shell;

const log = (...data) => {
  data = data.map((o) => require("node-emoji").emojify(o));
  console.log.apply(this, data);
};

function install(name) {
  log(":arrow_down:  installing " + name + "...");
  var shx = sh.exec("npm install --no-bin-links -D " + name);
  if (!shx.stderr) log(`:white_check_mark: succefully installed\n`);
  else log(`:x: failed to install ${name}.\n`);
}

function gen(name) {
  log(`:cd: entering directory ./node_modules/${name}`);
  sh.cd(resolve(`node_modules/${name}`));
  if (!fs.existsSync(`tsconfig.json`)) {
    log(`:arrow_right: rm -rf types; mkdir -p types`);
    sh.exec(`rm -rf types; mkdir -p types`);
    log(
      `:arrow_right: npx tsc --init --allowJs --target esnext --module commonjs --lib esnext --checkJs --declaration --emitDeclarationOnly --outDir types`
    );
    sh.exec(
      `npx tsc --init --allowJs --target esnext --module commonjs --lib esnext --checkJs --declaration --emitDeclarationOnly --outDir types`
    );
    log(`:arrow_right: npx tsc -p tsconfig.json`);
    var gen = sh.exec(`npx tsc -p tsconfig.json`);
    !gen.stderr
      ? log(":white_check_mark: succefully generated\n")
      : log(`:x: failed to generate ts definitions for ${name}\n`);
  } else {
    log(`:arrow_right: npx tsc -p tsconfig.json`);
    var gen = sh.exec("npx tsc -p tsconfig.json");
    !gen.stderr
      ? log(":white_check_mark: succefully generated\n")
      : log(`:x: failed to generate ts definitions for ${name}\n`);
  }
}

var view = (url, cb) => {
  var data = "";
  require("https").get(url, (res) => {
    res.on("data", (d) => (data += d.toString()));
    res.on("end", () => cb(Object.assign(res, { data })));
  });
};

module.exports = function (name) {
  if (fs.existsSync(resolve(`node_modules/@types/${name}`)))
    log(`:package: @types/${name} already installed\n`);
  else {
    try {
      view(`https://registry.npmjs.org/@types/${name}`, (res) => {
        if (res.statusCode != 200) gen(name);
        else install(`@types/${name}`);
      });
    } catch (e) {
      log(":x: failed to send a request to " + e.hostname);
      process.exit();
    }
  }
};
