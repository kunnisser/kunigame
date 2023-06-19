/*
 * @Author: kunnisser
 * @Date: 2023-04-26 09:55:54
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-19 17:25:45
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/scale/index.ts
 * @Description: ---- 缩放模块 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";

class ScaleTool {
  public scaleGroup: KnGroup;
  public scaleBorder: KnGraphics;
  public scaleButtonX: KnGraphics;
  public scaleButtonY: KnGraphics;
  public scaleButton: KnGraphics;
  constructor(game: Game, parent: KnGroup) {
    this.scaleGroup = game.add.group("scaleContainer", parent);
    this.initial(game);
  }

  initial(game: Game) {
    this.scaleBorder = game.add.graphics("scale_border");
    this.scaleButtonX = game.add.graphics("scale_btn_x");
    this.scaleButtonY = game.add.graphics("scale_btn_y");
    this.scaleButton = game.add.graphics("scale_btn");
    this.scaleGroup.addChild(
      this.scaleBorder,
      this.scaleButton,
      this.scaleButtonX,
      this.scaleButtonY
    );
  }

  drawScaleBorder(items: any) {
    const BorderWidth: number = 2;
    const StrokeWidth: number = 1;
    this.scaleBorder.clear();
    items.map((item: any) => {
      this.scaleBorder.generateRectLineStyle(
        [BorderWidth, StrokeWidth],
        0xf4d450,
        0x000000,
        [item.x, item.y, item.width, item.height],
        item.anchor
      );
    });
    return BorderWidth + StrokeWidth * 2;
  }

  onBoot(cloneItems: any) {
    this.scaleGroup.visible = true;
    this.drawScaleBorder(cloneItems);
  }
}

export default ScaleTool;
