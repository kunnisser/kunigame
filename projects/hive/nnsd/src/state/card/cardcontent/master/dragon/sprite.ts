/*
 * @Author: kunnisser
 * @Date: 2024-03-01 14:48:50
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-01 14:58:00
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/master/dragon/sprite.ts
 * @Description: ---- lv1 敖广 ----
 */

import Game from "ts@/kuni/lib/core";
import CardContent from "../../content";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import CheckerCardWrap from "../../../checkerboard/checkerCard";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Card from "../../../scene";
import { rem } from "ts@/kuni/lib/utils/common";

class DragonAoGang extends CardContent { 
  game: Game;
  sprite: KnSprite;
  parent: CheckerCardWrap;
  constructor(game: Game, parent: KnGroup, card: CheckerCardWrap) {
    super(game, parent, card);
    this.game = game;
    this.attribute = 'boss';
    this.race = 'dragon';
    this.initial();
  }

  initial() {
    const role = this.setRole(this.race + 'Bone', this.race);
    role.animation.play('stay');
    role.animation.timeScale = 1;
    role.scale.set(rem(0.5));
    role.y = role.getBounds().height * 0.4;
    this.addChild(role);
    this.setHealth(50);
    this.setAttack(5);
  }

  event(target: CardContent, scene: Card) {
    target.hpValue -= this.attackValue;
    target.hp.text = target.hpValue + '';
    scene.scoreBar.score += 50;
    scene.level.increaseExp(500);
  }
}

export default DragonAoGang;