/*
 * @Author: kunnisser
 * @Date: 2023-02-14 16:15:56
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-20 15:04:01
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
  }
}

export default KnSprite;
