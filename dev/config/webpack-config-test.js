const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack-config.js');

module.exports = merge(webpackConfig, {
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
    output: {
        clean: true,
    },
    entry: {
        //redefine as main for poledina
        main: [ './src/index.js' ],
    },
    stats: 'normal',
});
