/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').config();

const pkg = require('../package.json');

// Key is hard-coded because it will be public on the demo site anyway.
// Key usage is limited to whitelisted Referrers.
const EMBEDLY_API_KEY_PROD = 'fd2d6a8502b54524a58f62d1ad8d8550';
const EMBEDLY_API_KEY = process.env.EMBEDLY_API_KEY || EMBEDLY_API_KEY_PROD;

const GOOGLE_ANALYTICS_PROD = 'UA-79835767-5';
const SENTRY_DSN_PROD =
    'https://ab23e9a1442c46f296a2527cdbe73a0e@sentry.io/251576';

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
    const extractSass = new ExtractTextPlugin('[name].css');

    const isProduction = environment === 'production';

    const publicPath = isProduction ? '/draftail/' : '/';

    const examplesPath = path.join(__dirname, '..', 'examples');
    const icons = fs.readFileSync(
        path.join(examplesPath, 'constants', 'icons.svg'),
        'utf-8',
    );

    const htmlPluginConfig = {
        template: path.join(examplesPath, 'index.html'),
        hash: true,
        data: {
            publicPath: publicPath,
            icons: icons,
            PKG_VERSION: pkg.version,
            SENTRY_DSN: isProduction ? SENTRY_DSN_PROD : null,
            GOOGLE_ANALYTICS: isProduction ? GOOGLE_ANALYTICS_PROD : null,
        },
    };

    const compiler = {
        entry: {
            vendor: [
                './examples/utils/polyfills.js',
                'react',
                'react-dom',
                'immutable',
                'draft-js',
                'react-modal',
                'prismjs',
                './examples/main.scss',
            ],
            // Stylesheet shipped with the package.
            draftail: ['./lib/index.scss'],
            index: './examples/index',
            examples: './examples/examples',
        },
        output: {
            path: path.join(__dirname, '..', 'public'),
            filename: '[name].bundle.js',
            publicPath: publicPath,
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new HtmlWebpackPlugin(
                Object.assign({}, htmlPluginConfig, {
                    filename: 'index.html',
                    chunks: ['vendor', 'index'],
                }),
            ),
            new HtmlWebpackPlugin(
                Object.assign({}, htmlPluginConfig, {
                    filename: 'examples/index.html',
                    chunks: ['vendor', 'examples'],
                }),
            ),
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
                minChunks: 2,
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
                PKG_VERSION: JSON.stringify(pkg.version),
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
                                    minimize: isProduction,
                                },
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: !isProduction,
                                    plugins: () => [autoprefixer()],
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
