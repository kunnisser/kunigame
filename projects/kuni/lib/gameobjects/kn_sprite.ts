/*
 * @Author: kunnisser
 * @Date: 2023-02-14 16:15:56
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-29 14:25:15
 * @FilePath: /kunigame/projects/kuni/lib/gameobjects/kn_sprite.ts
 * @Description: ---- sprite类 ----
 */
import { Sprite, Texture } from "pixi.js";
import Game from "../core";

class KnSprite extends Sprite {
  game: Game;
  public id: String;
  public boot: Boolean;
  constructor(key: string, id: string, texture: Texture, game?: Game) {
    super(texture);
    this.id = id;
    this.name = key || id;
    this.boot = true;
    if (game && !this.texture['boot']) {
      // 如果重复生成多个相同sprite的话，这里的texture纹理原始尺寸会被多次放大，而浏览器没做缩放所以没有此类问题
      // 使用 boot 来判断
      this.texture.orig.width *= game?.gameScale;
      this.texture.orig.height *= game?.gameScale;
      this.texture['boot'] = 'true';
    }
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
