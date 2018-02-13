const chalk = require('chalk');
const puppeteer = require('puppeteer');
const rimraf = require('rimraf');
const os = require('os');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
    console.log(chalk.green('Teardown Puppeteer Environment.'));
    await global.__BROWSER__.close();
    rimraf.sync(DIR);

    await global.__SERVER__.close();
};
