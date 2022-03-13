#!/usr/bin/env node
const cli = require("commander").program;
const { log, exec, get, sleep } = require("./utils");
const fs = require("fs");
const path = require("path");
const tsgen = require("./tsgen");

var pkg = require(path.resolve("package.json"));

cli.command("pkg").action(() => {
  var len = Object.keys(pkg.dependencies);
  //remove installed files because its scan node_modules
  len = len.filter((o) => !pkg.dependencies[o].startsWith("file"));

  log(`:package: ${len.length} packages found\n`);
  len.forEach((str) =>
    log(`:package: package ${str}@${pkg.dependencies[str]}`)
  );
  log("\n");
  len.forEach(async (str, idx, array) => {
    //check if package have @types
    var check = await get(`https://registry.npmjs.org/@types/${str}`);
    //check if package already have ts definitions
    var dts = await exec(`find -iwholename "./node_modules/${str}/*"`);
    //check if have ts definitions or @types already is installed
    if (dts.stdout != "" || fs.existsSync("./node_modules/@types/" + str))
      log(`:white_check_mark: package ${str} already have ts definitions\n`);
    //when package @types/pkg not exists on npm
    else check.statusCode == 200 ? tsgen(false, str) : tsgen(true, str);
  });
});

cli
  .command("local")
  .option(
    "-f,--force",
    "force generates ts declarations whether they exist or not",
    false
  )
  .action(async ({ force }) => {
    if (force)
      log(
        `:warning: using force will generates ts declarations whether they exist or not\n`
      );
    //check if project has ts definitions
    var dts = await exec(`find -iname "*.d.ts" -not -path "./node_modules/*"`);
    if (dts.stdout != "")
      if (force) tsgen(true, pkg.name);
      else
        log(
          `:white_check_mark: project ${pkg.name} already have ts definitions\n`
        );
    else tsgen(true, pkg.name);
  });

cli.parse(process.argv);
