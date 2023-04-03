/*
 * @Author: kunnisser
 * @Date: 2023-02-14 16:15:56
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-03 14:26:28
 * @FilePath: /kunigame/projects/kuni/lib/gameobjects/kn_sprite.ts
 * @Description: ---- sprite类 ----
 */
import { Sprite, Texture } from "pixi.js";
import Game from "../core";

class KnSprite extends Sprite {
  game: Game;
  public id: String;
  public boot: Boolean;
  constructor(key: string, id: string, texture: Texture) {
    super(texture);
    this.id = id;
    this.name = key || id;
    this.tintColor = "#fff";
    this.boot = true;
  }

  set tintColor(color: string) {
    const colorNumber: number = +`0x${color.split("#")[1]}`;
    this.tint = colorNumber;
  }

  get tintColor() {
    const tintString = this.tint.toString(16);
    return "#" + tintString;
  }
}

export default KnSprite;
