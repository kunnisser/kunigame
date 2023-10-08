/*
 * @Author: kunnisser
 * @Date: 2023-10-08 16:48:15
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-10-08 17:45:30
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/shooter/bullets.ts
 * @Description: ---- 子弹系统 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";

class Bullets extends KnGroup {
  game: Game;
  bulletsPool: Array<KnSprite>;
  key: string;
  constructor(game: Game, parent) {
    super(game, "bullets", parent);
    this.game = game;
    this.key = "";
    this.bulletsPool = [];
  }

  create(key: string, count?: number) {
    this.key = key;
    for (let i = 0, j = count || 10; i < j; i++) {
      const bullet: KnSprite = this.game.add.sprite("", key, [0.5, 1]);
      bullet.visible = false;
      this.bulletsPool.push(bullet);
      this.addChild(...this.bulletsPool);
    }
  }
}

export default Bullets;
