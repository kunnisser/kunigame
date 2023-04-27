/*
 * @Author: kunnisser
 * @Date: 2023-04-24 17:30:40
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-27 15:17:12
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/pick/index.ts
 * @Description: ---- 选中模块 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import { boxSelection } from "./boxSelection";

class PickTool {
  public pickGroup: KnGroup;
  public pickBorder: KnGraphics;
  public game: Game;
  constructor(game: Game, parent: KnGroup) {
    this.game = game;
    this.pickGroup = game.add.group("pickContainer", parent);
    this.initial(game);
  }

  initial(game) {
    this.pickBorder = game.add.graphics("pick_border");
    this.pickGroup.addChild(this.pickBorder);
    boxSelection(game);
  }

  drawPickBorder(item: any) {
    const BorderWidth: number = 2;
    const StrokeWidth: number = 1;
    this.pickBorder.clear();
    this.pickBorder.generateRectLineStyle(
      [BorderWidth, StrokeWidth],
      0x65eee8,
      0x000000,
      [0, 0, item.width, item.height],
      item.anchor
    );
    return BorderWidth + StrokeWidth * 2;
  }

  onBoot(cloneItem: any) {
    this.pickGroup.visible = true;
    this.pickGroup.position.set(cloneItem.x, cloneItem.y);
    this.drawPickBorder(cloneItem);
  }
}

export default PickTool;
