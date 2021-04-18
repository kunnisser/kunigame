/**
 * @Author: kunnisser
 * @Date: 2021-03-07 00:35:25
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-04-18 18:27:12
 * @FilePath: \kunigame\server\route\project\implement\switchGame.js
 * @Description: ---- 切换项目 ----
 */
var path = require('path');
var Utils = require('../../../common/utils.js');
var { gameWorkBenchPath } = require('../path/index');

/**
 * @description: 切换游戏项目
 * @param {*} projectName 项目名称
 * @return {void}
 */
const switchGameProject = (params) => {
  // 游戏编辑器路径
  const ast = Utils.fileToAst(gameWorkBenchPath);
  const projectName = params.projectName;
  Utils.findAstNode(ast, {
    ImportDeclaration: (path) => {
      if (path.key == 2) {
        path.node.source.value = `ts@/hive/${projectName}/main`;
      }
    },
  });
  Utils.astToFile(ast, gameWorkBenchPath);
};

const switchGameProjectFromUrl = (url) => {
  const ast = Utils.fileToAst(gameWorkBenchPath);
  Utils.findAstNode(ast, {
    ImportDeclaration: (path) => {
      if (path.key == 2) {
        path.node.source.value = url;
      }
    },
  });
  Utils.astToFile(ast, gameWorkBenchPath);
};

exports.switchGameProject = switchGameProject;
exports.switchGameProjectFromUrl = switchGameProjectFromUrl;
