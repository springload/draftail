/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

require('dotenv').config();

// Key is hard-coded because it will be public on the demo site anyway.
// Key usage is limited to whitelisted Referrers.
const EMBEDLY_API_KEY_PROD = 'fd2d6a8502b54524a58f62d1ad8d8550';
const EMBEDLY_API_KEY = process.env.EMBEDLY_API_KEY || EMBEDLY_API_KEY_PROD;

const autoprefixerConfig = {
    browsers: ['> 1%', 'ie 11'],
};

// Some libraries import Node modules but don't use them in the browser.
// Tell Webpack to provide empty mocks for them so importing them works.
const node = {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
};

const stats = {
    // Add chunk information (setting this to `false` allows for a less verbose output)
    chunks: false,
    // Add the hash of the compilation
    hash: false,
    // `webpack --colors` equivalent
    colors: true,
    // Add information about the reasons why modules are included
    reasons: false,
    // Add webpack version information
    version: false,
};

/**
 * Base Webpack config, defining how our code should compile.
 */
const webpackConfig = environment => {
    const extractSass = new ExtractTextPlugin('draftail.css');

    const isProduction = environment === 'production';

    const compiler = {
        entry: {
            vendor: [
                './examples/utils/polyfills.js',
                'react',
                'react-dom',
                'immutable',
                'draft-js',
                'draftjs-utils',
                'element-closest',
                './lib/index.scss',
            ],
            intro: './examples/intro',
            basic: './examples/basic',
            entities: './examples/entities',
            all: './examples/all',
            wagtail: './examples/wagtail',
            custom: './examples/custom',
            test: './examples/test',
        },
        output: {
            path: path.join(__dirname, '..', 'build'),
            filename: '[name].bundle.js',
            publicPath: '/assets/',
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new BundleAnalyzerPlugin({
                // Can be `server`, `static` or `disabled`.
                analyzerMode: 'static',
                // Path to bundle report file that will be generated in `static` mode.
                reportFilename: path.join(__dirname, 'webpack-stats.html'),
                // Automatically open report in default browser
                openAnalyzer: false,
                logLevel: environment === 'production' ? 'info' : 'warn',
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: 'vendor.bundle.js',
            }),
            extractSass,
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                EMBEDLY_API_KEY: JSON.stringify(
                    isProduction ? EMBEDLY_API_KEY_PROD : EMBEDLY_API_KEY,
                ),
                'process.env': {
                    NODE_ENV: JSON.stringify(environment),
                },
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: ['babel-loader'],
                    exclude: /node_modules/,
                },

                {
                    test: /\.scss$/,
                    use: extractSass.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: !isProduction,
                                    minimize: isProduction
                                        ? {
                                              autoprefixer: autoprefixerConfig,
                                          }
                                        : false,
                                },
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: !isProduction,
                                    plugins: () => [
                                        autoprefixer(autoprefixerConfig),
                                    ],
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: !isProduction,
                                },
                            },
                        ],
                    }),
                },
            ],
        },

        stats: stats,

        node: node,
    };

    return compiler;
};

module.exports = webpackConfig;
