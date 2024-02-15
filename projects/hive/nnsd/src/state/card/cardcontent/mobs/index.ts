/*
 * @Author: kunnisser
 * @Date: 2024-02-03 00:30:29
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-15 12:12:05
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/mobs/index.ts
 * @Description: ---- 小怪 ----
 */
import CheckerCardWrap from '../../checkerboard/checkerCard';
import Game from 'ts@/kuni/lib/core';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import CardContent from '../content';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import Card from '../../scene';
class Mobs extends CardContent {
  game: Game;
  sprite: KnSprite;
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
    role.scale.set(1.2);
    role.y += role.getBounds().height * 0.25;
    role.animation.play('stay');
    role.animation.timeScale = 1;
    this.addChild(role);
    this.setHealth(1);
    this.setAttack(1);
  }

  onClick(): void {
    console.log('mobs', this);
  }

  event(target: CardContent, scene: Card) {
    target.hpValue -= this.attackValue;
    target.hp.text = target.hpValue + '';
    scene.scoreBar.score += 1;
  }
}

export default Mobs;
