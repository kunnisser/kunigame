/*
 * @Author: kunnisser
 * @Date: 2023-04-25 17:30:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-25 17:41:05
 * @FilePath: \kunigame\projects\hive\nnsd\src\tools\common\rotate\index.ts
 * @Description: ---- 旋转模块 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnGraphics from 'ts@/kuni/lib/gameobjects/kn_graphics';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';

class RotateTool {
  public rotateGroup: KnGroup;
  public rotatePlate: KnGraphics;
  public rotateOriginPointer: KnGraphics;
  public anchorArrow: KnGraphics;
  constructor(game: Game, parent: KnGroup) {
    this.rotateGroup = game.add.group('rotateContainer', parent);
    this.initial(game);
  }

  initial(game: Game) {
    this.rotatePlate = game.add.graphics('rotate_plate');
    this.rotateOriginPointer = game.add.graphics('rotate_origin_pointer');
    this.anchorArrow = game.add.graphics('rotate_anchor_arrow');
    this.rotateGroup.addChild(
      this.rotatePlate,
      this.anchorArrow,
      this.rotateOriginPointer
    );
  }

  drawRotateBorder(items) {
    const [currentGameItem] = items;
    const { width, height } = currentGameItem;
    const radius = width > height ? width : height;
    this.rotatePlate.clear();
    this.rotateOriginPointer.clear();
    this.rotatePlate.generateLineCircle(
      0x000000,
      [currentGameItem.x, currentGameItem.y, radius * 0.5 + 20],
      8
    );
    this.rotatePlate.generateLineCircle(
      0x806787,
      [currentGameItem.x, currentGameItem.y, radius * 0.5 + 18],
      4
    );
    this.drawArrow(currentGameItem, radius);
    this.rotateOriginPointer.generateCircle(0x000000, [
      currentGameItem.x,
      currentGameItem.y,
      radius * 0.02 * 1.2,
    ]);
    this.rotateOriginPointer.generateCircle(0x806787, [
      currentGameItem.x,
      currentGameItem.y,
      radius * 0.02,
    ]);
  }

  drawArrow(item, borderSize) {
    let { x, y }: { x: number; y: number } = { x: item.x, y: item.y };
    const radius = borderSize * 0.01;
    this.anchorArrow.clear();
    this.anchorArrow.generateStrokeLine(2, 0xd10311, 0x000000, [
      x,
      y,
      radius * 50,
      radius * 1.5,
    ]);
    this.anchorArrow.generateTriangle(
      0xd10311,
      0x000000,
      4,
      { x, y },
      borderSize * 0.04
    );
  }

  onBoot(cloneItems: any) {
    this.rotateGroup.visible = true;
    this.drawRotateBorder(cloneItems);
  }
}

export default RotateTool;
