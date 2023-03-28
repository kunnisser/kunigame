/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-28 14:03:36
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";

class Start extends KnScene {
  game: Game;
  demoTest: KnText;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      attack: "/projects/hive/nnsd/assets/images/attack.png",
      logo: "/projects/hive/nnsd/assets/images/logo.png",
      avator_01: "/projects/hive/nnsd/assets/images/avator_01.png",
      loadingrun: "/projects/hive/nnsd/assets/atlas/loadingrun.json"
    };
  }

  boot() {}

  create() {
    const demoText: KnText = this.game.add.text("demoText", "test1", {
      fontSize: "24",
      fill: 0xffffff
    }, [0.5, 0.5]);
    demoText.y = 400;
    demoText.x = 194;
    const testGroup = this.game.add.group("group1", this);
    const demo1Text: KnText = this.game.add.text("demo1Text", "test2", {
      fontSize: "24",
      fill: 0xffffff
    }, [0.5, 0.5]);
    demo1Text.position.set(300, 400);
    const demo2Text: KnText = this.game.add.text("demo2Text", "test3", {
      fontSize: "24",
      fill: 0xffffff
    }, [0.5, 0.5]);
    demo2Text.y = 727;
    demo2Text.x = 398;
    demo2Text.position.set(400, 400);
    testGroup.addChild(demoText);
    testGroup.addChild(demo1Text);
    testGroup.addChild(demo2Text);
    const group2 = this.game.add.group("group2", this);
    this.game.add.group("groupChild", group2);
    const logo = this.game.add.image("logo", group2);
    logo.texture = this.game.add.texture("loadingrun_03.png");
    logo.anchor.set(0.5, 0.5);
    logo.blendMode = 0;
    logo.scale.y = 1.8;
    logo.scale.x = 1.8;
    logo.y = 486;
    logo.tintColor = "#ffffff";
    logo.x = 883;
    console.log(PIXI.utils.TextureCache);
  }

  update() {}

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }

}

export default Start;