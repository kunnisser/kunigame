/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-08 17:08:16
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
    logo.y = 453;
    logo.x = 353;
    logo.anchor.set(0.5, 0.5);
    const demoText: KnText = this.game.add.text("demoText", "WELCOME", {}, [0.5, 0.5]);
    demoText.visible = true;
    demoText.style.dropShadowDistance = 16;
    demoText.style.dropShadowBlur = 10;
    demoText.style.dropShadowAngle = 1.7;
    demoText.style.dropShadow = true;
    demoText.style.dropShadowColor = "#57d8d8";
    demoText.style.fill = "#ffffff";
    demoText.style.strokeThickness = 20;
    demoText.style.stroke = "#df0000";
    demoText.text = "cams";
    demoText.x = 1129;
    demoText.y = this.game.config.half_h;
    demoText.style.fontSize = 500;
    const demo1Text: KnText = this.game.add.text("demo1Text", "测试", {
      fontSize: "24",
      fill: 0xffffff
    }, [0.5, 0.5]);
    demo1Text.x = 1129;
    demo1Text.y = 696;
    demo1Text.scale.y = 2.8;
    demo1Text.scale.x = 4.2;
    const bmText = this.game.add.bitmapText("bmText", "153112312312313123\n23012313212313\n1", {
      fontSize: 35,
      fontName: "Desyrel"
    });
    bmText.anchor.set(0.5, 0.5);
    bmText.y = 344;
    bmText.x = 1137;
    bmText.letterSpacing = 11;
    bmText.fontSize = 100;
    bmText.fontName = "Desyrel";
    bmText.text = "cams";
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