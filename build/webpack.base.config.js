const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
};

const PUBLIC = process.env.NODE_ENV === 'production' ? './' : '/';

module.exports = {
    entry: {
        app: [`${PATHS.src}/js/index.js`],
    },
    output: {
        filename: 'js/[name].[contenthash].js',
        path: PATHS.dist,
        publicPath: `${PUBLIC}`,
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '~': PATHS.src,
        },
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
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
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
                        options: { sourceMap: true, postcssOptions: { config: path.resolve(__dirname, './postcss.config.js') } },
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
        new CopyWebpackPlugin({
            patterns: [
                { from: `${PATHS.src}/assets/img`, to: 'assets/img' },
                { from: `${PATHS.src}/assets/fonts`, to: 'assets/fonts' },
            ],
        }),
        new ESLintPlugin({
            extensions: ['js'],
            exclude: ['node_modules'],
            emitError: true,
            emitWarning: false,
            fix: true,
        }),
        new CleanWebpackPlugin(),
    ],
};
