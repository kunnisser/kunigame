/*
 * @Author: kunnisser
 * @Date: 2023-04-24 17:30:40
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-25 17:30:58
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/pick/index.ts
 * @Description: ---- 选中模块 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";

class PickTool {
  public pickGroup: KnGroup;
  constructor(game: Game, parent: KnGroup) {
    this.pickGroup = game.add.group("pickContainer", parent);
  }
}

export default PickTool;
