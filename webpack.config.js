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
    				plugins: [],
					presets: ['es2015'],
				}
			}
		]
	},
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
		path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    	libraryTarget: 'umd',
        library: 'Classux',
    },
};
