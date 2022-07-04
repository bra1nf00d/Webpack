const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('@gozenc/interpolate-html-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        app: resolveApp('src/index.js'),
    },
    output: {
		path: resolveApp('dist'),
		publicPath: isEnvProduction
			? './'
			: '/',
		filename: 'js/[name].[contenthash:8].js',
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
		strictExportPresence: true,
		rules: [
			{
				test: /\.hbs$/,
				loader: 'handlebars-loader',
				options: {
					inlineRequires: 'assets/img',
				},
			},
            {
                test: /\.html$/,
				loader: 'html-loader',
            },
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
		new HtmlWebpackPlugin({
			inject: true,
			template: resolveApp('src/views/index.hbs'),
			filename: resolveApp('dist/index.html'),
		}),
		new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
			PUBLIC_URL: isEnvProduction
				? '.'
				: '',
		}),
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: resolveApp('src/assets/img'), to: 'assets/img' },
                { from: resolveApp('src/assets/fonts'), to: 'assets/fonts' },
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
