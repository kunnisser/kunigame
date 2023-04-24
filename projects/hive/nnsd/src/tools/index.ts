/*
 * @Author: kunnisser
 * @Date: 2023-02-07 16:50:33
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-24 17:33:05
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/index.ts
 * @Description: ---- 工具集 ----
 */
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import DragPosition from "./common/drag";
import PickTool from "./common/pick";

class EditorTools {
  public toolGroup: KnGroup;
  public dragTool: DragPosition;
  public pickTool: PickTool;
  public editTargetElement: any;
  constructor(game) {
    // 在当前画布注入工具组
    try {
      // 如果已存在toolGroup需要先移除
      const toolGroup = game.world.getChildByName("tool");
      toolGroup && game.world.removeChild(toolGroup);
      this.toolGroup = game.add.group("tool", game.world);
      this.dragTool = new DragPosition(game, this.toolGroup);
      this.dragTool.moveGroup.visible = false;
      this.pickTool = new PickTool(game, this.toolGroup);
      this.pickTool.moveGroup.visible = false;
      this.editTargetElement = null;
      console.log("开发模式已启用");
    } catch (e) {
      console.log(e);
    }
  }

  reset() {
    this.dragTool.moveGroup.visible = false;
  }
}

export default EditorTools;
