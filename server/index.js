/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('../webpack.config.dev');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');

const app = express();
const compiler = webpack(config);

const PORT = process.env.PORT || 4000;

app.use('/', express.static(path.join(__dirname, '..', 'examples')));

app.use(webpackDev(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
}));

app.use(webpackHot(compiler));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'examples/index.html'));
});

app.listen(PORT, 'localhost', () => {
    process.stdout.write(`Listening at http://localhost:${PORT}\n`);
});
