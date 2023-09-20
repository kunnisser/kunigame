/*
 * @Author: kunnisser
 * @Date: 2023-09-20 14:02:11
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-20 16:52:28
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/planet/celestialBody/gravityBody.ts
 * @Description: ---- 引力星体 ----
 */
import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import PlanetSystem from "..";

class GravityPlanet extends KnGroup {
  body: KnSprite;
  gravityField: any;
  gravity: number;
  constructor(game: Game, parent: PlanetSystem, key: string) {
    super(game, "gravity_planet", parent);
    this.gravity = 1;
    this.initGenerator(game, key);
  }

  generatePlanet(game, key) {
    this.body = game.add.sprite(key, key);
    this.body.anchor.set(0.5);
  }

  generateGravityField(game) {
    this.gravityField = game.add.graphics("gravityField");
    this.gravityField.generateCircle(
      0xc3d9f1,
      [0, 0, this.body.width * 0.5 + Math.random() * this.body.width],
      0.4
    );
  }

  initialPosition(game) {
    this.position.set(
      game.config.half_w,
      game.config.half_h * 0.15 + this.body.width * 0.5
    );
  }

  initGenerator(game: Game, key: string) {
    this.generatePlanet(game, key);
    this.generateGravityField(game);
    this.addChild(this.gravityField, this.body);
    this.initialPosition(game);
  }
}

export default GravityPlanet;
