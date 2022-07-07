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

const isEnvProduction = process.env.NODE_ENV === 'production';

const VIEWS = fs.readdirSync(resolveApp('src/views'))
	.filter((view) => view.includes('.html') || view.includes('.hbs'));

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
		assetModuleFilename: 'assets/img/[name].[hash][ext]',
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
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { esModule: false, publicPath: '../' },
                    },
					'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: { sourceMap: true, postcssOptions: { config: path.resolve(__dirname, './postcss.config.js') } },
                    },
					'sass-loader',
                ],
            },
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules)/,
			},
			{
				test: /\.(png|jpe?g|gif)$/,
				type: 'asset',
			},
			{
				test: /\.svg$/,
				type: 'asset/resource',
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name].[hash][ext]',
				},
			},
        ],
    },
    plugins: [
		...VIEWS.map((view) => {
			const filename = view.split('.')[0];
			const asHtml = `${filename}.html`;

			return new HtmlWebpackPlugin({
				template: resolveApp(`src/views/${view}`),
				filename: resolveApp(`dist/${asHtml}`),
				inject: true,
				minify: false,
				esModule: false,
			});
		}),
		new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
			PUBLIC_URL: isEnvProduction
				? '.'
				: '',
		}),
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css',
        }),
        new ESLintPlugin({
            extensions: ['js'],
            exclude: ['node_modules'],
            emitError: true,
            emitWarning: false,
            fix: true,
        }),
		new CopyWebpackPlugin({
			patterns: [
				{ from: resolveApp('public'), to: resolveApp('dist') },
			],
		}),
        new CleanWebpackPlugin(),
    ],
};
