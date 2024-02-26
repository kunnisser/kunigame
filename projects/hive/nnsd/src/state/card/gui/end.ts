/*
 * @Author: kunnisser
 * @Date: 2024-02-25 22:30:29
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-25 22:52:43
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\gui\end.ts
 * @Description: ---- 游戏结束 ----
 */

import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Card from "../scene";
import Game from "ts@/kuni/lib/core";

class GameOverGui extends KnGroup {
  scene: Card;
  game: Game;
  restart: any;
  constructor(game: Game, parent: Card) {
    super(game, "gameOverGui", parent);
    this.game = game;
    this.scene = parent;
    this.initGenerator();
  }

  initGenerator() {
    this.close();
    this.restart = this.game.add.button(
      "restart",
      "restart",
      null,
      this,
      [0.5, 0.5]
    );
    this.restart.position.set(this.game.config.half_w, this.game.config.half_h);
    this.restart.next = this.start;
  }

  start = () => {
    this.close();
    this.game.sceneManager.changeScene(this.game.currentScene, this.game.currentScene);
    this.game.currentScene.create();
  };

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }
}

export default GameOverGui;
