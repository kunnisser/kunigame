/*
 * @Author: kunnisser
 * @Date: 2023-02-07 16:50:33
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-07 17:16:14
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/index.ts
 * @Description: ---- 工具集 ----
 */
import DragPosition from "./common/drag";

class EditorTools {
  constructor(game) {
    new DragPosition(game);
    console.log("开发模式已启用");
  }
}

export default EditorTools;
