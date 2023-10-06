/*
 * @Author: kunnisser
 * @Date: 2023-09-25 15:43:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-10-06 17:21:56
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\welcome\planet\satellite\index.ts
 * @Description: ----  ----
 */

import Game from 'ts@/kuni/lib/core';
import GravityPlanet from '../celestialBody/gravityBody';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';

class SatelliteGroup extends KnGroup {
  game: Game;
  generatorValues: number[];
  planet: GravityPlanet;
  constructor(game: Game, parent: GravityPlanet, values: Array<number>) {
    super(game, 'satelliteGroup', parent);
    this.game = game;
    this.generatorValues = values;
    this.planet = parent;
    this.generatorSatellite();
    parent.addChild(this);
  }

  generatorSatellite() {
    const satellites = this.generatorValues.map((val, index) => {
      const sateBody = this.game.add.group('sateBody', this);
      this.game.add.image('', 'satellite', sateBody, [0.5, 0.5]);
      sateBody.pivot.y = this.planet.body.width * 0.5 + 50 + (index % 2) * 100;
      sateBody.angle += index * 90;
      const text = this.game.add.text(
        '',
        val + '',
        {
          fontSize: 20,
        },
        [0.5, 0.5]
      );
      const angleText = this.game.add.text(
        '',
        sateBody.angle + '',
        {
          fill: 0x4cd103,
          fontSize: 30,
        },
        [0.5, 0.5]
      );
      angleText.y -= 50;
      sateBody.addChild(text, angleText);
      return sateBody;
    });
    this.addChild(...satellites);
  }
  update() {
    this.children.map((sat: any) => {
      const angle = (360 + ((sat.angle + this.angle) % 360)) % 360;
      return (sat.children[2].text = angle.toFixed(2));
    });
    this.angle -= 0.1;
  }
}

export default SatelliteGroup;
