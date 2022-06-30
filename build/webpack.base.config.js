const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
    plugins: [
        new HTMLWebpackPlugin({
            template: `${PATHS.src}/index.html`,
        }),
        new CleanWebpackPlugin(),
    ],
};
