const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

function isExternal(module) {
    let context = module.context;

    if (typeof context !== 'string') {
        return false;
    }

    return context.indexOf('node_modules') !== -1;
}

module.exports = {
    entry: './src/index.jsx',
    output: {
        filename: '[hash].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            'react': path.join(__dirname, 'node_modules', 'react')
        },
        extensions: ['.js', '.json', '.jsx']
    },
    module: {
        rules: [{
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
            loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=/fonts/[name].[ext]'
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
            title: 'Different Admin',
            template: './index.html'
        }),
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production'),
                'BASE': JSON.stringify("https://dev-api.admin.different.com.au/"),
                'GOOGLE_CLIENT_ID': JSON.stringify("658980007035-h6u57ldem3q9vk6eq36mov1hq8uimbfk.apps.googleusercontent.com"),
                'OWNER_PORTAL': JSON.stringify("https://dev-owner.different.com.au/")
            }
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
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            comments: false,
            mangle: false
        }),
        new webpack.IgnorePlugin(/regenerator|nodent|js-beautify/, /ajv/)
    ],
    node: {
        console: 'mock',
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
