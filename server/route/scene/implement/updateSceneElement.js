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
const {
  convertGamePropertyToExpression,
  generateExpressionStatement,
  transformToArray
} = require("./generateElementExpression");
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

  actionKeys.map((key) => {
    Utils.findAstNode(ast, {
      VariableDeclaration: (path) => {
        const declaration = path.node.declarations[0];
        if (declaration.id.name === key) {
          // 对应key游戏场景元素的相关属性操作
          const record = editRecords[key];
          // 操作名数组
          const recordKeys = Object.keys(record);
          for (let recordKey of recordKeys) {
            let isNewExpression = true;
            const recordKeyArr = recordKey.split("-");
            const recordValue = record[recordKey];
            const len = recordKeyArr.length;
            // 从sprite对象构建表达式中进行调整修改
            if (recordKey === "texture") {
              isNewExpression = false;
              declaration.init.arguments[1] = T.stringLiteral(
                recordValue.value[0]
              );
            }
            Utils.findAstNode(ast, {
              // 过滤已有的等号表达式
              ExpressionStatement: (path) => {
                const left = path.node.expression.left;
                if (
                  left &&
                  left.object &&
                  (left.object.type === "Identifier" ||
                    left.object.type === "MemberExpression")
                ) {
                  // 先把MemberExpression转多维数组，然后扁平化进行比对
                  const flatKeys = transformToArray(left, len)
                    .flat(Infinity)
                    .join("-");
                  if (flatKeys === key + "-" + recordKey) {
                    isNewExpression = false;
                    path.node.expression.right =
                      convertGamePropertyToExpression(recordValue);
                    path.stop();
                  }
                }
              },

              // 过滤已有的等号表达式
              CallExpression: (path) => {
                const memberObject = path.node.callee.object;
                const operateProperty = path.node.callee.property;
                if (
                  memberObject &&
                  memberObject.type === "MemberExpression" &&
                  operateProperty
                ) {
                  if (
                    memberObject.object.name === key &&
                    memberObject.property.name === recordKey
                  ) {
                    console.log(key, recordKey);
                    isNewExpression = false;
                    path.node.arguments = [
                      convertGamePropertyToExpression(recordValue.x),
                      convertGamePropertyToExpression(recordValue.y)
                    ];
                    path.stop();
                  }
                }
              }
            });

            // 插入 赋值表达式
            isNewExpression &&
              path.insertAfter(
                generateExpressionStatement(editRecords, key, recordKey)
              );
          }
          path.stop();
        }
      }
    });
  });

  // 更新到代码
  Utils.astToFile(ast, targetPath);

  return ast;
};

exports.updateScene = updateScene;
