/*
 * @Author: kunnisser
 * @Date: 2024-02-01 17:13:42
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-05 15:25:28
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/scene.ts
 * @Description: ---- 卡牌 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import CheckerLayout from './checkerboard/checkerLayout';

class Card extends KnScene {
  game: Game;
  layout: CheckerLayout;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      bg: 'assets/images/bg.png',
      cardWrap: 'assets/images/cardWrap.png',
      don: 'assets/images/satellite.png',
      mobs: 'assets/images/monster0.png',
    };
  }

  boot() {}

  create() {
    const gameBg = this.game.add.background('bg', 'bg');
    this.layout = new CheckerLayout(this.game);
    this.addChild(gameBg, this.layout);
  }

  update() {}

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Card;
