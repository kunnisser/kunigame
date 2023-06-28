/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-02 11:19:26
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
      loadingrun: "/projects/hive/nnsd/assets/atlas/loadingrun.json",
      icon: "/projects/hive/nnsd/assets/atlas/icon.json"
    };
  }

  boot() {}

  create() {
    const testGroup = this.game.add.group("group1");
    const group2 = this.game.add.group("group2", this);
    const demoText: KnText = this.game.add.text("demoText", "test1", {
      fontSize: "24",
      fill: 0xffffff
    }, [0.5, 0.5]);
    demoText.angle = 46.739919993534755;
    demoText.scale.set(0.5256201742799509, 0.6073624667437026);
    demoText.text = "充电桩";
    demoText.anchor.set(0.5, 0.5);
    demoText.y = 412;
    demoText.x = 1045.6893050963129;
    const demo1Text: KnText = this.game.add.text("demo1Text", "test2", {
      fontSize: "24",
      fill: 0xffffff
    }, [0.5, 0.5]);
    demo1Text.text = "配发";
    demo1Text.y = 412;
    demo1Text.x = 1345.3786101926257;
    const demo2Text: KnText = this.game.add.text("demo2Text", "test3", {
      fontSize: "24",
      fill: 0xffffff
    }, [0.5, 0.5]);
    demo2Text.text = "特斯拉";
    demo2Text.visible = true;
    demo2Text.y = 412;
    demo2Text.x = 1605.3786101926257;
    testGroup.addChild(demoText);
    testGroup.addChild(demo1Text);
    testGroup.addChild(demo2Text);
    this.game.add.group("groupChild", group2);
    const logo2 = this.game.add.image("logo2", "Item_Cloud0000", group2);
    logo2.scale.set(1.0300000000000002, 1.2524539231364777);
    logo2.angle = 0;
    logo2.alpha = 1;
    logo2.visible = true;
    logo2.anchor.set(0, 0);
    logo2.y = 239;
    logo2.x = 279;
    logo2.scale.x = 1;
    logo2.tintColor = "#ffffff";
    this.addChild(testGroup);
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