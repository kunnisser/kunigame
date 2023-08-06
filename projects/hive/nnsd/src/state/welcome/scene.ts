/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-08-05 01:27:38
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\welcome\scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import Game from 'ts@/kuni/lib/core';
import KnText from 'ts@/kuni/lib/gameobjects/kn_text';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';

class Welcome extends KnScene {
  game: Game;
  key: String;

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
    };
  }

  boot() {}

  create() {
    const bg: KnSprite = this.game.add.background('bg', 'gameBg');
    this.addChild(bg);
  }

  update() {}

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Welcome;
