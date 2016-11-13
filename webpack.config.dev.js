/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    // See http://webpack.github.io/docs/configuration.html#devtool
    devtool: 'inline-source-map',
    entry: {
        hmr: 'webpack-hot-middleware/client',
        basic: './examples/basic',
        entities: './examples/entities',
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
        publicPath: '/',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new ProgressBarPlugin(),
        new webpack.optimize.CommonsChunkPlugin('common', 'common.bundle.js', Infinity),
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
