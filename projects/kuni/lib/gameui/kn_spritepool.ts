/*
 * @Author: kunnisser
 * @Date: 2023-03-28 14:37:07
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-28 16:53:17
 * @FilePath: /kunigame/projects/kuni/lib/gameui/kn_spritepool.ts
 * @Description: ---- 精灵对象池 ----
 */

import KnSprite from "../gameobjects/kn_sprite";

class SpritePool {
  public pool: Array<KnSprite>;
  constructor() {
    this.pool = [];
  }

  getSprite() {
    if (this.pool.length > 0) {
      const sprite: KnSprite | void = this.pool.pop();
      return sprite;
    } else {
      return new KnSprite("", PIXI.Texture.EMPTY);
    }
  }

  releaseSprite(sprites: Array<KnSprite>) {
    for (const sprite of sprites) {
      this.pool.push(sprite);
    }
  }
}

export default SpritePool;
