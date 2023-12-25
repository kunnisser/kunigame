/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-12-25 16:14:55
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import TdEnemy from "./enemy";
import Warrior from "./hero/character/warrior";

class Start extends KnScene {
  game: Game;
  monsterSystem: TdEnemy;
  firstLevel: number;
  role: Warrior;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      gameBg: "assets/images/tdBg.jpg",
      attack: "assets/images/attack.png",
      logo: "assets/images/logo.png",
      monsterlv1: "assets/images/monster01.png",
      rocket: "assets/images/rocket.png",
      gas: "assets/images/gas.png",
      texSke: "assets/atlas/role_ske.json",
      texData: "assets/atlas/role_tex.json",
      tex: "assets/atlas/role_tex.png",
      hpOutBar: "assets/images/hp_out_bar.png",
      hpInnerBar: "assets/images/hp_inner_bar.png"
    };
  }

  boot() {}

  create() {
    // const gameBg = this.game.add.background('gameBg', 'gameBg');
    // this.addChild(gameBg);

    this.monsterSystem = new TdEnemy(this.game, this);
    this.monsterSystem.position.set(0, 0);
    this.interactive = true;

    this.firstLevel = 1000;

    this.role = new Warrior(this.game, this);
    this.role.x = this.game.config.half_w;
    this.role.y = this.game.config.half_h;

    this.on("pointerdown", () => {
      console.log("123");
    });
  }

  freedMonster() {
    if (this.firstLevel < 0) {
      console.log("stop");
    } else {
      this.firstLevel % 100 === 0 && this.monsterSystem.dispatch(this.role);
      this.firstLevel -= 1;
    }
  }

  update() {
    this.freedMonster();
    this.monsterSystem.behaving();
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Start;
