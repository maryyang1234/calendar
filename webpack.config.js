const path = require('path');

const env = process.env.NODE_ENV;
const isDevelopment = env === 'development';

const analyzer = process.env.ANALYZER;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let babelOptions = require('./babel.config.json');
// babelOptions = require('./babel-without-polyfill.config.json');

const webpackConfig = {
    entry: {
        rapiop: './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].min.js',
        library: 'zr-calendar',
        libraryTarget: 'umd'
    },
    mode: env,
    devtool: isDevelopment ? 'inline-source-map' : 'source-map',
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
        modules: [path.resolve(__dirname, '.'), 'node_modules']
    },
    plugins: [...(analyzer ? [new BundleAnalyzerPlugin()] : [])],
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions
                },
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    }
};

module.exports = webpackConfig;
