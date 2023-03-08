/**
 * @Author: kunnisser
 * @Date: 2021-03-07 21:38:50
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-08 23:22:11
 * @FilePath: \kunigame\server\route\project\path\index.js
 * @Description: ---- 项目路径汇总 ----
 */
const path = require('path');

// 游戏项目目录路径
const basePath = path.normalize(process.cwd());

// 项目工程路径
const projectBasePath = path.normalize(path.resolve(basePath, 'projects'));

// 项目模板路径
const sourcePath = `${projectBasePath}/template`;

// 项目仓库路径
const hivePath = path.normalize(path.resolve(projectBasePath, 'hive'));

// 所展示的编辑器画布路径
const gameWorkBenchPath = path.normalize(
  path.resolve(basePath, 'editor/page/workbench/canvas.tsx')
);

module.exports = {
  projectBasePath,
  sourcePath,
  hivePath,
  gameWorkBenchPath,
};
