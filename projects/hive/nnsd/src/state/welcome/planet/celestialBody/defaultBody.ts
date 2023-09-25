/*
 * @Author: kunnisser
 * @Date: 2023-09-20 14:01:26
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-25 17:19:09
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/planet/celestialBody/defaultBody.ts
 * @Description: ---- 普通星体 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import PlanetSystem from "..";

class Planet extends KnGroup {
  game: Game;
  body: KnSprite;
  constructor(game: Game, parent: PlanetSystem, key: string) {
    super(game, "launchPlanet", parent);
    this.game = game;
    this.initGenerator(key);
  }

  initGenerator(key: string) {
    this.body = this.game.add.image("planet", key, this);
    this.body.anchor.set(0.5, 0.5);
    this.x = this.game.config.half_w;
    this.y = this.game.config.height * 0.85 - this.body.height * 0.5;
  }

  update() {
    this.body.angle += 1;
  }
}

export default Planet;
