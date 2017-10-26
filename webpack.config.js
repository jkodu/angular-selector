const pkgName = require('./package.json')
    .name;
const path = require('path')
const webpack = require('webpack')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist')
}

module.exports = {

    externals: {
        angular: 'angular'
    },

    entry: {
        [pkgName]: PATHS.src + '/index.ts'
    },

    output: {
        path: PATHS.dist,
        filename: '[name].js',
        library: 'index',
        libraryTarget: 'umd'
    },

    devtool: 'source-map',

    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
        }, {
            test: /\.p?css$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    url: false
                }
            }, {
                loader: 'postcss-loader'
            }]
        }],
    },

    resolve: {
        // you can now require('file') instead of require('file.js')
        extensions: ['.ts', '.js']
    },

    plugins: [
        new WebpackBuildNotifierPlugin({
            title: pkgName
        }),
        new webpack.IgnorePlugin(/test\.ts$/)
    ]
}
