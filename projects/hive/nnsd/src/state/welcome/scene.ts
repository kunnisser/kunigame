/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-04 00:02:42
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\welcome\scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import Game from 'ts@/kuni/lib/core';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import { utils } from 'pixi.js';

class Welcome extends KnScene {
  game: Game;
  key: String;
  moon: KnSprite;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.key = key;
    this.resources = {
      bg: '/projects/hive/nnsd/assets/images/bg002.jpg',
      logo: '/projects/hive/nnsd/assets/images/logo.png',
      font_b: '/projects/hive/nnsd/assets/fonts/font_b.fnt',
      desyrel: '/projects/hive/nnsd/assets/fonts/desyrel.xml',
      attack: '/projects/hive/nnsd/assets/images/attack.png',
      font_a: '/projects/hive/nnsd/assets/fonts/font_a.fnt',
      avator: '/projects/hive/nnsd/assets/images/avator.jpg',
      icon: '/projects/hive/nnsd/assets/atlas/icon.json',
      background: '/projects/hive/nnsd/assets/atlas/background.json',
      gameBg: '/projects/hive/nnsd/assets/images/gameBg.png',
      rocket: '/projects/hive/nnsd/assets/images/rocket.png',
      fire: '/projects/hive/nnsd/assets/atlas/fire.json',
      moon: '/projects/hive/nnsd/assets/images/moon.png',
    };
  }

  boot() {}

  create() {
    const bg: KnSprite = this.game.add.background('bg', 'gameBg');
    bg.visible = true;
    this.addChild(bg);
    const rocket: KnSprite = this.game.add.image('rocket', 'rocket', this);
    rocket.anchor.set(0.5, 0.5);
    rocket.y = this.game.config.half_h;
    rocket.x = this.game.config.half_w;
    const fire = this.game.add.animation(
      ['fire1.png', 'fire2.png', 'fire3.png'].map(
        (key) => utils.TextureCache[key]
      ),
      0.4
    );
    fire.anchor.set(0.5);
    fire.scale.set(0.55);
    fire.position.set(rocket.x, rocket.y + rocket.height - 10);
    fire.angle = 180;
    this.addChild(fire);
    fire.play();
    const moon = this.game.add.image('moon', 'moon', this);
    moon.y = rocket.y - rocket.height - 200;
    moon.x = this.game.config.half_w;
    moon.anchor.set(0.5, 0.5);
    this.moon = moon;
  }

  update() {
    this.moon.angle += 2;
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Welcome;
