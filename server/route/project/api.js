/**
 * @Author: kunnisser
 * @Date: 2021-02-26 16:47:50
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-04-18 19:09:12
 * @FilePath: \kunigame\server\route\project\api.js
 * @Description: ---- 项目操作API ----
 */

var router = require('koa-router')();
var routeUtils = require('../../common/route');
var {
  createGame,
  editGameProject,
  switchGameProject,
  getGameProjectList,
  removeGame,
} = require('./implement/index');

/**
 * 游戏项目接口列表
 * */
router.get('/', async (ctx) => {
  ctx.body = 'projectApi';
});

/**
 * @description
 * @param {*}
 * @return {*}
 */
router.post('/create', async (ctx) => {
  try {
    let requestParams = ctx.request.body;
    await createGame(requestParams, ctx);
    ctx.body = {
      code: CODE.SUCCESS,
      msg: '项目创建成功',
      data: null,
    };
    return;
  } catch (error) {
    routeUtils.normalErrorHandler(ctx, error);
  }
});

// 切换项目
router.post('/change', async (ctx) => {
  try {
    let requestParams = ctx.request.body;
    await switchGameProject(requestParams);
    ctx.body = {
      code: CODE.SUCCESS,
      msg: `${requestParams.projectName}正在打开...`,
      data: null,
    };
  } catch (error) {
    routeUtils.normalErrorHandler(ctx, error);
  }
});

// 编辑已有项目
router.post('/edit', async (ctx) => {
  try {
    let projectParam = ctx.request.body;
    await editGameProject(projectParam);
    ctx.body = {
      code: CODE.SUCCESS,
      msg: `${projectParam.projectName}设置中....`,
      data: null,
    };
  } catch (error) {
    routeUtils.normalErrorHandler(ctx, error);
  }
});

// 删除已有项目
router.delete('/remove', async (ctx) => {
  try {
    const param = ctx.request.body;
    console.log(param);
    await removeGame(param);
    ctx.body = {
      code: CODE.SUCCESS,
      msg: '项目已删除',
      data: null,
    };
    return;
  } catch (error) {
    routeUtils.normalErrorHandler(ctx, error);
  }
});

// 查询已有项目
router.get('/list', async (ctx) => {
  try {
    const list = await getGameProjectList();
    ctx.body = {
      code: CODE.SUCCESS,
      msg: null,
      data: list,
    };
    return;
  } catch (error) {
    routeUtils.normalErrorHandler(ctx, error);
  }
});

module.exports = router.routes();
