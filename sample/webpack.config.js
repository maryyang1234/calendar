const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const packageWebpackConfig = require('../webpack.config');

packageWebpackConfig.plugins.push(new HTMLWebpackPlugin({ template: path.join(__dirname, './index.html') }));
packageWebpackConfig.entry = path.join(__dirname, './index.tsx');
packageWebpackConfig.output = {
    path: path.join(__dirname + '/dist'),
    filename: 'index.min.js'
};
packageWebpackConfig.mode = 'development';
packageWebpackConfig.devServer = {
    port: 9000,
    disableHostCheck: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
};

module.exports = packageWebpackConfig;
