const { TestEnvironment } = require("jest-environment-node");
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
class PuppeteerEnvironment extends TestEnvironment {
  constructor(config, options) {
    super(config, options);

    // Look at what Webpack serves when in watch mode.
    const port = IS_WATCH ? 9001 : 5001;
    const prefix = IS_WATCH ? "" : "/storybook";
    this.global.ROOT = `http://localhost:${port}${prefix}/iframe.html`;
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
