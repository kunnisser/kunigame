/**
 * @Author: kunnisser
 * @Date: 2021-02-28 21:12:06
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-19 23:30:48
 * @FilePath: \kunigame\server\route\test\api.js
 * @Description: ---- 测试接口 ----
 */
var T = require('@babel/types');
var router = require('koa-router')();
var path = require('path');
var routeUtils = require('../../common/route.js');
var Utils = require('../../common/utils.js');
var { hivePath } = require('../project/path/index.js');
const fs = require('fs');

router.get('/', async (ctx) => {
  ctx.body = 'testApi';
});

const gameWorkBenchPath = path.resolve('./', 'editor/page/workbench');

const switchGameProject = (currentGamePath) => {
  const ast = Utils.fileToAst(currentGamePath);
  Utils.findAstNode(ast, {
    ImportDeclaration: (path) => {
      if (path.key == 2) {
        path.node.source.value = 'ts@/hive/nnsd/main';
      }
    },
    ExportNamedDeclaration: (path) => {
      console.log(path.node.declaration.declarations[0]);
      path.node.declaration.declarations[0] = T.variableDeclarator(
        T.identifier('EditGameName'),
        T.stringLiteral('nnsd')
      );
    },
  });
  Utils.astToFile(ast, currentGamePath);
  return ast;
};

// 默认测试
router.get('/index', async (ctx) => {
  try {
    const currentGamePath = path.normalize(`${gameWorkBenchPath}/canvas.tsx`);
    const ast = switchGameProject(currentGamePath);
    ctx.body = {
      code: CODE.SUCCESS,
      msg: 'test OK',
      data: ast,
    };
    return;
  } catch (error) {
    routeUtils.normalErrorHandler(ctx, error);
  }
});

router.get('/ast', async (ctx) => {
  const targetPath = path.normalize(
    path.resolve(hivePath, 'nnsd', 'src/state', 'start', 'scene.ts')
  );
  const ast = Utils.fileToAst(targetPath);
  ctx.body = {
    code: CODE.SUCCESS,
    msg: 'test OK',
    data: ast,
  };
});

// 查询当前项目的资源文件
router.get('/assets', async (ctx) => {
  const requestParams = ctx.request.query;
  const { projectName, assetsType } = requestParams;
  const assetsPath = path.normalize(
    path.resolve(hivePath, `${projectName}/assets/${assetsType}`)
  );
  const assets = fs.readdirSync(assetsPath, (ret) => {
    console.warn(ret);
  });
  console.log(assets);
  ctx.body = {
    code: CODE.SUCCESS,
    msg: 'test OK',
    data: {
      path: assetsPath,
      assets,
    },
  };
});

module.exports = router.routes();
