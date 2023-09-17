/*
 * @Author: kunnisser
 * @Date: 2023-09-16 16:54:31
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-16 23:22:11
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\welcome\events\collision.ts
 * @Description: ---- 碰撞距离检测 ----
 */

import Welcome from '../scene';
import { distance } from 'ts@/kuni/lib/utils/common';
export const isImpact = (scene: Welcome) => {
  const rocketDistance =
    distance(
      {
        x: scene.rocket.x,
        y:
          scene.rocket.y - scene.moon.height * 0.5 - scene.rocket.sprite.height,
      },
      scene.planetSystem.position
    ) -
    scene.planetSystem.body.width * 0.5;
  if (rocketDistance <= 0) {
    scene.gameOver = true;
    console.log('hit');
  }
};
