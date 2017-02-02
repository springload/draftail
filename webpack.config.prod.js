/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const config = require('./webpack.config.dev');

// Lose the webpack middleware
delete config.entry.hmr;
config.watch = false;
config.devtool = false;
config.output.path = path.join(__dirname, 'pages', 'assets');

config.plugins = [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
        // Key is hard-coded because it will be public on the demo site anyway.
        // Key usage is limited to whitelisted Referrers.
        EMBEDLY_API_KEY: JSON.stringify('fd2d6a8502b54524a58f62d1ad8d8550'),
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js', Infinity),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            screw_ie8: true, // React doesn't support IE8
            warnings: false,
        },
        mangle: {
            screw_ie8: true,
        },
        output: {
            comments: false,
            screw_ie8: true,
        },
    }),
];

module.exports = config;
