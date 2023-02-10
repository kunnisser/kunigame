/*
 * @Author: kunnisser
 * @Date: 2023-02-10 16:24:18
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-10 16:53:35
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/drag/dragEvent.ts
 * @Description: ---- 绑定移动事件 ----
 */

import { Container } from "pixi.js";

const dragMove = (world, target) => {
  target.alpha = 0.75;
  world.on("pointermove", (event) => {
    console.log(event);
    if (target) {
      target.toLocal(event.data.global, null, target.position);
    }
  });
};

const dragEnd = (world, target) => {
  if (target) {
    target.alpha = 1;
    world.off("pointermove", dragMove);
  }
};

export const freeMovePosition = (world: Container, target: any) => {
  target.interactive = true;
  target.cursor = "pointer";

  target.on("pointerdown", () => dragMove(world, target), target);

  world.on("pointerup", () => dragEnd(world, target));
};
