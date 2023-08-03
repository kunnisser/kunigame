/*
 * @Author: kunnisser
 * @Date: 2023-03-07 10:12:37
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-08-02 16:54:15
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/ast/scene.ts
 * @Description: ----  ----
 */
import Game from "ts@/kuni/lib/core";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";

class AST extends KnScene {
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      icon: "/projects/hive/nnsd/assets/atlas/icon.json",
      logo: "/projects/hive/nnsd/assets/images/logo.png",
      bg002: "/projects/hive/nnsd/assets/images/bg002.jpg",
      attack: "/projects/hive/nnsd/assets/images/attack.png",
      desyrel: "/projects/hive/nnsd/assets/fonts/desyrel.xml",
      avator_01: "/projects/hive/nnsd/assets/images/avator_01.png",
      boy: "/projects/hive/nnsd/assets/atlas/boy.json",
      skills: "/projects/hive/nnsd/assets/atlas/skills.json",
      bird: "/projects/hive/nnsd/assets/atlas/bird.json",
      bg: "/projects/hive/nnsd/assets/images/bg.png",
      background: "/projects/hive/nnsd/assets/atlas/background.json",
      titleBg: "/projects/hive/nnsd/assets/images/titleBg.png",
      startBtn: "/projects/hive/nnsd/assets/images/startBtn.png",
      role: "/projects/hive/nnsd/assets/images/role.png",
      gameBg: "/projects/hive/nnsd/assets/images/gameBg.png",
      mainPeak: "/projects/hive/nnsd/assets/images/mainPeak.png",
      mountain: "/projects/hive/nnsd/assets/images/mountain.png",
      platform: "/projects/hive/nnsd/assets/images/platform.png"
    };
  }

  boot() {}

  create() {
    const gameBg = this.game.add.background("gameBg", "gameBg");
    this.addChild(gameBg);
    const demoText: KnText = this.game.add.text("demoText", "WELCOME", {
      fontSize: 100
    }, [0.5, 0.5]);
    demoText.scale.x = 1;
    demoText.style.fontSize = 75;
    demoText.style.fill = "#ff6161";
    demoText.angle = 0;
    demoText.scale.y = 1;
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
    demoText.x = 597;
    demoText.y = 445;
    const cloud = this.game.add.image("cloud", "titleBg", this);
    cloud.scale.y = 1.2;
    cloud.scale.x = 1.2;
    cloud.anchor.set(0.5, 0.5);
    cloud.y = 450;
    cloud.x = 609;
    this.addChild(demoText);
    const mainPeak = this.game.add.image("mainPeak", "mainPeak", this);
    mainPeak.scale.y = 1.5;
    mainPeak.scale.x = 1.5;
    mainPeak.y = 1255;
    mainPeak.x = -6;
    const mountain = this.game.add.image("mountain", "mountain", this);
    mountain.scale.set(1.28, 1.26);
    mountain.scale.x = 1.2;
    mountain.y = 1918;
    mountain.x = 1;
    const platform = this.game.add.image("platform", "platform", this);
    platform.scale.y = 1.4;
    platform.scale.x = 1.4;
    platform.scale.set(1.3900000000000001, 1.6800000000000002);
    platform.y = 1530;
    platform.x = 688;
    const start = this.game.add.button("start", "startBtn", "startBtn", this);
    start.anchor.set(0.5, 0.5);
    start.y = 1170;
    start.x = 585;
    const boy = this.game.add.image("boy", "role", this);
    boy.anchor.set(0.5, 0.5);
    boy.scale.y = 2;
    boy.scale.x = 2;
    boy.y = 1334;
    boy.x = 988;
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