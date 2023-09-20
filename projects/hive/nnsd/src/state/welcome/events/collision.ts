/*
 * @Author: kunnisser
 * @Date: 2023-09-16 16:54:31
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-20 17:33:43
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/events/collision.ts
 * @Description: ---- 碰撞距离检测 ----
 */

import Welcome from "../scene";
import { distance } from "ts@/kuni/lib/utils/common";
export const isImpact = (scene: Welcome) => {
  const hitPoint = {
    x: scene.rocket.x,
    y:
      scene.rocket.y -
      scene.planetSystem.startingPlanet.body.height * 0.5 -
      scene.rocket.sprite.height
  };
  const rocketDistance =
    distance(hitPoint, scene.planetSystem.targetPlanet.position) -
    scene.planetSystem.targetPlanet.body.width * 0.5;
  if (rocketDistance <= 0) {
    scene.rocket.crashed(hitPoint);
    console.log("hit");
  }
};

export const isInOrbit = (scene: Welcome) => {
  const rocketDistance =
    distance(scene.rocket.position, scene.planetSystem.targetPlanet.position) -
    scene.planetSystem.targetPlanet.gravityField.width * 0.5;
  if (
    rocketDistance <= 0 &&
    scene.rocket.y <= scene.planetSystem.targetPlanet.y
  ) {
    scene.rocket.isInOrbit = true;
    scene.rocket.isFlying = false;
    scene.rocket.power = 0;
    scene.rocket.sprite.angle = 90;
    scene.rocket.incX = 0;
    scene.rocket.incY = 0;
    scene.rocket.plume.angle = -90;
    scene.rocket.plume.y = 0;
    scene.rocket.pivot.y =
      scene.planetSystem.targetPlanet.body.height * 0.5 + 100;
    scene.next();
  }
};
