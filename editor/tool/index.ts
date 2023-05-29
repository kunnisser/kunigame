/*
 * @Author: kunnisser
 * @Date: 2023-03-02 16:09:37
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-29 14:46:32
 * @FilePath: /kunigame/editor/tool/index.ts
 * @Description: ---- 函数工具集 ----
 */

export const isObjectEmpty = (obj: Object) => {
  return Object.keys(obj).length === 0 && obj.constructor.name === "Object";
};

export const transformAllToArray = (item: any): Array<any> => {
  // item可能为null
  return Object.prototype.toString.call(item) === "[object Array]"
    ? item
    : item
    ? [item]
    : null;
};

export const isMulitPick = (item: any) => {
  return (
    Object.prototype.toString.call(item) === "[object Array]" && item.length > 1
  );
};
