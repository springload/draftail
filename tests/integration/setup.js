const chalk = require('chalk');
const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const express = require('express');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
    console.log(chalk.green('Setup Puppeteer Environment.'));
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    global.__BROWSER__ = browser;
    mkdirp.sync(DIR);
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());

    const app = express();

    app.use('/draftail', express.static(path.join('public')));

    global.__SERVER__ = app.listen(5000, () =>
        console.log('Example app listening on port 3000!'),
    );
};
