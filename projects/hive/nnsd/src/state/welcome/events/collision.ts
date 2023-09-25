/*
 * @Author: kunnisser
 * @Date: 2023-09-16 16:54:31
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-25 11:11:34
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/events/collision.ts
 * @Description: ---- 碰撞距离检测 ----
 */

import Welcome from "../scene";
import { distance } from "ts@/kuni/lib/utils/common";
export const isImpact = (scene: Welcome) => {
  const hitPoint = {
    x: scene.rocket.x + scene.rocket.hitPoint.x,
    y: scene.rocket.y + scene.rocket.hitPoint.y
  };
  const rocketDistance =
    distance(hitPoint, scene.planetSystem.targetPlanet.position) -
    scene.planetSystem.targetPlanet.body.width * 0.5;
  if (rocketDistance < 0) {
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
    scene.rocket.self.angle = 90;
    scene.rocket.power = 0;
    scene.rocket.incX = 0;
    scene.rocket.incY = 0;
    scene.rocket.plume.y = 0;
    scene.next();
  }
};
