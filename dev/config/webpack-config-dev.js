const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack-config.js');

module.exports = merge(webpackConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        clean: true,
    },
    optimization: {
        minimize: false,
    },
    devServer: {
        allowedHosts: 'all',
        static: {
            directory: './src',
        },
        compress: true,
        host: process.env.WEBPACK_HOSTNAME || 'localhost',
        port: parseInt(process.env.WEBPACK_PORT, 10) || 8080,
        open: process.env.WEBPACK_OPEN !== undefined && process.env.WEBPACK_OPEN === 'true',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        hot: 'only',
        liveReload: true,
        watchFiles: [ 'src/**/*.js', 'src/**/*.jsx', 'src/**/*.html', 'src/**/*.css', 'src/**/*.scss' ],
        historyApiFallback: true,
        devMiddleware: {
            stats: {
                colors: true,
                assets: false,
                cached: false,
                cachedAssets: false,
                chunks: false,
            },
        },
        onListening: (devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            const port = devServer.server.address().port;
            /* eslint-disable no-console */
            console.log('Listening on port:', port);
            /* eslint-disable no-console */
        },
    },
});
