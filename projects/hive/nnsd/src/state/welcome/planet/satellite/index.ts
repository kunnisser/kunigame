/*
 * @Author: kunnisser
 * @Date: 2023-09-25 15:43:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-25 17:34:54
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/planet/satellite/index.ts
 * @Description: ----  ----
 */

import Game from "ts@/kuni/lib/core";
import GravityPlanet from "../celestialBody/gravityBody";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";

class SatelliteGroup extends KnGroup {
  game: Game;
  generatorValues: number[];
  planet: GravityPlanet;
  constructor(game: Game, parent: GravityPlanet, values: Array<number>) {
    super(game, "satelliteGroup", parent);
    this.game = game;
    this.generatorValues = values;
    this.planet = parent;
    this.generatorSatellite();
    parent.addChild(this);
  }

  generatorSatellite() {
    const satellites = this.generatorValues.map((val, index) => {
      const sateBody = this.game.add.group("sateBody", this);
      this.game.add.image("", "satellite", sateBody, [0.5, 0.5]);
      sateBody.pivot.y = this.planet.body.width * 0.5 + 50 + (index % 2) * 100;
      sateBody.angle += index * 40;
      const text = this.game.add.text(
        "",
        val + "",
        {
          fontSize: 20
        },
        [0.5, 0.5]
      );
      sateBody.addChild(text);
      return sateBody;
    });
    this.addChild(...satellites);
  }
  update() {
    this.angle -= 1;
  }
}

export default SatelliteGroup;
