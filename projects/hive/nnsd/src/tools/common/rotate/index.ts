/*
 * @Author: kunnisser
 * @Date: 2023-04-25 17:30:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-21 14:49:24
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/rotate/index.ts
 * @Description: ---- 旋转模块 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";

class RotateTool {
  public rotateGroup: KnGroup;
  public rotatePlate: KnGraphics;
  constructor(game: Game, parent: KnGroup) {
    this.rotateGroup = game.add.group("rotateContainer", parent);
    this.initial(game);
  }

  initial(game: Game) {
    this.rotatePlate = game.add.graphics("rotate_plate");
    this.rotateGroup.addChild(this.rotatePlate);
  }

  drawRotateBorder(items) {
    const [currentGameItem] = items;
    this.rotatePlate.clear();
    this.rotatePlate.generateLineCircle(0xffffff, [
      currentGameItem.x,
      currentGameItem.y,
      currentGameItem.width * 0.5
    ]);
  }

  onBoot(cloneItems: any) {
    this.rotateGroup.visible = true;
    this.drawRotateBorder(cloneItems);
  }
}

export default RotateTool;
