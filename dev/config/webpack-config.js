const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'production',
    target: 'web',
    entry: {
        app: [ './src/index.js' ],
    },
    output: {
        path: path.resolve('./build/'),
        filename: 'scripts/[name]-[hash:6].js',
        clean: true,
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
        }),
        new Webpack.DefinePlugin({
            'process.env':{},
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
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'webfonts-loader',
                        options: {
                            fileName: 'fonts/[fontname]-[hash:6][ext]',
                            embed: true,
                        },
                    },
                ],
            },
            // fonts & svg
            {
                test: /\.(ttf|eot|svg|woff[2]?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: /node_modules/,
                type: 'asset/resource',
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
                test: /\.(manifest\.json|\.nojekyll)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: '[path]/[name].[ext]',
                    context: 'src',
                },
            },
        ],
    },
};
