/*
 * @Author: kunnisser
 * @Date: 2024-02-02 13:48:55
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-29 19:54:09
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\checkerboard\checkerLayout.ts
 * @Description: ---- 棋盘排列布局 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import CheckerCardWrap from './checkerCard';
import { math, rem } from 'ts@/kuni/lib/utils/common';
import { KnTween } from 'ts@/kuni/lib/gameobjects/kn_tween';
import WeightedRandomGenerator from '../cardcontent/combine';
class CheckerLayout extends KnGroup {
  game: Game;
  tween: KnTween;
  // 九宫格坐标系
  poolIndices: Array<Array<number>>;
  // 棋盘上的卡牌
  visibleCheckerCards: Array<CheckerCardWrap>;
  // 棋盘上的卡牌间距
  cardSpace: number;
  // 移动的坐标变更
  moveBehavior: {};
  // 反方向映射定义
  reverseBehavior: {};
  // 临时定义为玩家初始的坐标位置
  originIndices: Array<number>;
  // 加权随机生成器
  weightRandomGenerator: WeightedRandomGenerator;

  constructor(game: Game) {
    super(game, 'checkerLayout');
    this.game = game;
    this.tween = this.game.add.tween();
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
    this.cardSpace = rem(16);
    this.originIndices = [0, 0];
    this.moveBehavior = {
      left: [-1, 0],
      right: [1, 0],
      up: [0, -1],
      down: [0, 1],
    };
    this.reverseBehavior = {
      left: 'right',
      right: 'left',
      up: 'down',
      down: 'up',
    };
    this.initial();
  }

  initial() {
    this.weightRandomGenerator = new WeightedRandomGenerator();
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
        indices[0] * (card.width + this.cardSpace) + this.game.config.half_w,
        indices[1] * (card.height + this.cardSpace) + this.game.config.half_h
      );
      card.content.indices = indices;
      this.visibleCheckerCards.push(card);
    }
  }

  // 根据当前坐标设置不同的卡牌type
  setOriginType(indices) {
    return this.compareSameIndices(indices, this.originIndices)
      ? 'don'
      : this.weightRandomGenerator.random();
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
    const [, targetCard] = this.getCardByIndices(targetIndices);
    console.log('target', targetIndices);

    // 根据目标卡牌属性进行下一步操作
    if (targetCard && targetCard.content.attribute !== 'player') {
      const followIndices = this.getFollowPlayerCard(card, direct);
      const [, followCard] = this.getCardByIndices(followIndices);
      card.cardMoveLogic(targetCard, followCard, direct);
    }
  }

  // 判断坐标是否一致
  compareSameIndices = (
    preIndices: Array<number>,
    nevIndices: Array<number>
  ) => {
    return preIndices[0] === nevIndices[0] && preIndices[1] === nevIndices[1];
  };

  // 获取跟随玩家的卡牌坐标
  getFollowPlayerCard(card: CheckerCardWrap, direct: string) {
    // 跟随卡牌的坐标，移动反方向没有卡牌，则向上抓取，上方向没有，则向下抓取
    const followIndices = this.searchBeyondBoundary(
      card.content.indices,
      direct
    );
    return followIndices;
  }

  // 根据卡牌坐标查询卡牌池中的卡牌
  getCardByIndices(indices: Array<number>): [number, CheckerCardWrap] {
    const index = this.visibleCheckerCards.findIndex(
      (listCard: CheckerCardWrap) => {
        return this.compareSameIndices(listCard.content.indices, indices);
      }
    );
    return [index, this.visibleCheckerCards[index]];
  }

  // 查询超出边界情况下的跟随卡牌坐标
  searchBeyondBoundary(indices, direct: string) {
    const reverseKey: string = this.reverseBehavior[direct];
    // 先从反方向获取卡牌坐标
    let followIndices: Array<number> = [0, 0];
    const movedIndices = this.changePositionIndices(
      indices,
      this.moveBehavior[reverseKey]
    );
    if (movedIndices) {
      console.log(reverseKey, movedIndices);
      followIndices = movedIndices;
    } else {
      // 反方向超出范围，则从上下方向获取
      for (const key of Object.keys(this.moveBehavior)) {
        if (key !== direct && key !== reverseKey) {
          const searchMovedIndices = this.changePositionIndices(
            indices,
            this.moveBehavior[key]
          );
          if (searchMovedIndices) {
            followIndices = searchMovedIndices;
            break;
          }
        }
      }
    }
    return followIndices;
  }

  // 变更坐标计算
  changePositionIndices(
    originIndices: Array<number>,
    moveIndices: Array<number>
  ) {
    const movedIndices = originIndices.map(
      (i, index: number) => i + moveIndices[index]
    );
    return Math.abs(movedIndices[0]) < 2 && Math.abs(movedIndices[1]) < 2
      ? movedIndices
      : false;
  }
}

export default CheckerLayout;
