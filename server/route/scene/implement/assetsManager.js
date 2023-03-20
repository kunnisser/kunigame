/**
 * @Author: kunnisser
 * @Date: 2023-03-20 16:09:30
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-20 16:16:24
 * @FilePath: /kunigame/server/route/scene/implement/assetsManager.js
 * @Description: ---- 资源管理实现 ----
 */

const path = require("path");
const T = require("@babel/types");
const { hivePath } = require("../../project/path/index");
const Utils = require("../../../common/utils.js");

const addAssetsToScene = (params) => {
  const { key, value, projectName, sceneName } = params;
  const targetPath = path.normalize(
    path.resolve(
      hivePath,
      projectName.toLowerCase(),
      "src/state",
      sceneName.toLowerCase(),
      "scene.ts"
    )
  );
  const ast = Utils.fileToAst(targetPath);
  return ast;
};

module.exports = {
  addAssetsToScene
};
