/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-20 17:35:51
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import { KnTween } from "ts@/kuni/lib/gameobjects/kn_tween";
import Rocket from "./rocket/rocket";
import PlanetSystem from "./planet";
import { mainTouchEvent } from "./events";
import KnTiling from "ts@/kuni/lib/gameui/kn_tiling";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import GameOverGui from "./ui/end";

class Welcome extends KnScene {
  game: Game;
  key: String;
  bootRocket: boolean;
  tween: KnTween;
  rocket: Rocket;
  gameOver: Boolean;
  planetSystem: PlanetSystem;
  bg: KnTiling;
  universe: KnGroup;
  gameOverGui: GameOverGui;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.key = key;
    this.gameOver = false;
    this.bootRocket = false;
    this.tween = this.game.add.tween();
    this.resources = {
      gameBg: "assets/images/gameBg.png",
      rocket: "assets/images/rocket.png",
      fire: "assets/atlas/fire.json",
      moon: "assets/images/moon.png",
      waterPlanet: "assets/images/waterPlanet.png",
      gas: "assets/images/gas.png",
      gravityField: "assets/images/gravityField.png",
      boom: "assets/atlas/boom.json",
      levelBg1: "assets/images/levelBg1.jpg",
      restart: "assets/images/restart.png"
    };
  }

  boot() {}

  create() {
    this.interactive = true;
    this.bg = this.game.add.tiling(
      "levelBg1",
      this.game.config.width,
      this.game.config.height,
      this
    );
    this.planetSystem = new PlanetSystem(this.game, this);
    this.rocket = new Rocket(this.game, this);
    mainTouchEvent(this);
    this.gameOverGui = new GameOverGui(this.game, this);
  }

  next() {
    const cameraMoving = this.tween.instance.to(this.planetSystem, 0.5, {
      y: "+=" + this.game.config.height * 0.5,
      ease: this.tween["cubic"]["easeInOut"]
    });
    cameraMoving.seek(0).restart();
    this.planetSystem.next();
  }

  update() {
    if (this.gameOver) {
      return;
    }
    this.bg.moveY(0.5);
    this.planetSystem.update();
    this.rocket.update();
  }

  restart() {
    this.planetSystem.reset();
    this.rocket.reset();
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Welcome;
