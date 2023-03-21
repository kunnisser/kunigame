/**
 * @Author: kunnisser
 * @Date: 2023-03-20 16:09:30
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-21 11:42:25
 * @FilePath: /kunigame/server/route/scene/implement/assetsManager.js
 * @Description: ---- 资源管理实现 ----
 */

const path = require("path");
const T = require("@babel/types");
const { hivePath } = require("../../project/path/index");
const Utils = require("../../../common/utils.js");

const addAssetsToScene = (params) => {
  const { key, url, projectName, sceneName } = params;
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
  Utils.findAstNode(ast, {
    AssignmentExpression: (path) => {
      if (path.node.left.property.name === "resources") {
        const properties = path.get("right").node.properties;
        properties.push(
          T.objectProperty(T.identifier(key), T.stringLiteral(url))
        );
        path.stop();
      }
    }
  });
  Utils.astToFile(ast, targetPath);
  return ast;
};

module.exports = {
  addAssetsToScene
};
