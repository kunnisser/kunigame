/*
 * @Author: kunnisser
 * @Date: 2023-10-08 16:47:49
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-10-10 09:51:06
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/shooter/shooter.ts
 * @Description: ---- 射击系统 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Bullets from "./bullets";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";

class Shooter extends KnGroup {
  game: Game;
  bullets: Bullets;
  constructor(game: Game, parent) {
    super(game, "shooter", parent);
    this.initial(game);
  }

  initial(game) {
    this.bullets = new Bullets(game, this);
  }

  setBullet(key: string, count?: number) {
    this.bullets.create(key, count);
    return this;
  }

  shoot(pivot) {
    const bootBullet = this.bullets.bulletsPool.find((bullet: KnSprite) => {
      return bullet.visible === false;
    });
    if (bootBullet) {
      bootBullet.visible = true;
      bootBullet.pivot.y = pivot;
      return bootBullet;
    } else {
      const createBullet = this.game.add.image(
        "",
        this.bullets.key,
        this.bullets,
        [0.5, 1]
      );
      createBullet.pivot.y = pivot;
      this.bullets.bulletsPool.push(createBullet);
      return createBullet;
    }
  }

  recover(bullet: KnSprite) {
    bullet.visible = false;
  }

  ceasefire() {
    for (const bullet of this.bullets.bulletsPool) {
      bullet.visible = false;
    }
  }
}

export default Shooter;
