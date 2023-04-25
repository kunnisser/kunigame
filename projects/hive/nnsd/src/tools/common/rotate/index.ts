/*
 * @Author: kunnisser
 * @Date: 2023-04-25 17:30:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-25 17:30:37
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/rotate/index.ts
 * @Description: ---- 旋转模块 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";

class RotateTool {
  public rotateGroup: KnGroup;
  constructor(game: Game, parent: KnGroup) {
    this.rotateGroup = game.add.group("rotateContainer", parent);
  }
}

export default RotateTool;
