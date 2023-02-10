/*
 * @Author: kunnisser
 * @Date: 2023-02-07 16:50:04
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-10 16:48:28
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/drag/index.ts
 * @Description: ---- 公共拖动 ----
 */

import { Sprite } from "pixi.js";
import Game from "ts@/kuni/lib/core";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";
import { freeMovePosition } from "./dragEvent";

class DragPosition {
  public game: Game;
  public moveGroup: KnGroup;
  public anchorGroup: KnGroup; // 锚点组
  public anchorHandler: KnGraphics; // 锚点抓手
  public dragBorder: KnGraphics; // 拖动边框
  public anchorArrowX: KnGraphics; // 拖动X
  public anchorArrowY: KnGraphics; //拖动Y
  arrowY: KnGraphics;
  constructor(game) {
    this.game = game;
    this.initial(game);
  }

  initial(game: Game) {
    // 设置画布可交互
    this.game.stage.interactive = true;
    this.game.stage.hitArea = this.game.app.screen;

    const dragActions = {
      "Sprite": this.bootSpriteDrag,
      "KnText": this.bootTextDrag,
      "KnGroup": () => {}
    };
    console.log(game.currentScene.children);
    // 创建拖动组
    this.moveGroup = this.game.add.group(
      "moveContainer",
      this.game.currentScene
    );
    // 创建拖动边框
    this.dragBorder = this.game.add.graphics();
    this.moveGroup.addChild(this.dragBorder);

    // 创建锚点抓手
    this.anchorGroup = this.game.add.group("anchorGroup", this.moveGroup);

    // 锚点移动事件
    this.anchorHandler = this.game.add.graphics();
    freeMovePosition(this.game.stage, this.anchorHandler);

    this.anchorArrowX = this.game.add.graphics();
    this.anchorArrowY = this.game.add.graphics();
    this.anchorGroup.addChild(this.anchorArrowX);
    this.anchorGroup.addChild(this.anchorArrowY);
    this.anchorGroup.addChild(this.anchorHandler);

    const displayList = game.currentScene.children;
    displayList.map((item: any) => {
      const itemType: string = item.constructor.name;
      dragActions[itemType](item);
    });
  }

  drawArrowX(item, borderSize) {
    let { x, y }: { x: number; y: number } = item;
    // 对齐边框修正
    x += (item.anchor.x - 0.5) * borderSize;
    y += (item.anchor.y - 0.5) * borderSize;
    this.anchorArrowX.clear();
    this.anchorArrowX.generateStrokeLine(1, 0xd10311, 0x000000, [x, y, 80, 2]);
    this.anchorArrowX.generateTriangle(0xd10311, 0x000000, 1, { x, y });
  }

  drawArrowY(item, borderSize) {
    let { x, y }: { x: number; y: number } = item;
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
        item.x + (item.anchor.x - 0.5) * borderSize,
        item.y + (item.anchor.y - 0.5) * borderSize,
        5
      ],
      1
    );
    this.anchorHandler.generateCircle(
      0xfe9600,
      [
        item.x + (item.anchor.x - 0.5) * borderSize,
        item.y + (item.anchor.y - 0.5) * borderSize,
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
      [item.x, item.y, item.width, item.height],
      item.anchor
    );
    return BorderWidth + StrokeWidth * 2;
  }

  bootTextDrag = (item: KnText) => {
    item.interactive = true;
    item.on("click", () => {
      const borderSize = this.drawPositionEditorBorder(item);
      this.drawEditorAnchor(item, borderSize);
    });
  };

  bootSpriteDrag = (item: Sprite) => {
    // item.interactive = true;
    item.on("click", () => {});
  };
}

export default DragPosition;
