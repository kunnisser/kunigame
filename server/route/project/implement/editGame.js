/**
 * @Author: kunnisser
 * @Date: 2021-04-18 19:03:03
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-04-18 19:07:22
 * @FilePath: \kunigame\server\route\project\implement\editGame.js
 * @Description: ---- 编辑游戏配置 ----
 */
var fs = require('fs-extra');
var path = require('path');
var { projectBasePath, sourcePath } = require('../path/index');

/**
 * @description: 编辑游戏项目 [editGameProject]
 * @param { string } projectName 项目名称
 * @return {void}
 */
const editGameProject = async (params, ctx) => {
  const targetPath = path.normalize(
    `${projectBasePath}/hive/${params.projectName}`
  );
  const gameConfigPath = path.normalize(`${targetPath}/schema/game.json`);
  fs.outputJsonSync(gameConfigPath, params);
};

exports.editGameProject = editGameProject;
