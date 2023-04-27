/*
 * @Author: kunnisser
 * @Date: 2023-04-27 10:30:17
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-27 16:33:38
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/pick/boxSelection.ts
 * @Description: ---- 框选功能 ----
 */

import Game from "ts@/kuni/lib/core";

export const boxSelection = (game: Game) => {
  console.log(game.coverMask.lines);
  game.coverMask.lines.on("mousedown", (event: MouseEvent) => {
    console.log(event);
  });
};
