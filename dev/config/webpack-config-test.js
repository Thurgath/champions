const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack-config.js');

module.exports = merge(webpackConfig, {
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
    output: {
        clean: true,
    },
    optimization: {
        minimize: false,
    },
    stats: 'normal',
    //Removes warnings and errors when running tests
    externals: {
        jsdom: 'jsdom',
        prettier: 'prettier',
    },
});
