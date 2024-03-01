/*
 * @Author: kunnisser
 * @Date: 2024-02-03 00:30:29
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-01 14:34:46
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/mobs/index.ts
 * @Description: ---- 小怪 ----
 */
import CheckerCardWrap from '../../checkerboard/checkerCard';
import Game from 'ts@/kuni/lib/core';
import CardContent from '../content';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import Card from '../../scene';
import { rem } from 'ts@/kuni/lib/utils/common';
class Mobs extends CardContent {
  game: Game;
  sprite: any;
  parent: CheckerCardWrap;
  constructor(game: Game, parent: KnGroup, card: CheckerCardWrap) {
    super(game, parent, card);
    this.game = game;
    this.attribute = 'npc';
    this.race = 'mobs';
    this.initial();
  }

  initial() {
    const role = this.setRole('skullBone', 'skull');
    role.scale.set(rem(0.6));
    role.y = role.getBounds().height * 0.25;
    role.animation.play('stay');
    role.animation.timeScale = 1;
    this.sprite = role;
    this.addChild(role);
    this.setHealth(1);
    this.setAttack(2);
  }

  onClick(): void {
    console.log('mobs', this);
  }

  event(target: CardContent, scene: Card) {
    target.hpValue -= this.attackValue;
    target.hp.text = target.hpValue + '';
    scene.scoreBar.score += 1;
    scene.level.increaseExp(50);
  }
}

export default Mobs;
