/**
 * @Author: kunnisser
 * @Date: 2021-02-25 17:04:27
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-26 16:49:10
 * @FilePath: /kunigame/server/route/index.js
 * @Description: ---- 路由初始化 ----
 */

var router = require('koa-router')();
var scene = require('./scene/api');
var project = require('./project/api');

router.get('/', async (ctx) => {
  ctx.body = 'node api server';
});

router.use('/project', project);
router.use('/scene', scene);

module.exports = router.routes();

