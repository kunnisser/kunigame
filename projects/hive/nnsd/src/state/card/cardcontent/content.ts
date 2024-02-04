/*
 * @Author: kunnisser
 * @Date: 2024-02-02 16:06:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-04 14:06:07
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/content.ts
 * @Description: ---- 卡牌内容 ----
 */

import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import CheckerCardWrap from '../checkerboard/checkerCard';
import Game from 'ts@/kuni/lib/core';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';

class CardContent extends KnGroup {
  game: Game;
  parent: CheckerCardWrap;
  attribute: string; // 卡牌属性
  race: string; // 卡牌种族
  sprite: KnSprite | null;
  indices: Array<number>; // 卡牌系坐标
  constructor(game: Game, parent: CheckerCardWrap) {
    super(game, 'cardContent', parent);
    this.game = game;
    this.parent = parent;
    this.race = '';
    this.attribute = '';
    this.sprite = null;
    this.indices = [0, 0];
  }

  // 初始化
  initial() {}

  // 卡牌点击事件
  onClick() {}
}

export default CardContent;
