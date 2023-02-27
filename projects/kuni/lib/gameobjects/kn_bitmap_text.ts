/*
 * @Author: kunnisser
 * @Date: 2023-02-27 14:49:21
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-27 14:51:53
 * @FilePath: /kunigame/projects/kuni/lib/gameobjects/kn_bitmap_text.ts
 * @Description: ---- 点阵文字 ----
 */
import { BitmapText, ObservablePoint } from "pixi.js";
import Game from "../core";

class KnBitMapText extends BitmapText {
  game: Game;
  public id: String;
  public resolution: number;
  public anchor: ObservablePoint;
  constructor(
    id: string,
    game: Game,
    content: string,
    style: any,
    anchor: Array<number>
  ) {
    super(content, style);
    this.game = game;
    this.resolution = window.devicePixelRatio;
    this.anchor.set(...anchor);
    this.id = id;
    this.name = id;
  }
}

export default KnBitMapText;
