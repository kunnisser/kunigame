/**
 * @Author: kunnisser
 * @Date: 2021-02-26 16:47:50
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-28 22:02:44
 * @FilePath: \kunigame\server\route\project\api.js
 * @Description: ---- 项目操作API ----
 */

var router = require('koa-router')();
var fs = require('fs-extra');
var path = require('path');
var babel = require('@babel/core');
var normalErrorHandler = require('../../common/route.js');
router.get('/', async (ctx) => {
  ctx.body = 'projectApi';
});



// 游戏项目目录路径
const projectBasePath =  path.resolve('../', 'projects');


/**
 * @description: 创建游戏项目 [createGame]
 * @param {*}
 * @return {*}
 */

 const createGame = (params, ctx) => {
   const sourcePath = path.normalize(`${projectBasePath}/template`);
   const targetPath = path.normalize(`${projectBasePath}/hive/${params.projectName}`);
   const gameConfigPath = path.normalize(`${targetPath}/schema/game.json`);
   const initialGamePath = path
   try {
    fs.copySync(sourcePath, targetPath);
    fs.outputJsonSync(gameConfigPath, params);
   } catch (error) {
    normalErrorHandler(ctx, error);
   }
 }

 
// 游戏编辑器路径
const gameWorkBenchPath = path.resolve('../', 'editor/page/workbench');

// 切换游戏项目
const switchGameProject = (projectName) => {
  const currentGamePath = path.normalize(`${gameWorkBenchPath}/canvas.tsx`);
  const ast = babel.transformFileSync(currentGamePath).ast;
  return ast;
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