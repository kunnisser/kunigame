/*
 * @Author: kunnisser
 * @Date: 2023-04-24 17:30:40
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-27 14:06:12
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
  public pickBox: KnGraphics;
  public game: Game;
  public isPulling: Boolean;
  public isMulitple: Boolean; //是否连选
  // 记录移动的系数，判读是否可点击
  public isMovingAbleCount: number;
  constructor(game: Game, parent: KnGroup) {
    this.game = game;
    this.pickGroup = game.add.group("pickContainer", parent);
    this.pickBox = game.add.graphics("pick_box");
    parent.addChild(this.pickBox);
    this.isPulling = false;
    this.isMulitple = false;
    this.isMovingAbleCount = 0;
    this.initial(game);
  }

  checkClickUnAble() {
    const MAX_ClICK_LIMIT = 10;
    return this.isMovingAbleCount > MAX_ClICK_LIMIT;
  }

  initial(game: Game) {
    this.pickBorder = game.add.graphics("pick_border");
    this.pickGroup.addChild(this.pickBorder);
    boxSelection(game, this);
  }

  drawPickBorder(items: any) {
    const BorderWidth: number = 2;
    const StrokeWidth: number = 1;
    this.pickBorder.clear();
    items.map((item: any) => {
      const { x, y, anchor, width, height, angle } = item;
      const paths = [
        -anchor.x * width,
        -anchor.y * height,
        (1 - anchor.x) * width,
        -anchor.y * height,
        (1 - anchor.x) * width,
        (1 - anchor.y) * height,
        -anchor.x * width,
        (1 - anchor.y) * height
      ];
      this.pickBorder.generatePolygonLineStyle(
        x,
        y,
        paths,
        BorderWidth,
        StrokeWidth,
        0x65eee8,
        0x000000,
        angle
      );
    });

    return BorderWidth + StrokeWidth * 2;
  }

  onBoot(cloneItems: any) {
    this.pickGroup.visible = true;
    this.drawPickBorder(cloneItems);
  }
}

export default PickTool;
