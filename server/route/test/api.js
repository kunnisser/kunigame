/**
 * @Author: kunnisser
 * @Date: 2021-02-28 21:12:06
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-03-01 00:01:20
 * @FilePath: \kunigame\server\route\test\api.js
 * @Description: ---- 测试接口 ----
 */

var router = require('koa-router')();
var fs = require('fs-extra');
var path = require('path');
var babel = require('@babel/core');
var routeUtils = require('../../common/route.js');

router.get('/', async (ctx) => {
  ctx.body = 'testApi';
});

const gameWorkBenchPath = path.resolve('./', 'editor/page/workbench');

const switchGameProject = (projectName) => {
  const currentGamePath = path.normalize(`${gameWorkBenchPath}/canvas.tsx`);
  babel.transformFileSync(currentGamePath, {
    sourceType: "module",
    presets: [
      "@babel/preset-env",
      "@babel/preset-typescript"
    ],
  });
}

// 默认测试
router.get('/index', async (ctx) => {
  try {
    switchGameProject('heihei');
    ctx.body = {
      code: CODE.SUCCESS,
      msg: 'test OK',
      data: '',
    }; 
    return;
  } catch (error) {
    routeUtils.normalErrorHandler(ctx, error);
  }
});

module.exports = router.routes();
