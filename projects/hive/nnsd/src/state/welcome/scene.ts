/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-13 14:42:34
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import { utils } from "pixi.js";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import { KnTween } from "ts@/kuni/lib/gameobjects/kn_tween";
import KnEmitter from "ts@/kuni/lib/gameobjects/kn_emitter";
class Welcome extends KnScene {
  game: Game;
  key: String;
  moon: KnSprite;
  moonGroup: KnGroup;
  waterPlanet: KnSprite;
  power: number;
  bootRocket: boolean;
  rocketEmitter: KnEmitter;
  tween: KnTween;

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
    this.tween = this.game.add.tween();
    this.addChild(bg);
    this.moonGroup = this.game.add.group("planet", this);
    this.moonGroup.x = this.game.config.half_w;
    this.moonGroup.y = this.game.config.height * 0.85;
    const moon = this.game.add.image("moon", "moon", this.moonGroup);
    moon.anchor.set(0.5, 0.5);
    moon.x = 0;
    moon.y = 0;
    this.moon = moon;
    this.moonGroup.y -= this.moon.height * 0.5;
    this.power = 0;
    this.interactive = true;
    this.on("pointerdown", () => {
      this.bootRocket = true;
      this.rocketEmitter.visible = true;
    });
    this.on("pointerup", () => {
      this.bootRocket = false;
      console.log(this.power);
      this.power = 0;
      this.rocketEmitter.visible = false;
    });
    this.waterPlanet = this.game.add.image("waterPlanet", "waterPlanet", this);
    this.waterPlanet.anchor.set(0.5);
    this.waterPlanet.position.set(
      this.game.config.half_w,
      this.game.config.half_h * 0.15 + this.waterPlanet.width * 0.5
    );
    const rocket: KnSprite = this.game.add.image(
      "rocket",
      "rocket",
      this.moonGroup
    );
    rocket.anchor.set(0.5, 1);
    rocket.x = moon.x;
    rocket.y = moon.y - moon.height * 0.5;
    const fire = this.game.add.animation(
      ["fire1.png", "fire2.png", "fire3.png"].map(
        (key) => utils.TextureCache[key]
      ),
      0.4
    );
    fire.anchor.set(0.5);
    fire.scale.set(0.55);
    fire.position.set(rocket.x, rocket.y + rocket.height - 10);
    fire.angle = 180;
    this.addChild(fire);
    fire.visible = false; // fire.play();

    this.rocketEmitter = this.game.add.emitter(this.game, 1, "gas");
    this.moonGroup.addChild(this.rocketEmitter);
  }

  update() {
    this.moonGroup.angle += 2;
    this.waterPlanet.angle += 1;

    if (this.bootRocket) {
      this.power += 1;
      this.rocketEmitter.multeShootOnce(
        this.game,
        this.tween,
        0,
        -this.moon.height * 0.5,
        {
          duration: 0.5,
          count: 2,
          offsetX: this.moon.width * 0.5,
          offsetY: this.moon.height * 0.85,
          xRandom: true,
          yRandom: false,
          xDirect: true,
          yDirect: false,
          ease: "cubic",
          inout: "easInOut",
          angle: 360,
          angleRandom: true,
          angleDirect: true,
          width: 0,
          height: 0
        },
        "from"
      );
    }
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Welcome;
