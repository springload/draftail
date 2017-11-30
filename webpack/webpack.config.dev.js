const base = require('./webpack.config.base');

const config = base('development');

module.exports = Object.assign({}, config, {
    // See http://webpack.github.io/docs/configuration.html#devtool
    devtool: 'inline-source-map',

    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
        hints: false,
    },

    // https://webpack.js.org/configuration/dev-server/#devserver
    devServer: {
        contentBase: config.output.path,
        watchContentBase: true,
        compress: true,
        hot: true,
        port: 4000,
        overlay: true,
        clientLogLevel: 'none',
        stats: config.stats,
        disableHostCheck: true,
    },
});
