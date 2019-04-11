const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: './src/index.jsx',
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            'react': path.join(__dirname, 'node_modules', 'react')
        },
        extensions: ['.js','.json', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.js(x)?$/,
            exclude: /node_modules/,
            loaders: ['babel-loader']
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('css-loader!sass-loader')
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&mimetype=application/font-woff"
        }, {
            test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader?name=/fonts/[name].[ext]'
        }, {
            test: /\.(jpe?g|png|gif|ico|svg)$/i,
            loader: 'file-loader?name=/images/[name].[ext]'
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),
        new ExtractTextPlugin({
            filename: 'css/styles.css',
            disable: false,
            allChunks: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            minChunks: ({ resource }) => /node_modules/,
            filename: 'js/vendor.js'
        }),
        new CopyWebpackPlugin([{
            from: './data/*',
            to: './'
        }]),
        new webpack.IgnorePlugin(/regenerator|nodent|js-beautify/, /ajv/)
    ],
    devServer: {
        port: 9000,
        host: '0.0.0.0',
        compress: true,
        contentBase: './dist',
        historyApiFallback: {
            disableDotRule: true
        }
    },
    node: {
        console: 'mock',
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
