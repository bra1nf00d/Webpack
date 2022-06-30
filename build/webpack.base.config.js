const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
};

module.exports = {
    entry: {
        app: [`${PATHS.src}/js/index.js`],
    },
    output: {
        filename: 'js/[name].[contenthash].js',
        path: PATHS.dist,
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.json'],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { esModule: false },
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true, url: false },
                    },
                    {
                        loader: 'postcss-loader',
                        options: { sourceMap: true, postcssOptions: { config: path.resolve(__dirname, "./postcss.config.js") } }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: `${PATHS.src}/index.html`,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css',
        }),
        new CleanWebpackPlugin(),
    ],
};
