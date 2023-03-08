/**
 * @Author: kunnisser
 * @Date: 2023-03-07 14:14:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-08 16:40:41
 * @FilePath: /kunigame/server/route/scene/implement/generateElementExpression.js
 * @Description: ---- 游戏属性的ast表达式实现 ----
 */
const T = require("@babel/types");

/**
 * @description: 分析游戏对象属性值的类型并转换为ast对象
 * @param {*} val
 * @return {*}
 */
const convertGamePropertyToExpression = (val) => {
  console.log(val);
  const type = typeof val;
  const convertMaps = {
    "number": T.numericLiteral,
    "string": T.stringLiteral,
    "boolean": T.booleanLiteral
  };
  return convertMaps[type](val);
};

/**
 * @description: 从memberExpression嵌套转为嵌套多维数组，进行后面的扁平化对比
 * @param {*} target
 * @param {*} len
 * @return {*}
 */
const transformToArray = (target, len) => {
  if (len > 0 && target.object.type === "MemberExpression") {
    const newTarget = target.object;
    len -= 1;
    return [transformToArray(newTarget, len), target.property.name];
  } else if (target.object.name) {
    return [[target.object.name], target.property.name];
  }
};

/**
 * @description: 根据编辑记录，对应的键名 。构造出属性 赋值的代码表达式
 * @param {*} editRecords 操作记录
 * @param {*} key 游戏对象变量名
 * @param {*} recordKey 游戏对象属性名
 * @return {xxx.xx = xx}
 */
const generateExpressionStatement = (editRecords, key, recordKey) => {
  const targetRecord = editRecords[key];
  const targetRecordValue = targetRecord[recordKey];
  const recordKeyArr = recordKey.split("-");
  const memberExpression =
    recordKeyArr.length > 1
      ? T.memberExpression(
          T.memberExpression(T.identifier(key), T.identifier(recordKeyArr[0])),
          T.identifier(recordKeyArr[1])
        )
      : T.memberExpression(T.identifier(key), T.identifier(recordKey));
  console.log(typeof targetRecordValue);
  if (typeof targetRecordValue === "object") {
    // set赋值
    return T.callExpression(
      T.memberExpression(
        T.memberExpression(T.identifier(key), T.identifier(recordKey)),
        T.identifier("set")
      ),
      [
        convertGamePropertyToExpression(targetRecordValue.x),
        convertGamePropertyToExpression(targetRecordValue.y)
      ]
    );
  } else {
    // 等号赋值
    return T.expressionStatement(
      T.assignmentExpression(
        "=",
        memberExpression,
        convertGamePropertyToExpression(targetRecordValue)
      )
    );
  }
};

module.exports = {
  convertGamePropertyToExpression,
  generateExpressionStatement,
  transformToArray
};
