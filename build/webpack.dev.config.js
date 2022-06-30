const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devServer: {
        port: 8080,
    },
    plugins: [],
});

module.exports = new Promise((resolve) => {
    resolve(devWebpackConfig);
});
