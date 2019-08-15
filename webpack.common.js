/**
 * @ author kunnisser
 * @ date 2018/3/12
 * @ description: 公共配置
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const phaserModule = path.join(__dirname, '/node_modules/phaser/');
// const phaser = path.join(phaserModule, 'build/custom/phaser-arcade-physics.js');
// const pixi = path.join(phaserModule, 'build/custom/pixi.js');

module.exports = {
	entry: {
		index: ['./kuni/main.js']
	},
	output: {
		path: __dirname + '/output/kuni',
		publicPath: '/kuni/',
		filename: '[name]-[chunkhash].js'
	},
	resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'@':  path.join(__dirname, '/kuni')
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: {
					loader: 'ts-loader'
				}
			},
			{
				test: /pixi\.js$/,
				use: {
					loader: 'expose-loader?PIXI'
				}
			},
			{
				test: /\.(png|jpg)$/,
				use: {
					loader: 'url-loader',
					options: {
						name: 'assets/images/[name].[ext]'
					}
				}
			},
			{
				test: /\.json$/,
				use: {
					loader: 'json-loader',
					options: {
						name: 'assets/data/[name].[ext]'
					}
				}
			}
						// {
			// 	test: /phaser-arcade-physics\.js$/,
			// 	use: {
			// 		loader: 'expose-loader?Phaser'
			// 	}
			// }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './kuni/index.html'
		})
	]
};