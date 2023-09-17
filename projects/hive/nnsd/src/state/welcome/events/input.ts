/*
 * @Author: kunnisser
 * @Date: 2023-09-16 16:48:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-16 18:53:49
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\welcome\events\input.ts
 * @Description: ---- 输入相关事件 ----
 */

import Welcome from '../scene';

export const mainTouchEvent = (scene: Welcome) => {
  scene.interactive = true;
  scene.on('pointerdown', () => {
    scene.bootRocket = true;
    scene.rocket.emitter.visible = true;
    scene.rocket.shake.seek(0).restart(true);
  });
  scene.on('pointerup', () => {
    scene.bootRocket = false;
    scene.rocket.takeoff();
  });
};
