/**
 * @Author: kunnisser
 * @Date: 2021-02-25 17:01:47
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-25 17:22:01
 * @FilePath: /kunigame/server/index.js
 * @Description: ---- koa服务启动文件 ----
 */

var koa = require('koa')
, onerror = require('koa-onerror');
var bodyParser = require('koa-bodyparser');
var router = require('koa-router')();
var routes = require('./route');

var app = new koa();

var env = require('./env');

// error handler
onerror(app);

// 报错打印
app.on('error', (err, ctx) => {
  console.error('server error', err);
});

// 初始化环境常量
env();

// 请求耗时
app.use(async (ctx, next) => {
var start = new Date;
await next();
var ms = new Date - start;
console.log('%s %s - %s', ctx.method, ctx.url, ms + 'ms');
});

app.use(bodyParser());

// 启动路由
app.use(routes);
app.use(router.allowedMethods());

module.exports = app;
