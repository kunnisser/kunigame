/**
 * @Author: kunnisser
 * @Date: 2021-03-07 00:34:03
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-04-16 21:05:07
 * @FilePath: \kunigame\server\route\project\implement\createGame.js
 * @Description: ---- 创建项目 ----
 */
var fs = require('fs-extra');
var path = require('path');
var { switchGameProject } = require('./switchGame.js');
var { projectBasePath, sourcePath } = require('../path/index');

/**
 * @description: 创建游戏项目 [createGame]
 * @param { string } projectName 项目名称
 * @return {void}
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
