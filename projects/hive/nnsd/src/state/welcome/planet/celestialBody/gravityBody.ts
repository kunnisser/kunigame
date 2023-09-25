/*
 * @Author: kunnisser
 * @Date: 2023-09-20 14:02:11
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-25 16:09:18
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/planet/celestialBody/gravityBody.ts
 * @Description: ---- 引力星体 ----
 */
import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import PlanetSystem from "..";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";
import SatelliteGroup from "../satellite";

class GravityPlanet extends KnGroup {
  body: KnSprite;
  gravityField: KnGroup;
  gravity: number;
  satellite: KnSprite;
  gravityFieldRingOut: KnGraphics;
  gravityFieldRing: KnGraphics;
  satellites: SatelliteGroup;
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
    this.gravityField = game.add.group("gravityField", this);
    this.gravityFieldRing = game.add.graphics("gravityFieldRing");
    this.gravityFieldRing.generateCircle(
      0xc3d9f1,
      [0, 0, this.body.width * 0.5 + 100],
      0.4
    );
    this.gravityFieldRingOut = game.add.graphics("gravityFieldOut");
    this.gravityFieldRingOut.generateCircle(
      0x9df1c2,
      [0, 0, this.body.width * 0.5 + 200],
      0.4
    );
    this.gravityField.addChild(this.gravityFieldRing, this.gravityFieldRingOut);
  }

  generateSatellite(game: Game) {
    this.satellites = new SatelliteGroup(game, this, [10, 2]);
    this.addChild(this.satellites);
  }

  initialPosition(game) {
    this.position.set(game.config.half_w, game.config.half_h * 0.5);
    this.pivot.set(0, 0);
    console.log(this.body.height * 0.5);
  }

  initGenerator(game: Game, key: string) {
    this.generatePlanet(game, key);
    this.generateGravityField(game);
    this.addChild(this.body);
    this.generateSatellite(game);
    this.initialPosition(game);
  }

  update() {
    this.body.angle += 0.5;
    this.satellites.update();
  }
}

export default GravityPlanet;
