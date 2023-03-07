/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-07 17:11:37
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";
import { Sprite } from "pixi.js";

class Welcome extends KnScene {
  game: Game;
  key: String;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.key = key;
    this.resouces = {
      bg: "/projects/hive/nnsd/assets/images/bg002.jpg",
      logo: "/projects/hive/nnsd/assets/images/logo.png",
      font_a: "/projects/hive/nnsd/assets/fonts/font_a.fnt",
      font_b: "/projects/hive/nnsd/assets/fonts/font_b.fnt",
      Desyrel: "/projects/hive/nnsd/assets/fonts/desyrel.xml"
    };
  }

  boot() {}

  create() {
    const bg: Sprite = this.game.add.image("bg", this);
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
    const logo: Sprite = this.game.add.image("logo", this);
    logo.position.x = 300;
    logo.position.y = 400;
    logo.anchor.set(0.5, 0);
    const demoText: KnText = this.game.add.text("demoText", "WELCOME", {}, [0.5, 0.5]);
    demoText.x = 1129;
    demoText.y = this.game.config.half_h;
    demoText.style.fontSize = 133;
    const demo1Text: KnText = this.game.add.text("demo1Text", "测试", {
      fontSize: "24",
      fill: 0xffffff
    }, [0.5, 0.5]);
    demo1Text.position.set(this.game.config.half_w * 0.5, this.game.config.half_h * 0.5);
    const bmText = this.game.add.bitmapText("bmText", "153112312312313123\n23012313212313\n1", {
      fontSize: 35,
      fontName: "Desyrel"
    });
    bmText.position.set(600, 300);
    this.addChild(demoText);
    this.addChild(demo1Text);
    this.addChild(bmText);
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