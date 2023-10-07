/*
 * @Author: kunnisser
 * @Date: 2023-10-07 16:59:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-10-07 17:45:36
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/rocket/shooter.ts
 * @Description: ---- 射击系统 ----
 */

import Game from "ts@/kuni/lib/core";
import KnEmitter from "ts@/kuni/lib/gameobjects/kn_emitter";
import { KnTween } from "ts@/kuni/lib/gameobjects/kn_tween";
import Rocket from "./rocket";

const initBullets = (game: Game, parent) => {
  const bullets: any = {
    singleBullet: game.add.emitter(game, 10, "gas")
  };
  parent.addChild(bullets.singleBullet);
  return bullets;
};

const shooter = (game: Game, parent) => {
  const bullets = initBullets(game, parent);
  return {
    originalShooter: (tween: KnTween, rocket: Rocket, target) => {
      const bullet: KnEmitter = bullets.singleBullet;
      console.log("biu!");
      bullet.shoot(tween, 0.1, rocket.pivot, target, "cubic", "easeOut");
    }
  };
};

export default shooter;
