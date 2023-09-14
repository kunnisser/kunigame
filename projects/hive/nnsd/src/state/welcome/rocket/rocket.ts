/*
 * @Author: kunnisser
 * @Date: 2023-09-14 15:13:11
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-14 23:05:51
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\welcome\rocket\rocket.ts
 * @Description: ---- 创建🚀的基本型 ----
 */

import { utils } from 'pixi.js';
import Game from 'ts@/kuni/lib/core';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import { KnTween } from 'ts@/kuni/lib/gameobjects/kn_tween';

class Rocket extends KnGroup {
  power: number;
  incX: number; // x,y方向的位移增量
  incY: number;
  sprite: KnSprite;
  emitter: any;
  game: Game;
  fire: PIXI.AnimatedSprite;
  plume: PIXI.AnimatedSprite;
  tween: KnTween;
  constructor(game: Game, parent) {
    super(game, 'default_rocket_group', parent);
    this.game = game;
    this.tween = this.game.add.tween();
    this.power = 0;
    this.incX = 0;
    this.incY = 0;
    this.initial();
  }

  initial() {
    this.emitter = this.game.add.emitter(this.game, 1, 'gas');
    this.sprite = this.game.add.sprite('rocket', 'rocket');
    this.sprite.anchor.set(0.5, 1);
    const plume = this.game.add.animation(
      ['fire1.png', 'fire2.png', 'fire3.png'].map(
        (key) => utils.TextureCache[key]
      ),
      0.4
    );
    plume.anchor.set(0.5, 0);
    plume.scale.set(0.2);
    plume.position.set(this.sprite.x, this.sprite.y + 10);
    plume.angle = 180;
    this.addChild(this.emitter, plume, this.sprite);
    this.plume = plume;
    this.plume.visible = false;
    this.emitter.visible = false;
  }

  booting(target) {
    if (this.emitter.visible) {
      this.power += 0.05;
      this.emitter.multeShootOnce(
        this.game,
        this.tween,
        0,
        -target.height * 0.5,
        {
          duration: 0.5,
          count: 2,
          offsetX: target.width * 0.5,
          offsetY: target.height * 0.85,
          xRandom: true,
          yRandom: false,
          xDirect: true,
          yDirect: false,
          ease: 'cubic',
          inout: 'easInOut',
          angle: 360,
          angleRandom: true,
          angleDirect: true,
          width: 0,
          height: 0,
        },
        'from'
      );
    } else {
      this.x += this.incX;
      this.y += this.incY;
    }
  }

  takeoff() {
    if (this.power > 0) {
      this.computedDirectSpeed(this.angle);
      this.power = 0;
      this.emitter.visible = false;
      this.plume.visible = true;
      this.plume.play();
    }
  }

  computedDirectSpeed(angle: number) {
    const rotate: number = (Math.PI / 180) * angle;
    const [x, y] = [
      Math.sin(rotate) * this.power,
      -Math.cos(rotate) * this.power,
    ];
    this.incX = +x.toFixed(2);
    this.incY = +y.toFixed(2);
  }

  landed() {
    this.plume.visible = false;
    this.plume.stop();
  }

  landing(target) {
    if (!this.plume.visible) {
      this.angle = target.angle;
    }
  }
}

export default Rocket;
