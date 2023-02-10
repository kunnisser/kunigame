/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-10 15:55:47
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */

import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";
import { Sprite } from "pixi.js";
// import CoverMask from "ts@/kuni/lib/dev/editor_mask/cover";

class Welcome extends KnScene {
  public game: Game;
  public key: String;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.key = key;
    this.resouces = {
      "bg": "/projects/hive/nnsd/assets/images/bg002.jpg"
    };
  }

  boot() {}

  create() {
    const bg: Sprite = this.game.add.image("bg", this);
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
    const demoText: KnText = this.game.add.text(
      "WELCOME",
      {
        fontSize: "24",
        fill: 0xffffff
      },
      [0.5, 0.5]
    );
    demoText.position.set(this.game.config.half_w, this.game.config.half_h);
    this.addChild(demoText);
  }

  update() {}

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Welcome;
