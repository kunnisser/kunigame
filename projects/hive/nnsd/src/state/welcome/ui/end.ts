/*
 * @Author: kunnisser
 * @Date: 2023-09-19 15:03:23
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-20 14:54:15
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/ui/end.ts
 * @Description: ---- 游戏结束 ----
 */

import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Welcome from "../scene";
import Game from "ts@/kuni/lib/core";

class GameOverGui extends KnGroup {
  scene: Welcome;
  game: Game;
  restart: any;
  constructor(game: Game, parent: Welcome) {
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
    this.scene.restart();
    this.scene.gameOver = false;
    this.scene.interactive = true;
  };

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }
}

export default GameOverGui;
