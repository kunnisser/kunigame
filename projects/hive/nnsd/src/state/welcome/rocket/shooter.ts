/*
 * @Author: kunnisser
 * @Date: 2023-10-07 16:59:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-10-07 23:45:46
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\welcome\rocket\shooter.ts
 * @Description: ---- 射击系统 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnEmitter from 'ts@/kuni/lib/gameobjects/kn_emitter';
import { KnTween } from 'ts@/kuni/lib/gameobjects/kn_tween';
import Rocket from './rocket';
import PlanetSystem from '../planet';

const initBullets = (game: Game, parent) => {
  const bullets: any = {
    singleBullet: game.add.emitter(game, 10, 'logo'),
  };
  parent.addChild(bullets.singleBullet);
  return bullets;
};

const shooter = (game: Game, parent: PlanetSystem) => {
  const bullets = initBullets(game, parent);
  return {
    originalShooter: (tween: KnTween, rocket: Rocket, target) => {
      const bullet: KnEmitter = bullets.singleBullet;
      bullet.position.set(rocket.x, rocket.y);
      bullet.pivot.y = rocket.pivot.y;
      console.log('biu!', rocket.pivot.y);
      bullet.shoot(tween, 0.1, rocket.pivot.y, target, 'cubic', 'easeOut');
    },
  };
};

export default shooter;
