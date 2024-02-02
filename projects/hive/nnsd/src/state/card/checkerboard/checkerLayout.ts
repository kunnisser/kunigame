/*
 * @Author: kunnisser
 * @Date: 2024-02-02 13:48:55
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-02 17:49:42
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/checkerboard/checkerLayout.ts
 * @Description: ---- 棋盘排列布局 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import CheckerCardWrap from "./checkerCard";

class CheckerLayout extends KnGroup { 
  game: Game;
  // 九宫格坐标系
  poolIndices: Array<Array<number>>;
  // 棋盘上的卡牌
  visibleCheckerCards: Array<CheckerCardWrap>;
  // 棋盘格子尺寸
  latticeWidth: number;
  latticeHeight: number;
  originIndices: Array<number>;
  constructor(game: Game) { 
    super(game, 'checkerLayout');
    this.game = game;
    this.poolIndices = [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    this.latticeWidth = 150;
    this.latticeHeight = 200;
    this.originIndices = [0, 0];
    this.initial();
  }

  initial() {
    this.visibleCheckerCards = [];
    this.initialCardPlace();
  }

  // 初始化排列卡牌
  initialCardPlace() {
    for (const indices of this.poolIndices) {
      const card = new CheckerCardWrap(this.game, this, this.setOriginType(indices));
      card.position.set(indices[0] * this.latticeWidth + this.game.config.half_w,
        indices[1] * this.latticeHeight + this.game.config.half_h);  
      this.visibleCheckerCards.push(card);
    }
  }

  // 根据当前坐标设置不同的卡牌type
  setOriginType(indices) { 
    return indices[0] === this.originIndices[0] && indices[1] === this.originIndices[1] ? 'don' : void 0
  }
}

export default CheckerLayout;