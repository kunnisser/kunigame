/**
 * @Author: kunnisser
 * @Date: 2021-04-16 20:52:14
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-04-18 18:34:35
 * @FilePath: \kunigame\server\route\project\implement\removeGame.js
 * @Description: ---- 删除游戏项目 ----
 */
var fs = require('fs-extra');
var path = require('path');
var { projectBasePath, sourcePath } = require('../path/index');
var { switchGameProjectFromUrl } = require('./switchGame');

/**
 * @description: 删除游戏项目 [removeGame]
 * @param {string} projectName 项目名称
 * @return {void}
 */
const removeGame = async (param, ctx) => {
  if (param.projectName === param.currentProjectName) {
    switchGameProjectFromUrl(`ts@/kuni/main`);
  }
  const targetPath = path.normalize(
    `${projectBasePath}/hive/${param.projectName}`
  );
  fs.removeSync(targetPath);
};

exports.removeGame = removeGame;
