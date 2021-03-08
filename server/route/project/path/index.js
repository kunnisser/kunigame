/**
 * @Author: kunnisser
 * @Date: 2021-03-07 21:38:50
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-03-07 21:56:24
 * @FilePath: \kunigame\server\route\project\path\index.js
 * @Description: ---- 项目路径汇总 ----
 */
const path = require('path');
// 游戏项目目录路径
const projectBasePath =  path.resolve('./', 'projects');
const sourcePath = path.normalize(`${projectBasePath}/template`);
const hivePath = path.resolve(projectBasePath, 'hive');
const gameWorkBenchPath = path.normalize(path.resolve('./', 'editor/page/workbench/canvas.tsx'));

module.exports = {
  projectBasePath,
  sourcePath,
  hivePath,
  gameWorkBenchPath
};
