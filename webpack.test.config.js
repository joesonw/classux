'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
    resolve: {
        root: path.resolve(__dirname, 'src'),
        extensions: ['', '.js'],
    },
    devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.js$/,
      			exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					cacheDirectory: true,
    				plugins: [
                        'transform-decorators-legacy',
                        'transform-async-to-generator',
    				],
					presets: ['es2015'],
				}
			}
		]
	},
    entry: {
		app: ['babel-polyfill', path.resolve(__dirname, 'src/test.js')],
	},
    output: {
		path: path.resolve(__dirname, 'dist'),
        filename: 'test.js',
        library: 'Classux',
    },
};
