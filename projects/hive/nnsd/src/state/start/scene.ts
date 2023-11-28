/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-11-28 17:41:15
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import TdEnemy from "./enemy";
import BaseNest from "./baseNest";

class Start extends KnScene {
  game: Game;
  monsterSystem: TdEnemy;
  firstLevel: number;
  baseNest: BaseNest;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      gameBg: "assets/images/gameBg.png",
      attack: "assets/images/attack.png",
      logo: "assets/images/logo.png",
      monsterlv1: "assets/images/monster01.png",
      rocket: "assets/images/rocket.png",
      gas: "assets/images/gas.png"
    };
  }

  boot() {}

  create() {
    const gameBg = this.game.add.background("gameBg", "gameBg");
    this.addChild(gameBg);
    this.monsterSystem = new TdEnemy(this.game, this);
    this.monsterSystem.position.set(0, 0);
    this.interactive = true;

    this.firstLevel = 1000;
    this.on("pointerdown", () => {
      console.log("123");
      this.monsterSystem.dispatch();
    });

    this.baseNest = new BaseNest(this.game, this);
    this.baseNest.position.set(
      this.game.config.half_w,
      this.game.config.height - 200
    );
  }

  freedMonster() {
    if (this.firstLevel < 0) {
      console.log("stop");
    } else {
      console.log(this.firstLevel);
      this.firstLevel % 200 === 0 && this.monsterSystem.dispatch();
      this.firstLevel -= 1;
    }
  }

  update() {
    this.freedMonster();
    this.monsterSystem.advancing();
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Start;
