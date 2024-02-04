/*
 * @Author: kunnisser
 * @Date: 2024-02-02 13:48:55
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-04 14:18:41
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/checkerboard/checkerLayout.ts
 * @Description: ---- 棋盘排列布局 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import CheckerCardWrap from './checkerCard';
import { math } from 'ts@/kuni/lib/utils/common';
class CheckerLayout extends KnGroup {
  game: Game;
  // 九宫格坐标系
  poolIndices: Array<Array<number>>;
  // 棋盘上的卡牌
  visibleCheckerCards: Array<CheckerCardWrap>;
  // 棋盘格子尺寸
  latticeWidth: number;
  latticeHeight: number;
  // 移动的坐标变更
  moveBehavior: {};
  // 临时定义为玩家初始的坐标位置
  originIndices: Array<number>;
  constructor(game: Game) {
    super(game, 'checkerLayout');
    this.game = game;
    this.poolIndices = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [0, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    this.latticeWidth = 150;
    this.latticeHeight = 200;
    this.originIndices = [0, 0];
    this.moveBehavior = {
      left: [-1, 0],
      right: [1, 0],
      up: [0, -1],
      down: [0, 1],
    };
    this.initial();
  }

  initial() {
    this.visibleCheckerCards = [];
    this.initialCardPlace();
  }

  // 初始化排列卡牌
  initialCardPlace() {
    for (const indices of this.poolIndices) {
      // 构建卡牌，随机（todo）生成各个不同类型的卡牌
      const card = new CheckerCardWrap(
        this.game,
        this,
        this.setOriginType(indices)
      );
      card.position.set(
        indices[0] * (this.latticeWidth + 2) + this.game.config.half_w,
        indices[1] * this.latticeHeight + this.game.config.half_h
      );
      card.content.indices = indices;
      this.visibleCheckerCards.push(card);
    }
  }

  // 根据当前坐标设置不同的卡牌type
  setOriginType(indices) {
    return this.compareSameIndices(indices, this.originIndices)
      ? 'don'
      : 'mobs';
  }

  // 根据传入的卡牌和方向，更新构建棋牌布局
  updateCheckerBoard(card: CheckerCardWrap, direct: string) {
    const targetIndices: Array<number> = card.content.indices?.map(
      (i: number, index: number) => {
        // 玩家卡牌移动至指定坐标，同时夹逼范围【-2<<2】
        return math.clamp(i + this.moveBehavior[direct][index], -1, 1);
      }
    ) as Array<number>;

    // 获取目标卡牌
    const targetCard: CheckerCardWrap | void = this.visibleCheckerCards.find(
      (card: CheckerCardWrap) => {
        return this.compareSameIndices(card.content.indices, targetIndices);
      }
    );
    // 根据目标卡牌属性进行下一步操作
    if (targetCard && targetCard.content.attribute !== 'player') {
      card.content.indices = targetIndices;
      console.log(targetCard);
    }
  }

  // 判断坐标是否一致
  compareSameIndices = (
    preIndices: Array<number>,
    nevIndices: Array<number>
  ) => {
    return preIndices[0] === nevIndices[0] && preIndices[1] === nevIndices[1];
  };
}

export default CheckerLayout;
