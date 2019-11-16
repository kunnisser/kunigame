const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack');

module.exports = merge(common, {
   mode: 'production',
   devtool: 'source-map',
   optimization: {
       minimize: true,
       splitChunks: {
           chunks: "initial",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
           minSize: 0,                // 最小尺寸，默认0
           minChunks: 1,              // 最小 chunk ，默认1
           maxAsyncRequests: 1,       // 最大异步请求数， 默认1
           maxInitialRequests: 1,    // 最大初始化请求书，默认1
           name: () => {},              // 名称，此选项课接收 function
           cacheGroups: {                 // 这里开始设置缓存的 chunks
               priority: "0",                // 缓存组优先级 false | object |
               vendor: {                   // key 为entry中定义的 入口名称
                   chunks: "initial",        // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                   test: /pixi/, // 正则规则验证，如果符合就提取 chunk
                   name: "vendor",           // 要缓存的 分隔出来的 chunk 名称
                   minSize: 0,
                   minChunks: 1,
                   enforce: true,
                   maxAsyncRequests: 1,       // 最大异步请求数， 默认1
                   maxInitialRequests: 1,    // 最大初始化请求书，默认1
                   reuseExistingChunk: true   // 可设置是否重用该chunk（查看源码没有发现默认值
               }
           }
       }
   },
    plugins: [
        new webpack.DefinePlugin({
            'ENV': JSON.stringify(false)
        }),
        // new CleanWebpackPlugin(['output/app']),
      // 复制静态资源,将游戏资源文件内的内容复制到指定文件夹
      //   new CopyWebpackPlugin([{
      //       from: path.resolve(__dirname, 'starmanor/path'),
      //       to: 'path',
      //       ignore: ['.*']  //忽视.*文件
      //   }]),
        new CopyWebpackPlugin([{
          from: path.resolve(__dirname, 'kuni/assets'),
          to: 'assets',
          ignore: ['.*']  //忽视.*文件
        }])
    ]
});