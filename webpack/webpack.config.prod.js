const base = require('./webpack.config.base');

const config = base('production');

module.exports = Object.assign({}, config, {
    // See http://webpack.github.io/docs/configuration.html#devtool
    devtool: 'source-map',
});
