/**
 * @Author: kunnisser
 * @Date: 2023-03-14 14:39:01
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-15 15:10:09
 * @FilePath: /kunigame/server/route/project/implement/getGameAssets.js
 * @Description: ---- 游戏项目资源 ----
 */

const path = require("path");
const fs = require("fs");
const { hivePath } = require("../path/index");

const getGameAssetsList = (query) => {
  const { projectName } = query;
  const imagesPath = path.normalize(
    path.resolve(hivePath, `${projectName}/assets/images`)
  );
  const atlasPath = path.normalize(
    path.resolve(hivePath, `${projectName}/assets/atlas`)
  );
  const fontPath = path.normalize(
    path.resolve(hivePath, `${projectName}/assets/fonts`)
  );
  const imagesAssets = fs.readdirSync(imagesPath);
  const atlasAssets = fs.readdirSync(atlasPath);
  const fontAssets = fs.readdirSync(fontPath);

  return [
    {
      images: imagesAssets,
      atlas: atlasAssets,
      font: fontAssets
    }
  ];
};

module.exports = getGameAssetsList;
