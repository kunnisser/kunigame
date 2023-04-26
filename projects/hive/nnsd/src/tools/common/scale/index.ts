/*
 * @Author: kunnisser
 * @Date: 2023-04-26 09:55:54
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-26 09:55:55
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/scale/index.ts
 * @Description: ---- 缩放模块 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";

class ScaleTool {
  public scaleGroup: KnGroup;
  constructor(game: Game, parent: KnGroup) {
    this.scaleGroup = game.add.group("scaleContainer", parent);
  }
}

export default ScaleTool;
