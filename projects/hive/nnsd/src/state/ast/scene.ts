/*
 * @Author: kunnisser
 * @Date: 2023-03-07 10:12:37
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-15 17:20:46
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
      desyrel: "/projects/hive/nnsd/assets/fonts/desyrel.xml"
    };
  }

  boot() {}

  create() {
    const demoText: KnText = this.game.add.text("demoText", "WELCOME", {
      fontSize: 100
    }, [0.5, 0.5]);
    demoText.style.fontSize = 500;
    demoText.style.fontSize = 258;
    demoText.style.fontSize = 267;
    demoText.alpha = 1;
    demoText.scale.y = 0.3;
    demoText.scale.x = 0.3;
    demoText.text = "WELCOME";
    demoText.anchor.set(0.5, 0.5);
    demoText.visible = true;
    demoText.style.dropShadowDistance = 16;
    demoText.style.dropShadowBlur = 10;
    demoText.style.dropShadowAngle = 0.6;
    demoText.style.dropShadow = true;
    demoText.style.dropShadowColor = "#57d8d8";
    demoText.style.fill = "#ffffff";
    demoText.style.strokeThickness = 20;
    demoText.style.stroke = "#2a5860";
    demoText.x = 960;
    demoText.y = 480;
    const testGroup = this.game.add.group("group1", this);
    testGroup.addChild(demoText);
    const group2 = this.game.add.group("group2", this);
    group2.y = 274;
    group2.x = 486;
    this.game.add.group("groupChild", group2);
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