/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-13 17:41:07
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";

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
    const bg: KnSprite = this.game.add.image("bg", this);
    bg.tintColor = "#ffffff";
    bg.tint = 0xffffff;
    bg.y = 0;
    bg.x = 0;
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
    const logo: KnSprite = this.game.add.image("logo", this);
    logo.blendMode = 2;
    logo.angle = 0;
    logo.skew.y = 0;
    logo.skew.x = 0;
    logo.scale.x = 1;
    logo.scale.y = 1;
    logo.y = 269;
    logo.x = 417;
    logo.anchor.set(0.5, 0.5);
    const demoText: KnText = this.game.add.text(
      "demoText",
      "WELCOME",
      {},
      [0.5, 0.5]
    );
    demoText.scale.y = 0.5;
    demoText.scale.x = 0.5;
    demoText.visible = true;
    demoText.style.dropShadowDistance = 16;
    demoText.style.dropShadowBlur = 10;
    demoText.style.dropShadowAngle = 0.6;
    demoText.style.dropShadow = true;
    demoText.style.dropShadowColor = "#57d8d8";
    demoText.style.fill = "#ffffff";
    demoText.style.strokeThickness = 20;
    demoText.style.stroke = "#2a5860";
    demoText.text = "cams";
    demoText.x = 912;
    demoText.y = 244;
    demoText.style.fontSize = 500;
    const demo1Text: KnText = this.game.add.text(
      "demo1Text",
      "测试",
      {
        fontSize: "24",
        fill: 0xffffff
      },
      [0.5, 0.5]
    );
    demo1Text.text = "by.kunnisser";
    demo1Text.x = 1292;
    demo1Text.y = 724;
    demo1Text.scale.y = 1;
    demo1Text.scale.x = 1;
    const bmText = this.game.add.bitmapText(
      "bmText",
      "153112312312313123\n23012313212313\n1",
      {
        fontSize: 35,
        fontName: "Desyrel"
      }
    );
    bmText.align = "center";
    bmText.anchor.set(0.5, 0.5);
    bmText.y = 553;
    bmText.x = 870;
    bmText.letterSpacing = 11;
    bmText.fontSize = 100;
    bmText.fontName = "Desyrel";
    bmText.text = "somewhere over\nthe rainbow";
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
