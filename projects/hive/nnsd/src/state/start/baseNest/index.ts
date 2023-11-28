/*
 * @Author: kunnisser
 * @Date: 2023-11-28 17:36:25
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-11-28 17:40:03
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/baseNest/index.ts
 * @Description: ---- 基地组 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";

class BaseNest extends KnGroup {
  public game: Game;
  public sprite: KnSprite;
  constructor(game: Game, parent: KnScene) {
    super(game, "baseNest", parent);
    this.game = game;
    this.initial();
  }

  initial() {
    this.sprite = this.game.add.sprite("rocket", "rocket", [0.5, 0.5]);
    this.addChild(this.sprite);
  }
}

export default BaseNest;
