/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-18 00:07:27
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\welcome\scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import Game from 'ts@/kuni/lib/core';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import { KnTween } from 'ts@/kuni/lib/gameobjects/kn_tween';
import Rocket from './rocket/rocket';
import Planet from './planet';
import { isImpact, mainTouchEvent } from './events';
import { utils } from 'pixi.js';

class Welcome extends KnScene {
  game: Game;
  key: String;
  moon: KnSprite;
  bootRocket: boolean;
  tween: KnTween;
  rocket: Rocket;
  gameOver: Boolean;
  planetSystem: Planet;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.key = key;
    this.gameOver = false;
    this.bootRocket = false;
    this.resources = {
      gameBg: 'assets/images/gameBg.png',
      rocket: 'assets/images/rocket.png',
      fire: 'assets/atlas/fire.json',
      moon: 'assets/images/moon.png',
      waterPlanet: 'assets/images/waterPlanet.png',
      gas: 'assets/images/gas.png',
      gravityField: 'assets/images/gravityField.png',
      boom1: 'assets/images/boom1.png',
      boom: 'assets/atlas/boom.json',
    };
  }

  boot() {}

  create() {
    const bg: KnSprite = this.game.add.background('bg', 'gameBg');
    bg.visible = true;
    this.addChild(bg);
    this.planetSystem = new Planet(this.game, this, 'waterPlanet');
    const moon = this.game.add.image('moon', 'moon', this);
    moon.anchor.set(0.5, 0.5);
    moon.x = this.game.config.half_w;
    moon.y = this.game.config.height * 0.85 - moon.height * 0.5;
    const boom = this.game.add.animation(
      [
        'boom1.png',
        'boom2.png',
        'boom3.png',
        'boom4.png',
        'boom5.png',
        'boom6.png',
        'boom7.png',
      ].map((key) => utils.TextureCache[key]),
      0.2
    );
    boom.position.set(350, 550);
    boom.anchor.set(0.5, 1);
    boom.play();
    this.addChild(boom);
    this.moon = moon;
    this.rocket = new Rocket(this.game, this);
    mainTouchEvent(this);
  }

  update() {
    if (this.gameOver) {
      return;
    }

    this.planetSystem.angle += 1;
    this.moon.angle += 2;
    this.rocket.landing(this.moon);
    this.rocket.booting(this.moon);
    isImpact(this);
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Welcome;
