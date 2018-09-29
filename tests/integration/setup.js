const fs = require("fs");
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer");
const mkdirp = require("mkdirp");
const express = require("express");

const DIR = path.join(os.tmpdir(), "jest_puppeteer_global_setup");

const IS_WATCH = process.argv.includes("--watch");

module.exports = async () => {
  global.BROWSER = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  mkdirp.sync(DIR);

  fs.writeFileSync(path.join(DIR, "wsEndpoint"), global.BROWSER.wsEndpoint());

  if (!IS_WATCH) {
    const app = express();

    app.use("/draftail", express.static(path.join("public")));

    global.SERVER = app.listen(5000);
  }
};
