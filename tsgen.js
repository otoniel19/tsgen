const { log, exec } = require("./utils");
const fs = require("fs");
const path = require("path");

const install = async (name) => {
  log(`:arrow_down:  installing ${name}`);
  var sh = await exec(`npm install -D ${name}`);
  if (sh.failed) log(`:x: failed to install ${name}\n`), gen(name);
  else log(`:white_check_mark: ${name} installed\n`);
};

var scripts = {
  init: `rm -rf types && mkdir types && rm -rf tsconfig.json && npx tsc --init --allowJs --target esnext --declaration --emitDeclarationOnly --module commonjs --outDir types`,
  build: `rm -rf types; mkdir types && npx tsc -p tsconfig.json`
};

const gen = async (name) => {
  log(`:hammer: building ts definitions for ${name}`);
  var pkg = JSON.parse(fs.readFileSync(path.resolve("package.json"), "utf-8"));
  var cwd = process.cwd();
  //is a package not a project
  if (pkg.name !== name) cwd = `${process.cwd()}/node_modules/${name}/`;

  log(`:arrow_right: ${scripts.init}`);
  await exec(scripts.init, cwd);
  log(`:arrow_right: ${scripts.build}`);
  var build = await exec(scripts.build, cwd);
  !build.failed
    ? log(
        `:white_check_mark: successfully  build ts declarations for ${name}\n`
      )
    : log(`:x: failed to build ts declarations for ${name}\n`);
};

module.exports = async (g, name) => {
  !g ? await install(name) : await gen(name);
};
