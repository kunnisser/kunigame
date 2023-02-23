/*
 * @Author: kunnisser
 * @Date: 2023-02-07 16:50:04
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-23 15:34:04
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/drag/index.ts
 * @Description: ---- 公共拖动 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import { freeMovePosition } from "./dragEvent";
import { Point } from "pixi.js";

export interface DragActionStack {
  position: { prevX: number; prevY: number; nextX: number; nextY: number };
  target: any;
  tool: any;
}

class DragPosition {
  public game: Game;
  public moveGroup: KnGroup;
  public anchorGroup: KnGroup; // 锚点组
  public anchorHandler: KnGraphics; // 锚点抓手
  public dragBorder: KnGraphics; // 拖动边框
  public anchorArrowX: KnGraphics; // 拖动X
  public anchorArrowY: KnGraphics; //拖动Y
  public bootTarget: any;
  public parent: KnGroup;
  public dragStartX: number; // 拖拽开始坐标X
  public dragStartY: number;
  arrowY: KnGraphics;
  relativeX: number;
  relativeY: number;
  constructor(game, parent) {
    this.game = game;
    this.parent = parent;
    this.initial(game);
    this.bootTarget = null;
    this.relativeX = 0;
    this.relativeY = 0;
    this.dragStartX = 0;
    this.dragStartY = 0;
  }

  initial(game: Game) {
    // 设置画布可交互
    this.game.stage.interactive = true;
    this.game.stage.hitArea = this.game.app.screen;

    // 创建拖动组
    this.moveGroup = this.game.add.group("moveContainer", this.parent);
    // 创建拖动边框
    this.dragBorder = this.game.add.graphics("drag_border");
    this.moveGroup.addChild(this.dragBorder);

    // 创建锚点抓手
    this.anchorGroup = this.game.add.group("anchorGroup", this.moveGroup);

    // 锚点移动事件
    this.anchorHandler = this.game.add.graphics("handler");
    this.anchorArrowX = this.game.add.graphics("xAxis");
    this.anchorArrowY = this.game.add.graphics("yAxis");
    this.anchorGroup.addChild(this.anchorArrowX);
    this.anchorGroup.addChild(this.anchorArrowY);
    this.anchorGroup.addChild(this.anchorHandler);

    this.bindDragToolsFunction(game);

    // 定义拖拽撤销恢复功能,覆盖式
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
          this.onClickDragging(prevAction?.target);
          prevAction?.target.position.set(
            prevX - this.relativeX,
            prevY - this.relativeY
          );
          this.moveGroup.position.set(prevX, prevY);
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
          this.onClickDragging(resumeAction?.target);
          resumeAction?.target.position.set(
            nextX - this.relativeX,
            nextY - this.relativeY
          );
          this.moveGroup.position.set(nextX, nextY);
        }
      }
    };
  }

  // 场景进入后，对场景内的各个元素进行拖动组件生成
  bindDragToolsFunction(game) {
    const displayList = game.currentScene.children;
    this.recursionBind(displayList);
    freeMovePosition(this);
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

  drawArrowX(item, borderSize) {
    let { x, y }: { x: number; y: number } = { x: 0, y: 0 };
    // 对齐边框修正
    x += (item.anchor.x - 0.5) * borderSize;
    y += (item.anchor.y - 0.5) * borderSize;
    this.anchorArrowX.clear();
    this.anchorArrowX.generateStrokeLine(1, 0xd10311, 0x000000, [x, y, 80, 2]);
    this.anchorArrowX.generateTriangle(0xd10311, 0x000000, 1, { x, y });
  }

  drawArrowY(item, borderSize) {
    let { x, y }: { x: number; y: number } = { x: 0, y: 0 };
    x += (item.anchor.x - 0.5) * borderSize;
    y += (item.anchor.y - 0.5) * borderSize;
    this.anchorArrowY.clear();
    this.anchorArrowY.generateStrokeLine(1, 0xabf2bc, 0x000000, [x, y, 2, 80]);
    this.anchorArrowY.generateTriangle(0xabf2bc, 0x000000, 1, { x, y });
  }
  drawEditorAnchor(item, borderSize) {
    this.drawArrowX(item, borderSize);
    this.drawArrowY(item, borderSize);
    this.anchorHandler.clear();
    this.anchorHandler.generateCircle(
      0x000000,
      [
        (item.anchor.x - 0.5) * borderSize,
        (item.anchor.y - 0.5) * borderSize,
        5
      ],
      1
    );
    this.anchorHandler.generateCircle(
      0xfe9600,
      [
        (item.anchor.x - 0.5) * borderSize,
        (item.anchor.y - 0.5) * borderSize,
        4
      ],
      1
    );
  }

  drawPositionEditorBorder(item: any) {
    const BorderWidth: number = 2;
    const StrokeWidth: number = 1;
    this.dragBorder.clear();
    this.dragBorder.generateRectLineStyle(
      [BorderWidth, StrokeWidth],
      0x65e924,
      0x000000,
      [0, 0, item.width, item.height],
      item.anchor
    );
    return BorderWidth + StrokeWidth * 2;
  }

  bootDrag = (item: any) => {
    item.interactive = true;

    const bootDragClick = () => {
      this.onClickDragging(item);
    };
    // 注意，由于scene被缓存，需要先清空绑定事件
    item.off("click").on("click", bootDragClick);
  };

  onClickDragging = (item: any) => {
    // 获取点击元素的全局坐标（考虑画布缩放）
    this.relativeX = 0;
    this.relativeY = 0;
    const loopGlobalCoord = (item) => {
      if (item.parent.constructor.name === "KnGroup") {
        this.relativeX += item.parent.x;
        this.relativeY += item.parent.y;
        loopGlobalCoord(item.parent);
      }
    };
    loopGlobalCoord(item);

    // 克隆目标的宽高和初始坐标
    const cloneItem: any = {
      x: item.x + this.relativeX,
      y: item.y + this.relativeY,
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
    this.bootTarget = item;
    this.game.editorTools.editTargetElement = item;
    this.moveGroup.visible = true;
    this.moveGroup.position.set(cloneItem.x, cloneItem.y);
    const borderSize = this.drawPositionEditorBorder(cloneItem);
    this.drawEditorAnchor(cloneItem, borderSize);
  };
}

export default DragPosition;
