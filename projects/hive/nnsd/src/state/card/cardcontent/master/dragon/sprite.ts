/*
 * @Author: kunnisser
 * @Date: 2024-03-01 14:48:50
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-09-06 11:00:51
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/master/dragon/sprite.ts
 * @Description: ---- lv1 敖广 ----
 */

import Game from "ts@/kuni/lib/core";
import CardContent from "../../content";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import CheckerCardWrap from "../../../checkerboard/checkerCard";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";

class DragonAoGang extends CardContent {
  game: Game;
  sprite: KnSprite;
  parent: CheckerCardWrap;
  score: number;
  exp: number;
  skillStep: number; // 技能触发的步数
  constructor(game: Game, parent: KnGroup, card: CheckerCardWrap) {
    super(game, parent, card);
    this.game = game;
    this.attribute = "boss";
    this.trophyAble = "mobs";
    this.race = "dragon";
    this.score = 50;
    this.exp = 500;
    this.skillStep = 5;
    this.initial();
  }

  /**
   * @description: 初始化boss属性
   * @return {*}
   */
  initial() {
    this.sprite = this.game.add.sprite("dragon", "dragon", [0.5, 0.5]);
    this.addChild(this.sprite);
    this.setHealth(20);
    this.setAttack(4);
    this.setStatusPop();
  }

  /**
   * @description: 交战触发事件
   * @param {CardContent} target
   * @param {Card} scene
   * @return {*}
   */
  event(target: CardContent, self: CardContent) {
    // this.changeSpriteTint(target.sprite, 0xd10311);
    target.hpValue -= this.attackValue;
    target.hp.text = target.hpValue + "";
    target.statusPop.style.fill = 0xd10311;
    target.popValue("-" + this.attackValue);

    this.harmed(target);
  }

  /**
   * @description: 受到目标的伤害事件
   * @param {CardContent} target
   * @return {*}
   */
  harmed(target: CardContent) {
    this.hpValue -= target.attackValue;
    this.hp.text = this.hpValue + "";
    this.popValue("-" + target.attackValue);
  }

  /**
   * @description: boss技能 【吸血术】
   * @param {CardContent} target
   * @return {*}
   */
  skill(target: CardContent) {
    const skillDamageValue = 8;
    // 伤害
    target.hpValue -= skillDamageValue;
    target.hp.text = target.hpValue + "";

    // 恢复
    this.hpValue += skillDamageValue;
    this.hp.text = this.hpValue + "";

    this.harmed(target);
  }
}

export default DragonAoGang;
