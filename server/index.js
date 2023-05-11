/**
 * @Author: kunnisser
 * @Date: 2021-02-25 17:01:47
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-09 16:39:38
 * @FilePath: /kunigame/server/index.js
 * @Description: ---- koa服务启动文件 ----
 */

var koa = require("koa"),
  onerror = require("koa-onerror");
const logger = require("koa-logger");
var bodyParser = require("koa-bodyparser");
var router = require("koa-router")();
var routes = require("./route");
var cors = require("koa2-cors");
var app = new koa();
var env = require("./env");

// error handler
onerror(app);

// 报错打印
app.on("error", (err, ctx) => {
  console.error("server error", err);
});

// 初始化环境常量
env();

// 请求耗时
app.use(async (ctx, next) => {
  var start = new Date();
  await next();
  var ms = new Date() - start;
  console.log("%s %s - %s", ctx.method, ctx.url, ms + "ms");
});

app.use(logger()); // 日志输出

app.use(
  cors({
    origin: function (ctx) {
      //设置允许来自指定域名请求
      return "http://localhost:8888"; // 允许来自此域名请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"] //设置获取其他自定义字段
  })
);

app.use(bodyParser());

// 启动路由
app.use(routes);
app.use(router.allowedMethods());

module.exports = app;
