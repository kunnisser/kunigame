/*
 * @Author: kunnisser
 * @Date: 2024-03-01 14:48:50
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-17 23:16:32
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\cardcontent\master\dragon\sprite.ts
 * @Description: ---- lv1 敖广 ----
 */

import Game from "ts@/kuni/lib/core";
import CardContent from "../../content";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import CheckerCardWrap from "../../../checkerboard/checkerCard";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Card from "../../../scene";

class DragonAoGang extends CardContent { 
  game: Game;
  sprite: KnSprite;
  parent: CheckerCardWrap;
  score: number;
  exp: number;
  constructor(game: Game, parent: KnGroup, card: CheckerCardWrap) {
    super(game, parent, card);
    this.game = game;
    this.attribute = 'boss';
    this.race = 'dragon';
    this.score = 50;
    this.exp = 500;
    this.initial();
  }

  initial() {
    this.sprite = this.game.add.sprite('dragon', 'dragon', [0.5, 0.5]);
    this.addChild(this.sprite);
    this.setHealth(20);
    this.setAttack(4);
  }

  event(target: CardContent, scene: Card) {
    this.changeSpriteTint(target.sprite, 0xd10311);
    target.hpValue -= this.attackValue;
    target.hp.text = target.hpValue + '';
    this.hpValue -= target.attackValue;
    this.hp.text = this.hpValue + '';
  }
}

export default DragonAoGang;