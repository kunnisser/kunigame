/*
 * @Author: kunnisser
 * @Date: 2023-09-16 16:48:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-10-10 09:51:47
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/events/input.ts
 * @Description: ---- 输入相关事件 ----
 */

import Welcome from "../scene";

let side: number = 1;
export const mainTouchEvent = (scene: Welcome) => {
  scene.on("pointerdown", () => {
    if (!scene.gameOver && !scene.rocket.isInOrbit) {
      scene.bootRocket = true;
      scene.rocket.emitter.visible = true;
      scene.rocket.shake.seek(0).restart(true);
    }
  });
  scene.on("pointerup", () => {
    if (scene.rocket.isInOrbit) {
      console.log("tap");
      scene.planetSystem.shooter.ceasefire();
      side *= -1;
      scene.rocket.orbitIndex = side > 0 ? 1 : 0;
      scene.tween.instance.to(scene.rocket.pivot, 0.1, {
        y: scene.planetSystem.startingPlanet.body.width * 0.5 + 100 + 50 * side,
        ease: scene.tween["bounce"]["easeOut"]
      });
    } else {
      scene.bootRocket = false;
      scene.rocket.takeoff();
    }
  });
};
