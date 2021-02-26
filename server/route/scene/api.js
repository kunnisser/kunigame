/**
 * @Author: kunnisser
 * @Date: 2021-02-25 17:08:05
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-26 10:20:32
 * @FilePath: /kunigame/server/route/scene/api.js
 * @Description: ---- 场景接口 ----
 */

var router = require('koa-router')();
var fs = require('fs-extra');
router.get('/', async (ctx) => {
  ctx.body = 'sceneApi';
});


router.post('/create', async (ctx) => {
  let requestParams = ctx.request.body;
  ctx.body = {
    code: CODE.SUCCESS,
    msg: '创建成功',
    data: null,
  };
});

module.exports = router.routes();