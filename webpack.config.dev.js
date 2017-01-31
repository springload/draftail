/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    // See http://webpack.github.io/docs/configuration.html#devtool
    devtool: 'inline-source-map',
    entry: {
        hmr: 'webpack-hot-middleware/client',
        vendor: ['react', 'react-dom', 'immutable', 'draft-js', 'draftjs-utils'],
        intro: './examples/intro',
        basic: './examples/basic',
        entities: './examples/entities',
        custom: './examples/custom',
        test: './examples/test',
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
        publicPath: '/assets/',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new ProgressBarPlugin(),
        new webpack.DefinePlugin({
            // Set an environment variable of EMBEDLY_API_KEY to use this in development.
            EMBEDLY_API_KEY: JSON.stringify(process.env.EMBEDLY_API_KEY),
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js', Infinity),
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
