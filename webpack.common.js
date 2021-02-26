/**
 * @ author kunnisser
 * @ date 2018/3/12
 * @ description: 公共配置
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlguin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// const phaserModule = path.join(__dirname, '/node_modules/phaser/');
// const phaser = path.join(phaserModule, 'build/custom/phaser-arcade-physics.js');
// const pixi = path.join(phaserModule, 'build/custom/pixi.js');

module.exports = {
	entry: {
		index: ['./editor/index.tsx']
	},
	output: {
		path: __dirname + '/output/editor',
		publicPath: '/editor/',
		filename: '[name]-[chunkhash].js'
	},
	resolve: {
		extensions: ['.js', '.json', '.ts', '.tsx'],
		alias: {
			'ts@': path.join(__dirname, '/projects'),
			'editor@': path.join(__dirname, '/editor')
		},
		plugins: [new TsconfigPathsPlugin({
			configFile: 'tsconfig.json'
		})]
	},
	module: {
		rules: [
			{
				test: /pixi\.js$/,
				use: {
					loader: 'expose-loader?PIXI'
				}
			},
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.(ts|tsx)$/,
				include: [path.join(__dirname, '/editor'), path.join(__dirname, '/projects')],
				use: {
					loader: 'ts-loader',
					options: {
						transpileOnly: true
					}
				}
			},
			{
				test: /\.(png|jpg)$/,
				use: {
					loader: 'url-loader',
					options: {
						name: '[name].[ext]'
					}
				}
			},
			{
				test: /\.json$/,
				use: {
					loader: 'json-loader',
					options: {
						name: '[name].[ext]'
					}
				}
			},
      {
        test: /\.less$/,
				use: [
					{
						loader: "style-loader"
					}, 
					{
						loader: "css-loader"
					},
					{
						loader: "less-loader",
						options: {
							lessOptions: {
								javascriptEnabled: true,
							}
						}
					}
				]
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './editor/index.html'
		}),
		new ForkTsCheckerWebpackPlguin({
			async: false,
			watch: [path.join(__dirname, '/editor'), path.join(__dirname, '/projects')],
			tsconfig: 'tsconfig.json'
		})
	]
};
