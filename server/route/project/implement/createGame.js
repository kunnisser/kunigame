/**
 * @Author: kunnisser
 * @Date: 2021-03-07 00:34:03
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-04-11 20:47:28
 * @FilePath: \kunigame\server\route\project\implement\createGame.js
 * @Description: ---- 创建项目 ----
 */
var fs = require('fs-extra');
var path = require('path');
var { switchGameProject } = require('./switchGame.js');
var { projectBasePath, sourcePath } = require('../path/index');
/**
 * @description: 创建游戏项目 [createGame]
 * @param {*}
 * @return {*}
 */

const createGame = async (params, ctx) => {
  const targetPath = path.normalize(
    `${projectBasePath}/hive/${params.projectName}`
  );
  const gameConfigPath = path.normalize(`${targetPath}/schema/game.json`);
  fs.copySync(sourcePath, targetPath);
  switchGameProject(params);
  fs.outputJsonSync(gameConfigPath, params);
};

exports.createGame = createGame;
