/*
 * @Author: kunnisser
 * @Date: 2023-09-16 16:15:28
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-21 23:33:56
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\welcome\planet\index.ts
 * @Description: ---- 定义默认的星球 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import Welcome from '../scene';
import Planet from './celestialBody/defaultBody';
import GravityPlanet from './celestialBody/gravityBody';
import { isImpact } from '../events';
import { isInOrbit } from '../events/collision';

class PlanetSystem extends KnGroup {
  body: KnSprite;
  gravityField: any;
  startingPoint: Planet;
  startingPlanet: Planet | GravityPlanet;
  targetPlanet: GravityPlanet;
  parent: Welcome;
  nextPlanet: GravityPlanet;
  game: Game;
  constructor(game: Game, parent: Welcome) {
    super(game, 'plantSystem', parent);
    this.game = game;
    this.initGenerator(game);
  }

  initGenerator(game) {
    this.startingPlanet = new Planet(game, this, 'moon');
    this.targetPlanet = new GravityPlanet(game, this, 'waterPlanet');
  }

  next() {
    this.nextPlanet = new GravityPlanet(this.game, this, 'waterPlanet');
    this.nextPlanet.body.tint = ~~(16777215 * Math.random());
    this.nextPlanet.position.y = this.targetPlanet.y - this.game.config.half_h;
    this.setChildIndex(this.nextPlanet, 0);
    this.startingPlanet = this.targetPlanet;
    this.targetPlanet = this.nextPlanet;
  }

  update() {
    this.startingPlanet.angle += 2;
    this.targetPlanet.angle += 1;
    this.parent.rocket.isFlying && isImpact(this.parent);
    this.parent.rocket.isFlying && isInOrbit(this.parent);
  }

  reset() {
    this.startingPlanet.angle = 0;
    this.targetPlanet.angle = 0;
  }
}

export default PlanetSystem;
