/*
 * @Author: kunnisser
 * @Date: 2024-02-03 00:30:29
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-17 23:16:22
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\cardcontent\mobs\index.ts
 * @Description: ---- 小怪 ----
 */
import CheckerCardWrap from '../../checkerboard/checkerCard';
import Game from 'ts@/kuni/lib/core';
import CardContent from '../content';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import Card from '../../scene';
class Mobs extends CardContent {
  game: Game;
  sprite: any;
  parent: CheckerCardWrap;
  constructor(game: Game, parent: KnGroup, card: CheckerCardWrap) {
    super(game, parent, card);
    this.game = game;
    this.attribute = 'npc';
    this.race = 'mobs';
    this.exp = 50;
    this.score = 1;
    this.initial();
  }

  initial() {
    this.sprite = this.game.add.sprite('mob', 'mob', [0.5, 0.5]);
    this.addChild(this.sprite);
    this.setHealth(1);
    this.setAttack(2);
  }

  onClick(): void {
    console.log('mobs', this);
  }

  event(target: CardContent, scene: Card) {
    this.changeSpriteTint(target.sprite, 0xffb8b8);
    target.hpValue -= this.attackValue;
    target.hp.text = target.hpValue + '';
    this.hpValue -= target.attackValue;
    this.hp.text = this.hpValue + '';
  }
}

export default Mobs;
