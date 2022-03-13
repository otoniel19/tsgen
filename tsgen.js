const { log, exec } = require("./utils");

const gen = async (pkg, isPkg) => {
  const init = `rm -rf tsconfig.json types && mkdir types && npx tsc --init --allowJs --target esnext --module commonjs --lib esnext --checkJs --declaration --emitDeclarationOnly --outDir types`;
  log(`:hammer: building ts definitions for ${isPkg ? pkg : `project ${pkg}`}`);

  log(`:arrow_right: ${init}`);
  if (isPkg) await exec(init, `${process.cwd()}/node_modules/${pkg}`);
  else await exec(init);
  log(`:arrow_right: npx tsc -p tsconfig.json`);

  var sh;
  if (isPkg)
    sh = await exec(
      `npx tsc -p tsconfig.json`,
      `${process.cwd()}/node_modules/${pkg}`
    );
  else sh = await exec(`npx tsc -p tsconfig.json`);

  sh.stderr == ""
    ? log(`:white_check_mark: successfully built\n`)
    : log(`:x: failure to build\n`);
  return new Promise((res, rej) => res(void ""));
};
const install = async (name) => {
  var exists = await exec(`npm view @types/${name}`);
  if (exists.failed) gen(name, true);
  else {
    log(`:arrow_down:  installing @types/${name}`);
    var down = await exec(`npm i -D @types/${name}`);
    down.stderr != ""
      ? log(`:x: failed to install @types/${name}\n`)
      : log(`:white_check_mark: @types/${name} installed\n`);
    return new Promise((res, rej) => res(void 0));
  }
};

module.exports = async (type, name, isPkg) => {
  switch (type) {
    case "gen":
      await gen(name, isPkg);
      break;
    case "install":
      await install(name);
      break;
  }
};
