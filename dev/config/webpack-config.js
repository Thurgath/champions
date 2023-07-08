const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'production',
    target: 'web',
    devtool: 'source-map',
    entry: {
        app: [ './src/index.js' ],
    },
    output: {
        path: path.resolve('./build/'),
        filename: 'scripts/[name]-[fullhash:6].js',
        clean: true,
    },
    optimization: {
        minimize: true,
        chunkIds: 'named',
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles/app-[fullhash:6].css'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "**/*.png", to: "images/", context: "src/images"},
                { from: "manifest.json", context: "src/"},
                { from: ".nojekyll", context: "src/"},
            ],
        }),
    ],
    module: {
        rules: [
            // Jsx
            {
                test: /\.jsx?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            // JS
            {
                test: /\.js/,
                exclude: /node_modules/,
            },
            // Scss
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            // css
            {
                test: /\.css(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    'postcss-loader',
                ],
            },
            // font definition
            {
                test: /\.font$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'webfonts-loader',
                        options: {
                            publicPath: '../',
                            embed: false,
                        },
                    },
                ],
            },
            // fonts & svg
            {
                test: /\.(ttf|eot|svg|woff[2]?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset/resource',
                generator : {
                    filename : 'fonts/[name]-[hash:6][ext][query]',
                }
            },
            // images
            {
                test: /\.(png|jpe?g|gif)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000000000000,
                        },
                    },
                ],
            },
            // Other public files
            {
                test: /(manifest\.json|\.nojekyll)/,
                exclude: /node_modules/,
                loader: 'file-loader',
            },
        ],
    },
};
