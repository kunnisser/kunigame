/*
 * @Author: kunnisser
 * @Date: 2024-02-17 22:59:34
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-03 22:58:54
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\cardcontent\mobs\druid.ts
 * @Description: ---- 德鲁伊 ----
 */
import CheckerCardWrap from '../../checkerboard/checkerCard';
import Game from 'ts@/kuni/lib/core';
import CardContent from '../content';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import Card from '../../scene';
import { rem } from 'ts@/kuni/lib/utils/common';
class Druid extends CardContent {
  game: Game;
  parent: CheckerCardWrap;
  constructor(game: Game, parent: KnGroup, card: CheckerCardWrap) {
    super(game, parent, card);
    this.game = game;
    this.attribute = 'npc';
    this.race = 'druid';
    this.score = 3;
    this.exp = 200;
    this.initial();
  }

  initial() {
    this.sprite = this.setRole(this.race + 'Bone', this.race);
    if (this.sprite) { 
      this.sprite.animation.play('stay');
      this.sprite.animation.timeScale = 1;
      this.sprite.scale.set(rem(0.5));
      this.sprite.y = this.sprite.getBounds().height * 0.4;
      this.addChild(this.sprite);
      this.setHealth(10);
      this.setAttack(2);
    }
  }

  event(target: CardContent, scene: Card) {
    this.changeSpriteTint(target.sprite, 0xd10311);
    target.hpValue -= this.attackValue;
    target.hp.text = target.hpValue + '';
    this.hpValue -= target.attackValue;
    this.hp.text = this.hpValue + '';
  }
}

export default Druid;
