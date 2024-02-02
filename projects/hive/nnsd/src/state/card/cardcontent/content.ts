/*
 * @Author: kunnisser
 * @Date: 2024-02-02 16:06:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-02 16:10:23
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/content.ts
 * @Description: ---- 卡牌内容 ----
 */

import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import CheckerCardWrap from "../checkerboard/checkerCard";
import Game from "ts@/kuni/lib/core";

class CardContent extends KnGroup { 
  race: string;
  constructor(game: Game, parent: CheckerCardWrap) { 
    super(game, 'cardContent', parent);
    this.race = '';
  }
}

export default CardContent;