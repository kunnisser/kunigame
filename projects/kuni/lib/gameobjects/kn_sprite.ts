/*
 * @Author: kunnisser
 * @Date: 2023-02-14 16:15:56
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-13 17:32:18
 * @FilePath: /kunigame/projects/kuni/lib/gameobjects/kn_sprite.ts
 * @Description: ---- sprite类 ----
 */
import { Sprite, Texture } from "pixi.js";
import Game from "../core";

class KnSprite extends Sprite {
  game: Game;
  public id: String;
  constructor(id: string, texture: Texture) {
    super(texture);
    this.id = id;
    this.name = id;
    this.tintColor = "#fff";
  }

  set tintColor(color: string) {
    const colorNumber: number = +`0x${color.split("#")[1]}`;
    this.tint = colorNumber;
  }

  get tintColor() {
    const tintString = this.tint + "";
    const colorString = tintString.split("0x");
    return "#" + colorString[1];
  }
}

export default KnSprite;
