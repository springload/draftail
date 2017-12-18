const NodeEnvironment = require('jest-environment-node');
const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

/**
 * Automated end to end integration tests built with Puppeteer.
 * See https://facebook.github.io/jest/docs/en/puppeteer.html.
 */
class PuppeteerEnvironment extends NodeEnvironment {
    async setup() {
        await super.setup();

        const wsEndpoint = fs.readFileSync(
            path.join(DIR, 'wsEndpoint'),
            'utf8',
        );

        if (!wsEndpoint) {
            throw new Error('wsEndpoint not found');
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
