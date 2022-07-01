const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 8080,
        hot: false,
        liveReload: true,
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
        }),
    ],
});

module.exports = new Promise((resolve) => {
    resolve(devWebpackConfig);
});
