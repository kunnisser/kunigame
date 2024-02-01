/*
 * @Author: kunnisser
 * @Date: 2024-02-01 17:13:42
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-01 17:23:25
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/scene.ts
 * @Description: ---- 卡牌 ----
 */

/*
 * @Author: kunnisser
 * @Date: 2023-03-07 10:12:37
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-11-28 13:30:35
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/ast/scene.ts
 * @Description: ----  ----
 */
import Game from "ts@/kuni/lib/core";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";

class Card extends KnScene {
  game: Game;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      gameBg: "assets/images/tdBg.jpg",
    };
  }

  boot() {}

  create() {
    const gameBg = this.game.add.background("gameBg", "gameBg");
    this.addChild(gameBg);
  }

  update() {}

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Card;
