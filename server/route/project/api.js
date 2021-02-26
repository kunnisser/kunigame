/**
 * @Author: kunnisser
 * @Date: 2021-02-26 16:47:50
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-26 17:04:26
 * @FilePath: /kunigame/server/route/project/api.js
 * @Description: ---- 项目操作API ----
 */

var router = require('koa-router')();
var fs = require('fs-extra');
var path = require('path');
router.get('/', async (ctx) => {
  ctx.body = 'projectApi';
});

const projectBasePath =  '/projects/';

/**
 * @description: 创建游戏项目
 * @param {*}
 * @return {*}
 */

 const createGame = (params, ctx) => {
   const sourcePath = path.normalize(`${projectBasePath}template`);
   const targetPath = path.normalize(`${projectBasePath}${params.projectName}`);
  try {
    fs.copySync(sourcePath, targetPath);
  } catch (error) {
    ctx.body = {
      code: CODE.FAIL,
      msg: '项目创建失败',
      data: null,
    };
    return;
  }
 }

router.post('/create', async (ctx) => {
  let requestParams = ctx.request.body;
  createGame(requestParams, ctx);
  ctx.body = {
    code: CODE.SUCCESS,
    msg: '项目创建成功',
    data: null,
  };
  return;
});

module.exports = router.routes();