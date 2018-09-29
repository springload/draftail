const NodeEnvironment = require("jest-environment-node");
const puppeteer = require("puppeteer");
const fs = require("fs");
const os = require("os");
const path = require("path");

const DIR = path.join(os.tmpdir(), "jest_puppeteer_global_setup");

const IS_WATCH = process.argv.includes("--watch");

/**
 * Automated end to end integration tests built with Puppeteer.
 * See https://facebook.github.io/jest/docs/en/puppeteer.html.
 */
class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config, options) {
    super(config, options);

    // Look at what Webpack serves when in watch mode.
    const port = IS_WATCH ? 4000 : 5000;
    const index = IS_WATCH ? "" : "draftail/";
    this.global.ROOT = `http://localhost:${port}/${index}`;
  }

  async setup() {
    await super.setup();

    const wsEndpoint = fs.readFileSync(path.join(DIR, "wsEndpoint"), "utf8");

    if (!wsEndpoint) {
      throw new Error("wsEndpoint not found");
    }

    this.global.BROWSER = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;
