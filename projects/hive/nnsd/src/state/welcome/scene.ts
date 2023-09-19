/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-19 17:33:08
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import { KnTween } from "ts@/kuni/lib/gameobjects/kn_tween";
import Rocket from "./rocket/rocket";
import Planet from "./planet";
import { isImpact, mainTouchEvent } from "./events";
import { isInOrbit } from "./events/collision";
import KnTiling from "ts@/kuni/lib/gameui/kn_tiling";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import GameOverGui from "./ui/end";

class Welcome extends KnScene {
  game: Game;
  key: String;
  moon: KnSprite;
  bootRocket: boolean;
  tween: KnTween;
  rocket: Rocket;
  gameOver: Boolean;
  planetSystem: Planet;
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
    this.universe = this.game.add.group("universe", this);
    this.planetSystem = new Planet(this.game, this, "waterPlanet");
    const moon = this.game.add.image("moon", "moon", this.universe);
    moon.anchor.set(0.5, 0.5);
    moon.x = this.game.config.half_w;
    moon.y = this.game.config.height * 0.85 - moon.height * 0.5;
    this.moon = moon;
    this.rocket = new Rocket(this.game, this);
    mainTouchEvent(this);

    this.gameOverGui = new GameOverGui(this.game, this);
  }

  next() {
    const cameraMoving = this.tween.instance.to(this.universe, 0.5, {
      y: "+=" + this.game.config.height * 0.5,
      ease: this.tween["cubic"]["easeInOut"]
    });
    cameraMoving.seek(0).restart();
  }

  update() {
    if (this.gameOver) {
      return;
    }

    this.bg.moveY(0.5);
    this.planetSystem.angle += 1;
    this.moon.angle += 2;
    this.rocket.landing(this.moon);
    this.rocket.booting(this.moon);
    isImpact(this);
    this.rocket.isInOrbit || isInOrbit(this);
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Welcome;
