/*
 * @Author: kunnisser
 * @Date: 2023-02-07 16:50:33
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-15 16:02:41
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/index.ts
 * @Description: ---- 工具集 ----
 */
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import DragPosition from "./common/drag";
import PickTool from "./common/pick";
import RotateTool from "./common/rotate";
import ScaleTool from "./common/scale";
import Game from "ts@/kuni/lib/core";
import {
  GET_GAME_ITEM,
  clearEditGameItem,
  updateEditGameItem,
  setCancelActionStack,
  setResumeActionStack
} from "editor@/common/gameStore/scene/action";
import { Point } from "pixi.js";
import { isMulitPick } from "editor@/tool";
import * as _ from "lodash";
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
    // 点击单个元素或者框选单个
    gameItem && !isMulitPick(gameItem)
      ? this.drawOperationComponent(gameItem)
      : this.game.redux.dispatch({
          type: GET_GAME_ITEM,
          payload: null
        });
  }

  // 定义拖拽撤销恢复功能,覆盖式
  intialCancelandResume() {
    // 定义覆盖式取消事件
    document.onkeyup = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === "Shift") {
        this.pickTool.isMulitple = false;
      }
      e.key === "Escape" &&
        ((this.groupMap[this.type].container.visible = false),
        // 同时清空选中元素
        this.game.redux.dispatch({
          type: GET_GAME_ITEM,
          payload: null
        }));
    };
    document.onkeydown = (e) => {
      e.preventDefault();
      const { cancelActionStack, resumeActionStack } =
        this.game.redux.store.getState().sceneReducer;

      if (e.key === "Shift") {
        this.pickTool.isMulitple = true;
      }
      if (cancelActionStack && e.key === "z" && (e.ctrlKey || e.metaKey)) {
        const prevAction = cancelActionStack.pop();
        if (prevAction) {
          resumeActionStack.push(prevAction);
          const editors: any = [];
          const targets = prevAction?.target.map((target, index) => {
            const { prev } = prevAction?.stack[index];
            editors.push(prev);
            const keys = Object.keys(prev);
            keys.map((key) => {
              return _.set(target, key, prev[key]);
            });
            console.log(target);
            return target;
          });
          this.onClickHandler(targets, prevAction.type);
          this.updateEditGameItemHandler(targets, editors);
        } else {
          // 如果操作步骤池为空，则清空编辑记录
          console.log("没操作了");
          this.game.redux.dispatch(clearEditGameItem());
        }
        this.game.redux.dispatch(setCancelActionStack(cancelActionStack));
        this.game.redux.dispatch(setResumeActionStack(resumeActionStack));
      } else if (
        resumeActionStack &&
        e.key === "y" &&
        (e.ctrlKey || e.metaKey)
      ) {
        const resumeAction = resumeActionStack.pop();
        if (resumeAction) {
          cancelActionStack.push(resumeAction);
          const editors: any = [];
          const targets = resumeAction?.target.map((target, index) => {
            const { next } = resumeAction?.stack[index];
            editors.push(next);
            const [key] = Object.keys(next);
            _.set(target, key, next[key]);
            return target;
          });

          this.onClickHandler(targets, resumeAction.type);
          this.updateEditGameItemHandler(targets, editors);
        } else {
          console.log("已经到当前一步操作");
        }
        this.game.redux.dispatch(setCancelActionStack(cancelActionStack));
        this.game.redux.dispatch(setResumeActionStack(resumeActionStack));
      }
    };
  }

  // 对外提供公用记录操作步骤
  recordOperationStep(items: Array<any>, operation: Function) {
    const stack: Array<any> = [];
    const offsetGameItems: Array<any> = items.map((item: any) => {
      const recordFactor = {};
      const record: any = _.clone(operation(recordFactor, item));
      stack.push(record);
      return item;
    });

    const { cancelActionStack } = this.game.redux.store.getState().sceneReducer;

    // 撤销堆栈记录
    cancelActionStack.push({
      stack: stack,
      target: offsetGameItems,
      type: this.game.editorTools.type
    });

    console.log(cancelActionStack);
    this.game.redux.dispatch(setCancelActionStack(cancelActionStack));

    //更新辅助工具线框
    this.drawOperationComponent(offsetGameItems);
    return offsetGameItems;
  }

  // 更新编辑对象信息
  updateEditGameItemHandler(targets, editors) {
    let newEditGameItem: any =
      this.game.redux.store.getState().sceneReducer.editGameItem;
    targets.map((target, index) => {
      newEditGameItem[target.name] = editors[index];
    });

    this.game.redux.dispatch(updateEditGameItem(newEditGameItem));
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
    // 注意，由于scene被缓存，需要先清空绑定事件
    item.off("click").on("click", () => {
      if (
        this.groupMap[this.type].context.checkClickUnAble &&
        this.groupMap[this.type].context.checkClickUnAble()
      ) {
        return;
      }
      let clickItems: any = null;
      const storeItems: any =
        this.game.redux.store.getState().sceneReducer.gameItem || [];
      // shift点击多选事件
      if (this.groupMap[this.type].context["isMulitple"]) {
        const index: number = storeItems.findIndex((store: any) => {
          return store.name === item.name;
        });
        if (index >= 0) {
          storeItems.splice(index, 1);
          clickItems = [...storeItems];
        } else {
          clickItems = storeItems.concat([item]);
        }
      } else {
        clickItems = [item];
      }
      this.onClickHandler(clickItems);
    });
  };

  onClickHandler = (items: Array<any>, type?: string) => {
    // inspector注入目标
    // 设置选中的元素
    this.game.redux.dispatch({
      type: GET_GAME_ITEM,
      payload: items
    });
    const itemSingle = items.length > 1 ? null : items[0];
    this.editTargetElement = itemSingle;
    this.drawOperationComponent(items, type);
  };

  // 获取点击元素的全局坐标（考虑画布缩放）
  loopGlobalCoord(item, x, y) {
    if (item.parent.constructor.name === "KnGroup") {
      x += item.parent.x;
      y += item.parent.y;
      this.loopGlobalCoord(item.parent, x, y);
    }
    return [x, y];
  }

  // 绘制对应的操作组件
  drawOperationComponent(item, type?: any) {
    const items =
      Object.prototype.toString.call(item) === "[object Array]" ? item : [item];
    const cloneItems: Array<any> = items.map((item: any) => {
      const [x, y] = this.loopGlobalCoord(item, 0, 0);
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

      this.relativeX = x;
      this.relativeY = y;

      return cloneItem;
    });

    this.reset();
    const { context, boot } = this.groupMap[type || this.type];
    boot && boot.bind(context)(cloneItems);
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
