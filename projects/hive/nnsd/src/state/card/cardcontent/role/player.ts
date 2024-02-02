/*
 * @Author: kunnisser
 * @Date: 2024-02-02 15:41:11
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-02 16:28:50
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/role/player.ts
 * @Description: ---- 玩家角色1 ----
 */
import CheckerCardWrap from "../../checkerboard/checkerCard";
import Game from "ts@/kuni/lib/core";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import CardContent from "../content";


class Don extends CardContent { 
  game: Game;
  sprite: KnSprite;
  constructor(game: Game, parent: CheckerCardWrap) { 
    super(game, parent);
    this.game = game;
    this.initial();
  }
  
  initial() {
    this.race = 'human';
    this.sprite = this.game.add.sprite('don', 'satellite', [0.5, 0.5]);
    this.addChild(this.sprite);
  }
}

export default Don;