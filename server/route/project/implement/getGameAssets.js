/**
 * @Author: kunnisser
 * @Date: 2023-03-14 14:39:01
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-14 22:55:50
 * @FilePath: \kunigame\server\route\project\implement\getGameAssets.js
 * @Description: ---- 游戏项目资源 ----
 */

const path = require('path');
const fs = require('fs');
const { hivePath } = require('../path/index');

const getGameAssetsList = (query) => {
  const { projectName, assetsType } = query;
  const assetsPath = path.normalize(
    path.resolve(hivePath, `${projectName}/assets/${assetsType}`)
  );
  const assets = fs.readdirSync(assetsPath);
  return [assets];
};

module.exports = getGameAssetsList;
