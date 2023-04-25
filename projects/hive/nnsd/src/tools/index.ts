/*
 * @Author: kunnisser
 * @Date: 2023-02-07 16:50:33
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-25 17:36:19
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/index.ts
 * @Description: ---- 工具集 ----
 */
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import DragPosition from "./common/drag";
import PickTool from "./common/pick";
import RotateTool from "./common/rotate";
import Game from "ts@/kuni/lib/core";
class EditorTools {
  public game: Game;
  public toolGroup: KnGroup;
  public dragTool: DragPosition;
  public pickTool: PickTool;
  public rotateTool: RotateTool;
  public editTargetElement: any;
  public type: string;
  public groupMap: any;
  constructor(game) {
    this.game = game;
    // 在当前画布注入工具组
    try {
      // 如果已存在toolGroup需要先移除
      const toolGroup = game.world.getChildByName("tool");
      toolGroup && game.world.removeChild(toolGroup);

      // 设置画布可交互
      game.stage.interactive = true;
      game.stage.hitArea = game.app.screen;

      this.toolGroup = game.add.group("tool", game.world);
      this.dragTool = new DragPosition(game, this.toolGroup);
      this.pickTool = new PickTool(game, this.toolGroup);
      this.rotateTool = new RotateTool(game, this.toolGroup);
      this.editTargetElement = null;
      this.groupMap = {
        "pick": this.pickTool.pickGroup,
        "drag": this.dragTool.moveGroup,
        "rotate": this.rotateTool.rotateGroup
      };

      // 初始化操作类型
      const defaultType =
        game.redux.store.getState().sceneReducer.operationType;
      this.switchOperationType(defaultType);
      console.log("开发模式已启用");
    } catch (e) {
      console.log(e);
    }
  }

  switchOperationType(type) {
    // 切换模式，如果已选中对象，切换显示编辑模块
    this.reset();
    this.type = type;
    const gameItem: any =
      this.game.redux.store.getState().sceneReducer.gameItem;
    gameItem && (this.groupMap[type].visible = true);
  }

  reset() {
    this.dragTool.moveGroup.visible = false;
    this.pickTool.pickGroup.visible = false;
    this.rotateTool.rotateGroup.visible = false;
  }
}

export default EditorTools;
