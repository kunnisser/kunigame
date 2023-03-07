/*
 * @Author: kunnisser
 * @Date: 2023-03-07 09:42:36
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-07 09:42:38
 * @FilePath: /kunigame/server/route/scene/implement/updateSceneElement.js
 * @Description: ---- 游戏场景内元素更新 ----
 */
const path = require("path");
const T = require("@babel/types");
const { hivePath } = require("../../project/path/index");
const Utils = require("../../../common/utils.js");
const suffixName = "scene.ts";

/**
 * @description: 更新场景元素的代码
 * @param {*} requestParams 【projectName, sceneName, editRecords】
 * @return {ast}
 */
const updateScene = (requestParams) => {
  const { projectName, sceneName, editRecords } = requestParams;
  const targetPath = path.normalize(
    path.resolve(
      hivePath,
      projectName.toLowerCase(),
      "src/state",
      sceneName.toLowerCase(),
      suffixName
    )
  );
  const actionKeys = Object.keys(editRecords);
  const ast = Utils.fileToAst(targetPath);

  const transformToArray = (target, len) => {
    if (len > 0 && target.object.type === "MemberExpression") {
      const newTarget = target.object;
      len -= 1;
      return [transformToArray(newTarget, len), target.property.name];
    } else if (target.object.name) {
      return [[target.object.name], target.property.name];
    }
  };

  actionKeys.map((key) => {
    Utils.findAstNode(ast, {
      ExpressionStatement: (path) => {
        const left = path.node.expression.left;
        if (
          left &&
          left.object &&
          (left.object.type === "Identifier" ||
            left.object.type === "MemberExpression")
        ) {
          const values = editRecords[key];
          const valueKeys = Object.keys(values);
          for (let valueKey of valueKeys) {
            const keyStrArray = valueKey.split("-");
            const keyVAlue = values[valueKey];
            const len = keyStrArray.length;
            const flatKeys = transformToArray(left, len)
              .flat(Infinity)
              .join("-");

            console.log(flatKeys === key + "-" + valueKey);

            if (flatKeys === key + "-" + valueKey) {
              path.node.expression.right = T.numericLiteral(keyVAlue);
            }
          }
        }
      }
    });
  });

  // 更新到代码
  Utils.astToFile(ast, targetPath);

  return ast;
};

exports.updateScene = updateScene;
