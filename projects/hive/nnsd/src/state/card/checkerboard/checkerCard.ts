/*
 * @Author: kunnisser
 * @Date: 2024-02-02 13:53:45
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-02 17:34:26
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/checkerboard/checkerCard.ts
 * @Description: ---- 卡牌外壳 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import CheckerLayout from "./checkerLayout";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import CardContent from "../cardcontent/content";
import { CardContentMap } from "../cardcontent/combine";

class CheckerCardWrap extends KnGroup { 
  game: Game;
  wrap: KnSprite;
  parent: CheckerLayout;
  content: CardContent;
  type: string | void;
  constructor(game: Game, parent: CheckerLayout, type?: string) { 
    super(game, 'cardWrap', parent);
    this.parent = parent;
    this.game = game;
    this.type = type;
    this.initialWrap();
    this.setContent();
  }

  initialWrap() { 
    this.wrap = this.game.add.image('cardWrap', "cardWrap", this, [0.5, 0.5]);
    // 根据layout的尺寸来设置卡牌外壳的宽高尺寸
    this.wrap.width = this.parent.latticeWidth;
    this.wrap.height = this.parent.latticeHeight;
  }

  setContent() { 
    if (this.type) { 
      this.content = new CardContentMap[this.type](this.game, this);
    }
  }
}

export default CheckerCardWrap;