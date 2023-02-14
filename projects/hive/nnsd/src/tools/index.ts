/*
 * @Author: kunnisser
 * @Date: 2023-02-07 16:50:33
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-14 17:33:37
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/index.ts
 * @Description: ---- 工具集 ----
 */
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import DragPosition from "./common/drag";

class EditorTools {
  public toolGroup: KnGroup;
  public dragTool: DragPosition;
  constructor(game) {
    // 在当前画布注入工具组
    try {
      this.toolGroup = game.add.group("tool", game.world);
      this.dragTool = new DragPosition(game, this.toolGroup);
      this.dragTool.moveGroup.visible = false;
      console.log("开发模式已启用");
      game.currentScene;
    } catch (e) {
      console.log(e);
    }
  }
}

export default EditorTools;
