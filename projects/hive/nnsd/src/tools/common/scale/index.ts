/*
 * @Author: kunnisser
 * @Date: 2023-04-26 09:55:54
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-20 14:30:50
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/scale/index.ts
 * @Description: ---- 缩放模块 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import { scaleEvent } from "./scaleEvent";

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
    scaleEvent(this.scaleButton, this.scaleButtonX, this.scaleButtonY, game);
  }

  drawScaleBorder(items: any) {
    const BorderWidth: number = 2;
    const StrokeWidth: number = 1;
    const ButtonSize: number = 12;
    const borderStyle: IBorder = {
      width: 2,
      color: 0x000000,
      alpha: 1
    };
    this.scaleBorder.clear();
    this.scaleButton.clear();
    this.scaleButtonX.clear();
    this.scaleButtonY.clear();

    items.map((item: any) => {
      this.scaleBorder.generateRectLineStyle(
        [BorderWidth, StrokeWidth],
        0xf4d450,
        0x000000,
        [item.x, item.y, item.width, item.height],
        item.anchor
      );
      this.scaleButton.setBorder(borderStyle);
      this.scaleButton.generateRect(
        0xe98566,
        [
          item.x + BorderWidth + item.width * (1 - item.anchor.x),
          item.y + BorderWidth + item.height * (1 - item.anchor.y),
          ButtonSize,
          ButtonSize
        ],
        true
      );
      this.scaleButtonX.setBorder(borderStyle);
      this.scaleButtonX.generateRect(
        0xf4d450,
        [
          item.x + BorderWidth + item.width * (1 - item.anchor.x),
          item.y + BorderWidth + item.height * (0.5 - item.anchor.y),
          ButtonSize,
          ButtonSize
        ],
        true
      );
      this.scaleButtonY.setBorder(borderStyle);
      this.scaleButtonY.generateRect(
        0xf4d450,
        [
          item.x + BorderWidth + item.width * (0.5 - item.anchor.x),
          item.y + BorderWidth + item.height * (1 - item.anchor.y),
          ButtonSize,
          ButtonSize
        ],
        true
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
