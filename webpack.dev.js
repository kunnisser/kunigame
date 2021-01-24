/**
 * @ author kunnisser
 * @ date 2018/3/12
 * @ description: 开发配置
 */

const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const path = require('path');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	watch: true,
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'eslint-loader'
				},
				enforce: 'pre',
				include: [path.resolve(__dirname, 'app')]
			}
		]
	},
	devServer: {
		inline: true,
		port: 3008,
		host: 'localhost'
	},
	plugins: [
		new webpack.DefinePlugin({
			'ENV': JSON.stringify(true)
		})
	]
});