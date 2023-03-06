/**
 * @Author: kunnisser
 * @Date: 2021-03-07 00:35:25
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-06 13:43:26
 * @FilePath: /kunigame/server/route/project/implement/switchGame.js
 * @Description: ---- 切换项目 ----
 */
var T = require("@babel/types");
var path = require("path");
var Utils = require("../../../common/utils.js");
var { gameWorkBenchPath } = require("../path/index");

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
    ExportNamedDeclaration: (path) => {
      path.node.declaration.declarations[0] = T.variableDeclarator(
        T.identifier("EditGameName"),
        T.stringLiteral(projectName)
      );
    }
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
    }
  });
  Utils.astToFile(ast, gameWorkBenchPath);
};

exports.switchGameProject = switchGameProject;
exports.switchGameProjectFromUrl = switchGameProjectFromUrl;
