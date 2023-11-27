/*
 * @Author: kunnisser
 * @Date: 2023-11-27 16:52:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-11-27 16:56:53
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/enemy/index.ts
 * @Description: ---- 敌对角色的容器 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";

class TdEnemy extends KnGroup {
  constructor(game: Game, parent: KnScene) {
    super(game, "tdEnemy", parent);
  }
}

export default TdEnemy;
