/*
 * @Author: kunnisser
 * @Date: 2023-03-07 10:12:37
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-26 11:26:28
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
      startBtn: "/projects/hive/nnsd/assets/images/startBtn.png"
    };
  }

  boot() {}

  create() {
    const gameBg = this.game.add.background("gameBg", "BG_50000");
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
    demoText.text = "CAMSCHARING";
    demoText.anchor.set(0.5, 0.5);
    demoText.visible = true;
    demoText.style.dropShadowDistance = 16;
    demoText.style.dropShadowBlur = 10;
    demoText.style.dropShadowAngle = 0.6;
    demoText.style.dropShadow = true;
    demoText.style.dropShadowColor = "#57d8d8";
    demoText.style.strokeThickness = 20;
    demoText.style.stroke = "#2a5860";
    demoText.x = 585;
    demoText.y = 433;
    const testGroup = this.game.add.group("group1", this);
    testGroup.addChild(demoText);
    const group2 = this.game.add.group("group2", this);
    group2.y = 0;
    group2.x = 0;
    this.game.add.group("groupChild", group2);
    const cloud = this.game.add.image("cloud", "titleBg", group2);
    cloud.scale.y = 1.2;
    cloud.scale.x = 1.2;
    cloud.anchor.set(0.5, 0.5);
    cloud.y = 424;
    cloud.x = 590;
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