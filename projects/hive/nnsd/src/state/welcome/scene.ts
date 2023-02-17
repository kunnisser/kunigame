/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-17 11:10:29
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */

import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";
import { Sprite } from "pixi.js";

class Welcome extends KnScene {
  public game: Game;
  public key: String;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.key = key;
    this.resouces = {
      bg: "/projects/hive/nnsd/assets/images/bg002.jpg",
      logo: "/projects/hive/nnsd/assets/images/logo.png"
    };
  }

  boot() {}

  create() {
    const bg: Sprite = this.game.add.image("bg", this);
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;

    const logo: Sprite = this.game.add.image("logo", this);
    logo.position.set(300, 400);
    logo.anchor.set(0.5, 0);

    const demoText: KnText = this.game.add.text(
      "文本1",
      "WELCOME",
      {
        fontSize: "24",
        fill: 0xffffff
      },
      [0.5, 0.5]
    );
    demoText.position.set(this.game.config.half_w, this.game.config.half_h);
    this.addChild(demoText);

    const demo1Text: KnText = this.game.add.text(
      "文本2",
      "测试",
      {
        fontSize: "24",
        fill: 0xffffff
      },
      [0.5, 0.5]
    );
    demo1Text.position.set(
      this.game.config.half_w * 0.5,
      this.game.config.half_h * 0.5
    );
    this.addChild(demo1Text);
    this.sortChildren();
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
