/*
 * @Author: kunnisser
 * @Date: 2024-02-17 22:59:34
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-01 14:54:58
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/mobs/druid.ts
 * @Description: ---- 德鲁伊 ----
 */
import CheckerCardWrap from '../../checkerboard/checkerCard';
import Game from 'ts@/kuni/lib/core';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import CardContent from '../content';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import Card from '../../scene';
import { rem } from 'ts@/kuni/lib/utils/common';
class Druid extends CardContent {
  game: Game;
  sprite: KnSprite;
  parent: CheckerCardWrap;
  constructor(game: Game, parent: KnGroup, card: CheckerCardWrap) {
    super(game, parent, card);
    this.game = game;
    this.attribute = 'npc';
    this.race = 'druid';
    this.initial();
  }

  initial() {
    const role = this.setRole(this.race + 'Bone', this.race);
    role.animation.play('stay');
    role.animation.timeScale = 1;
    role.scale.set(rem(0.5));
    role.y = role.getBounds().height * 0.4;
    this.addChild(role);
    this.setHealth(5);
    this.setAttack(5);
  }

  event(target: CardContent, scene: Card) {
    target.hpValue -= this.attackValue;
    target.hp.text = target.hpValue + '';
    scene.scoreBar.score += 1;
    scene.level.increaseExp(100);
  }
}

export default Druid;
