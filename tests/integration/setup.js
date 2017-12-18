const fs = require('fs');
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');
const mkdirp = require('mkdirp');
const express = require('express');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
    global.BROWSER = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    mkdirp.sync(DIR);

    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), global.BROWSER.wsEndpoint());

    const app = express();

    app.use('/draftail', express.static(path.join('public')));

    global.SERVER = app.listen(5000);
};
