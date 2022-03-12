#!/usr/bin/env node
const cli = require("commander").program;
const { resolve } = require("path");
const fs = require("fs");
cli.version(require(resolve("package.json")));

const shell = require("shelljs");
shell.config.silent = true;

const sh = Object.create(shell);

const log = (...data) => {
  data = data.map((o) => require("node-emoji").emojify(o));
  console.log.apply(this, data);
};

var pkg = JSON.parse(fs.readFileSync(resolve("package.json"), "utf8"));

cli
  .command("package")
  .description("generate or install ts definitions.")
  .action(() => {
    var keys = Object.keys(pkg.dependencies);
    if (!pkg.dependencies) cli.error("no packages found.");
    log(`:package: ${keys.length} packages found.\n`);
    keys.forEach((name) => {
      log(`:mag: scanning ${name}`);
      log(`:package: cheking ts definitions.`);
      //check if .d.ts exists
      var ex = sh.exec(`find -iwholename "./node_modules/${name}/*.d.ts"`);
      ex != ""
        ? log(`:package: package ${name} already have ts definitions\n`)
        : require("./lib/pkg-gen")(name);
    });
  });

cli
  .command("local")
  .description("generate ts definitions for project.")
  .action(() => {
    log(`:mag: ${pkg.name} checking ts definitions`);
    var ex = sh.exec(`find -iname "*.d.ts" -not -path "./node_modules/*"`);
    ex != ""
      ? log(`:white_check_mark: ${pkg.name} already have ts definitions`)
      : require("./lib/local-gen")(pkg.name);
  });

cli.parse(process.argv);
