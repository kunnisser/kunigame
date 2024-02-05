/*
 * @Author: kunnisser
 * @Date: 2024-02-03 00:30:29
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-05 22:59:39
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\cardcontent\mobs\index.ts
 * @Description: ---- 小怪 ----
 */
import CheckerCardWrap from '../../checkerboard/checkerCard';
import Game from 'ts@/kuni/lib/core';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import CardContent from '../content';
class Mobs extends CardContent {
  game: Game;
  sprite: KnSprite;
  parent: CheckerCardWrap;
  constructor(game: Game, parent: CheckerCardWrap) {
    super(game, parent);
    this.game = game;
    this.parent = parent;
    this.attribute = 'npc';
    this.race = 'mobs';
    this.initial();
  }

  initial() {
    this.sprite = this.game.add.sprite('mobs', 'mobs', [0.5, 0.5]);
    this.sprite.scale.set(0.5);
    this.addChild(this.sprite);
    // const role = this.setRole('skullBone', 'skull');
    // role.scale.set(0.5);
    // role.y += role.getBounds().height * 0.25;
    // role.animation.play('stay');
    // role.animation.timeScale = 1;
  }

  onClick(): void {
    console.log('mobs', this);
  }
}

export default Mobs;
