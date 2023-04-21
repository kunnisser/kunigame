/*
 * @Author: kunnisser
 * @Date: 2023-03-28 14:37:07
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-21 17:22:43
 * @FilePath: /kunigame/projects/kuni/lib/gameobjects/kn_spritepool.ts
 * @Description: ---- 精灵对象池 ----
 */

import KnSprite from "./kn_sprite";

class SpritePool {
  public pool: Array<KnSprite>;
  constructor() {
    this.pool = [];
  }

  getSprite() {
    if (this.pool.length > 0) {
      const sprite: KnSprite | void = this.pool.pop();
      sprite && (sprite.visible = true);
      return sprite;
    } else {
      return new KnSprite("", "", PIXI.Texture.EMPTY);
    }
  }

  releaseSprite(sprites: Array<KnSprite>) {
    for (const sprite of sprites) {
      sprite.visible = false;
      this.pool.push(sprite);
    }
  }
}

export default SpritePool;
