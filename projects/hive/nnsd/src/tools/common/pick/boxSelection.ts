/*
 * @Author: kunnisser
 * @Date: 2023-04-27 10:30:17
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-28 15:52:58
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/pick/boxSelection.ts
 * @Description: ---- 框选功能 ----
 */

import Game from "ts@/kuni/lib/core";

const eventFormat = (x, y) => {
  return {
    data: {
      global: {
        x,
        y
      }
    }
  };
};
export const boxSelection = (game: Game) => {
  const canvas: any = game.view.children[0];
  canvas.onmousedown = (event: MouseEvent) => {
    const [x, y] = game.coverMask.translateWheelScalePosition(
      eventFormat(event.offsetX, event.offsetY)
    );
    console.log(x, y);
  };
  canvas.oumouseup = (event: MouseEvent) => {
    const [x, y] = game.coverMask.translateWheelScalePosition(
      eventFormat(event.offsetX, event.offsetY)
    );
    console.log(x, y);
  };
};
