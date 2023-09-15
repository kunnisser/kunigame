/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-15 13:58:51
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import { KnTween } from "ts@/kuni/lib/gameobjects/kn_tween";
import Rocket from "./rocket/rocket";
class Welcome extends KnScene {
  game: Game;
  key: String;
  moon: KnSprite;
  waterPlanet: KnSprite;
  bootRocket: boolean;
  tween: KnTween;
  rocket: Rocket;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.key = key;
    this.bootRocket = false;
    this.resources = {
      gameBg: "assets/images/gameBg.png",
      rocket: "assets/images/rocket.png",
      fire: "assets/atlas/fire.json",
      moon: "assets/images/moon.png",
      waterPlanet: "assets/images/waterPlanet.png",
      gas: "assets/images/gas.png"
    };
  }

  boot() {}

  create() {
    const bg: KnSprite = this.game.add.background("bg", "gameBg");
    bg.visible = true;
    this.addChild(bg);
    const moon = this.game.add.image("moon", "moon", this);
    moon.anchor.set(0.5, 0.5);
    moon.x = this.game.config.half_w;
    moon.y = this.game.config.height * 0.85 - moon.height * 0.5;
    this.moon = moon;
    this.interactive = true;
    this.on("pointerdown", () => {
      this.bootRocket = true;
      this.rocket.emitter.visible = true;
      this.rocket.shake.seek(0).restart(true);
    });
    this.on("pointerup", () => {
      this.bootRocket = false;
      this.rocket.takeoff();
    });
    this.waterPlanet = this.game.add.image("waterPlanet", "waterPlanet", this);
    this.waterPlanet.anchor.set(0.5);
    this.waterPlanet.position.set(
      this.game.config.half_w,
      this.game.config.half_h * 0.15 + this.waterPlanet.width * 0.5
    );
    this.rocket = new Rocket(this.game, this);
    this.rocket.x = this.moon.x;
    this.rocket.y = this.moon.y;
    this.rocket.sprite.pivot.y = moon.height * 0.5;
  }

  update() {
    this.waterPlanet.angle += 1;
    this.moon.angle += 2;
    this.rocket.landing(this.moon);
    this.rocket.booting(this.moon);
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Welcome;
