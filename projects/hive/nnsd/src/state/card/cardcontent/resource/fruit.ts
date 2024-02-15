/*
 * @Author: kunnisser
 * @Date: 2024-02-14 21:23:42
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-15 12:13:26
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/resource/fruit.ts
 * @Description: ---- 资源 - 水果 ----
 */

import Game from 'ts@/kuni/lib/core';
import CardContent from '../content';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import CheckerCardWrap from '../../checkerboard/checkerCard';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import Card from '../../scene';

class Fruit extends CardContent {
  game: Game;
  sprite: KnSprite;
  parent: CheckerCardWrap;
  constructor(game: Game, parent: KnGroup, card: CheckerCardWrap) {
    super(game, parent, card);
    this.game = game;
    this.attribute = 'resource';
    this.initial();
  }

  initial() {
    const sprite = this.game.add.image('orange', 'orange', this, [0.5, 0.5]);
    sprite.scale.set(3);
    this.addChild(sprite);
  }

  onClick(): void {
    console.log('mobs', this);
  }

  event(target: CardContent, scene: Card): void {
    target.hpValue += 3;
    target.hp.text = target.hpValue + '';
  }
}

export default Fruit;
