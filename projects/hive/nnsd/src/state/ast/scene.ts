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
import KnText from "ts@/kuni/lib/gameobjects/kn_text";

class AST extends KnScene {
  game: Game;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      titleBg: "assets/images/titleBg.png",
      startBtn: "assets/images/startBtn.png",
      role: "assets/images/role.png",
      mainPeak: "assets/images/mainPeak.png",
      mountain: "assets/images/mountain.png",
      platform: "assets/images/platform.png"
    };
  }

  boot() {}

  create() {
    const gameBg = this.game.add.background("gameBg", "gameBg");
    this.addChild(gameBg);
    const demoText: KnText = this.game.add.text(
      "demoText",
      "WELCOME",
      {},
      [0.5, 0.5]
    );
    demoText.style.fontSize = 240;
    demoText.style.fill = "#ff6161";
    demoText.angle = 0;
    demoText.alpha = 1;
    demoText.text = "多多词汇峰";
    demoText.anchor.set(0.5, 0.5);
    demoText.visible = true;
    demoText.style.dropShadowDistance = 16;
    demoText.style.dropShadowBlur = 10;
    demoText.style.dropShadowAngle = 0.6;
    demoText.style.dropShadow = true;
    demoText.style.dropShadowColor = "#57d8d8";
    demoText.style.strokeThickness = 20;
    demoText.style.stroke = "#2a5860";
    demoText.x = this.game.config.half_w;
    demoText.y = 303;
    const cloud = this.game.add.image("cloud", "titleBg", this);
    cloud.x = this.game.config.half_w;
    cloud.y = 301;
    cloud.scale.y = 0.7;
    cloud.scale.x = 0.7;
    cloud.anchor.set(0.5, 0.5);
    this.addChild(demoText);
    const mainPeak = this.game.add.image("mainPeak", "mainPeak", this);
    mainPeak.anchor.set(0, 1);
    mainPeak.scale.y = 1;
    mainPeak.scale.x = 1;
    mainPeak.y = this.game.config.height;
    mainPeak.x = 0;
    const mountain = this.game.add.image("mountain", "mountain", this);
    mountain.anchor.set(0, 1);
    mountain.y = this.game.config.height;
    mountain.x = 0;
    mountain.width = this.game.config.width;
    const platform = this.game.add.image("platform", "platform", this);
    platform.y = this.game.config.height;
    platform.x = this.game.config.width;
    platform.anchor.set(1, 1);
    platform.scale.y = 1;
    platform.scale.x = 1;
    const start = this.game.add.button("start", "startBtn", "startBtn", this);
    start.anchor.set(0.5, 0.5);
    start.y = this.game.config.half_h;
    start.x = this.game.config.half_w;

    start.next = () => {
      this.game.sceneManager.changeScene(
        this.game.currentScene,
        this.game.hive["Welcome"]
      );
    };

    const boy = this.game.add.image("boy", "role", this);
    boy.anchor.set(0.5, 0.5);
    boy.scale.y = 1;
    boy.scale.x = 1;
    boy.y = 744;
    boy.x = 612;
  }

  update() {}

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default AST;
