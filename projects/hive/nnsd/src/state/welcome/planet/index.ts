/*
 * @Author: kunnisser
 * @Date: 2023-09-16 16:15:28
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-19 17:28:35
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/planet/index.ts
 * @Description: ---- 定义默认的星球 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import Welcome from "../scene";

class Planet extends KnGroup {
  body: KnSprite;
  gravityField: any;
  gravity: number;
  constructor(game: Game, parent: Welcome, key: string) {
    super(game, "default_planet", parent.universe);
    this.gravity = 1;
    this.initial(game, key);
  }

  generatePlanet(game, key) {
    this.body = game.add.sprite(key, key);
    this.body.anchor.set(0.5);
  }

  generateGravityField(game) {
    this.gravityField = game.add.graphics("gravityField");
    this.gravityField.generateCircle(
      0xc3d9f1,
      [0, 0, this.body.width * 1],
      0.4
    );
  }

  initialPosition(game) {
    this.position.set(
      game.config.half_w,
      game.config.half_h * 0.15 + this.body.width * 0.5
    );
  }

  initial(game: Game, key: string) {
    this.generatePlanet(game, key);
    this.generateGravityField(game);
    this.addChild(this.gravityField, this.body);
    this.initialPosition(game);
  }
}

export default Planet;
