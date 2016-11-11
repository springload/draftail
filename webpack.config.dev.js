/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    // See http://webpack.github.io/docs/configuration.html#devtool
    devtool: 'inline-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './examples/index',
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'examples.bundle.js',
        publicPath: '/',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new ProgressBarPlugin(),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: [
                    path.join(__dirname, 'examples'),
                    path.join(__dirname, 'lib'),
                ],
            },
        ],
    },
};
