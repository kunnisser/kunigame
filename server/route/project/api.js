/**
 * @Author: kunnisser
 * @Date: 2021-02-26 16:47:50
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-26 17:30:17
 * @FilePath: /kunigame/server/route/project/api.js
 * @Description: ---- 项目操作API ----
 */

var router = require('koa-router')();
var fs = require('fs-extra');
var path = require('path');
router.get('/', async (ctx) => {
  ctx.body = 'projectApi';
});

const projectBasePath =  path.resolve('../', 'projects');

/**
 * @description: 创建游戏项目 [createGame]
 * @param {*}
 * @return {*}
 */

 const createGame = (params, ctx) => {
   const sourcePath = path.normalize(`${projectBasePath}/template`);
   const targetPath = path.normalize(`${projectBasePath}/${params.projectName}`);
   console.log(sourcePath);
   console.log(targetPath);
  fs.copySync(sourcePath, targetPath, function (err) {
    if (err) {
      ctx.body = {
        code: CODE.FAIL,
        msg: err,
        data: null,
      };
      return;
    }
  });
 }

router.post('/create', async (ctx) => {
  let requestParams = ctx.request.body;
  createGame(requestParams, ctx);
  ctx.body = {
    code: CODE.SUCCESS,
    msg: '项目创建成功',
    data: null,
  };
});

module.exports = router.routes();