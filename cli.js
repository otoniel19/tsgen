#!/usr/bin/env node
const cli = require("commander").program;
const { log, exec } = require("./utils");
const tsgen = require("./tsgen");
const path = require("path");
const { existsSync } = require("fs");

cli.version(require("./package.json").version);

var pkg = require(path.resolve("package.json"));

cli.command("local").action(async () => {
  log(`:mag: analyzing the project ${pkg.name}`);
  var shell = await exec(`find -iname "*.d.ts" -not -path "./node_modules/*"`);
  if (shell.stdout != "")
    log(`:white_check_mark: ${pkg.name} already have ts definitions`);
  else {
    await tsgen("gen", pkg.name, false);
  }
});

cli.command("pkg").action(() => {
  var len = Object.keys(pkg.dependencies);
  log(`:package: ${len.length} packages found`);

  len.forEach(async (n) => {
    var dtsEx = await exec(
      `find -iwholename "./node_modules/${n}/*.d.ts" -not -path "./node_modules/${n}/node_modules/*"`
    );
    log(`:mag: cheking package ${n}`);
    if (dtsEx.stdout != "")
      log(`:white_check_mark: package ${n} already have ts definitions\n`);
    else {
      if (existsSync(`./node_modules/@types/${n}`))
        log(`:white_check_mark: @types/${n} already installed\n`);
      else tsgen("install", n, true);
    }
  });
});

cli.parse(process.argv);
