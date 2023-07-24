/*
 * @Author: kunnisser
 * @Date: 2023-04-25 17:30:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-29 14:35:31
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/rotate/index.ts
 * @Description: ---- 旋转模块 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import { RotateEvent } from "./rotateEvent";

class RotateTool {
  public rotateGroup: KnGroup;
  public rotatePlate: KnGraphics;
  public rotateOriginPointer: KnGraphics;
  public originArrow: KnGraphics;
  public anchorArrow: KnGraphics;
  constructor(game: Game, parent: KnGroup) {
    this.rotateGroup = game.add.group("rotateContainer", parent);
    this.initial(game);
  }

  initial(game: Game) {
    this.rotatePlate = game.add.graphics("rotate_plate");
    this.rotateOriginPointer = game.add.graphics("rotate_origin_pointer");
    this.originArrow = game.add.graphics("rotate_origin_arrow");
    this.anchorArrow = game.add.graphics("rotate_anchor_arrow");
    this.rotateGroup.addChild(
      this.rotatePlate,
      this.originArrow,
      this.anchorArrow,
      this.rotateOriginPointer
    );
    RotateEvent(this.anchorArrow, game);
  }

  drawRotateBorder(items) {
    const [currentGameItem] = items;
    const { width, height } = currentGameItem;
    const radius = width > height ? width : height;
    this.rotatePlate.clear();
    this.rotateOriginPointer.clear();
    // this.rotatePlate.generateRectLineStyle(
    //   [BorderWidth, StrokeWidth],
    //   0x806787,
    //   0x000000,
    //   [currentGameItem.x, currentGameItem.y, width, height],
    //   currentGameItem.anchor
    // );
    this.rotatePlate.generateLineCircle(
      0x000000,
      [currentGameItem.x, currentGameItem.y, radius * 0.5 + 20],
      6
    );
    this.rotatePlate.generateLineCircle(
      0x806787,
      [currentGameItem.x, currentGameItem.y, radius * 0.5 + 18.5],
      3
    );
    this.drawOriginArrow(currentGameItem);
    this.drawArrow(currentGameItem);
    this.rotateOriginPointer.generateCircle(0x000000, [
      currentGameItem.x,
      currentGameItem.y,
      16
    ]);
    this.rotateOriginPointer.generateCircle(0x806787, [
      currentGameItem.x,
      currentGameItem.y,
      12
    ]);
  }

  drawOriginArrow(item) {
    let { x, y }: any = item;
    this.originArrow.clear();
    this.originArrow.generateStrokeLine(1, 0x806787, 0x000000, [x, y, 180, 4]);
  }

  drawArrow(item) {
    let { x, y }: any = item;
    this.anchorArrow.clear();
    this.anchorArrow.position.set(x, y);
    this.anchorArrow.generateStrokeLine(1, 0xd10311, 0x000000, [0, 0, 180, 4]);
    this.anchorArrow.generateTriangle(
      0xd10311,
      0x000000,
      4,
      { x: 0, y: 0 },
      16
    );
    this.anchorArrow.angle = item.angle;
  }

  onBoot(cloneItems: any) {
    this.rotateGroup.visible = true;
    this.drawRotateBorder(cloneItems);
  }
}

export default RotateTool;
