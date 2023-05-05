/*
 * @Author: kunnisser
 * @Date: 2023-02-07 16:50:33
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-05 14:43:49
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/index.ts
 * @Description: ---- 工具集 ----
 */
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import DragPosition from "./common/drag";
import PickTool from "./common/pick";
import RotateTool from "./common/rotate";
import ScaleTool from "./common/scale";
import Game from "ts@/kuni/lib/core";
import { GET_GAME_ITEM } from "editor@/common/gameStore/scene/action";
import { Point } from "pixi.js";
class EditorTools {
  public game: Game;
  public toolGroup: KnGroup;
  public dragTool: DragPosition;
  public pickTool: PickTool;
  public rotateTool: RotateTool;
  public scaleTool: ScaleTool;
  public editTargetElement: any;
  public type: string;
  public groupMap: any;
  public relativeX: number;
  public relativeY: number;
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

      this.editTargetElement = null;
      this.toolGroup = game.add.group("tool", game.world);
      this.dragTool = new DragPosition(game, this.toolGroup);
      this.pickTool = new PickTool(game, this.toolGroup);
      this.rotateTool = new RotateTool(game, this.toolGroup);
      this.scaleTool = new ScaleTool(game, this.toolGroup);
      this.groupMap = {
        "pick": {
          context: this.pickTool,
          container: this.pickTool.pickGroup,
          boot: this.pickTool.onBoot
        },
        "drag": {
          context: this.dragTool,
          container: this.dragTool.moveGroup,
          boot: this.dragTool.onBoot
        },
        "rotate": {
          context: this.rotateTool,
          container: this.rotateTool.rotateGroup,
          boot: null
        },
        "scale": {
          context: this.scaleTool,
          container: this.scaleTool.scaleGroup,
          boot: null
        }
      };

      // 初始化操作类型
      const defaultType =
        game.redux.store.getState().sceneReducer.operationType;
      this.switchOperationType(defaultType);
      this.bindClickEvent(game);
      this.intialCancelandResume();
      console.log("开发模式已启用");
    } catch (e) {
      console.log(e);
    }
  }

  // 切换模式，如果已选中对象，切换显示编辑模块
  switchOperationType(type) {
    this.reset();
    this.type = type;
    const gameItem: any =
      this.game.redux.store.getState().sceneReducer.gameItem;
    gameItem && this.drawOperationComponent(gameItem);
  }

  // 定义拖拽撤销恢复功能,覆盖式
  intialCancelandResume() {
    // 定义覆盖式取消事件
    document.onkeyup = (e: KeyboardEvent) => {
      e.key === "Escape" &&
        ((this.groupMap[this.type].container.visible = false),
        // 同时清空选中元素
        this.game.redux.dispatch({
          type: GET_GAME_ITEM,
          payload: null
        }));
    };
    document.onkeydown = (e) => {
      const currentActionStack = this.game.currentScene.cancelActionStack;
      const resumeActionStack = this.game.currentScene.resumeActionStack;
      if (
        currentActionStack &&
        currentActionStack.length > 0 &&
        e.key === "z" &&
        (e.ctrlKey || e.metaKey)
      ) {
        const prevAction = currentActionStack.pop();

        resumeActionStack.push(prevAction);
        if (prevAction) {
          const { prevX, prevY } = prevAction?.position;
          this.onClickHandler(prevAction?.target);
          prevAction?.target.position.set(
            prevX - this.relativeX,
            prevY - this.relativeY
          );
          this.groupMap[this.type].container.position.set(prevX, prevY);
        }
      } else if (
        resumeActionStack &&
        resumeActionStack.length > 0 &&
        e.key === "y" &&
        (e.ctrlKey || e.metaKey)
      ) {
        const resumeAction = resumeActionStack.pop();

        currentActionStack.push(resumeAction);
        if (resumeAction) {
          const { nextX, nextY } = resumeAction?.position;
          this.onClickHandler(resumeAction?.target);
          resumeAction?.target.position.set(
            nextX - this.relativeX,
            nextY - this.relativeY
          );
          this.groupMap[this.type].container.position.set(nextX, nextY);
        }
      }
    };
  }

  // 给当前场景元素遍历绑定选中操作
  bindClickEvent(game: Game) {
    const displayList = game.currentScene.children;
    this.recursionBind(displayList);
  }

  recursionBind(list) {
    list.map((item: any) => {
      if (item.constructor.name === "KnGroup") {
        this.recursionBind(item.children);
      } else {
        this.bootDrag(item);
      }
    });
  }

  bootDrag = (item: any) => {
    item.interactive = true;

    const bootDragClick = () => {
      this.onClickHandler(item);
    };
    // 注意，由于scene被缓存，需要先清空绑定事件
    item.off("click").on("click", bootDragClick);
  };

  onClickHandler = (item: any) => {
    // inspector注入目标
    // 设置选中的元素
    this.game.redux.dispatch({
      type: GET_GAME_ITEM,
      payload: item
    });
    this.editTargetElement = item;
    this.drawOperationComponent(item);
  };

  // 绘制对应的操作组件
  drawOperationComponent(item) {
    // 获取点击元素的全局坐标（考虑画布缩放）
    const loopGlobalCoord = (item, x, y) => {
      let [relativeX, relativeY] = [x, y];
      if (item.parent.constructor.name === "KnGroup") {
        relativeX += item.parent.x;
        relativeY += item.parent.y;
        loopGlobalCoord(item.parent, relativeX, relativeY);
      }
      return [relativeX, relativeY];
    };
    const [x, y] = loopGlobalCoord(item, 0, 0);

    // 克隆目标的宽高和初始坐标
    const cloneItem: any = {
      x: item.x + x,
      y: item.y + y,
      width: item.width,
      height: item.height,
      anchor: null
    };

    // 适配容器container里没有anchor, 同时根据容器的bounds重新定义cloneItem的数据
    if (!item.anchor) {
      cloneItem.anchor = new Point(0, 0);
      const bounds = item.getLocalBounds();
      cloneItem.width = bounds.x + bounds.width;
      cloneItem.height = bounds.y + bounds.height;
    } else {
      cloneItem.anchor = item.anchor;
    }
    const { context, boot } = this.groupMap[this.type];
    boot && boot.bind(context)(cloneItem);
  }

  reset() {
    this.dragTool.moveGroup.visible = false;
    this.pickTool.pickGroup.visible = false;
    this.pickTool.isPulling = false;
    this.rotateTool.rotateGroup.visible = false;
    this.scaleTool.scaleGroup.visible = false;
  }
}

export default EditorTools;
