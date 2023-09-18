/*
 * @Author: kunnisser
 * @Date: 2023-09-14 15:13:11
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-18 15:55:25
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/welcome/rocket/rocket.ts
 * @Description: ---- 创建🚀的基本型 ----
 */

import { TweenMax } from "gsap";
import { utils } from "pixi.js";
import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import { KnTween } from "ts@/kuni/lib/gameobjects/kn_tween";
import Welcome from "../scene";
import { math } from "ts@/kuni/lib/utils/common";
class Rocket extends KnGroup {
  power: number;
  incX: number; // x,y方向的位移增量
  incY: number;
  sprite: KnSprite;
  emitter: any;
  game: Game;
  boom: PIXI.AnimatedSprite;
  plume: PIXI.AnimatedSprite;
  tween: KnTween;
  shake: TweenMax;
  parent: Welcome;
  isInOrbit: boolean;
  constructor(game: Game, parent: KnScene) {
    super(game, "default_rocket_group", parent);
    this.game = game;
    this.tween = game.add.tween();
    this.power = 0;
    this.isInOrbit = false;
    this.incX = 0;
    this.incY = 0;
    this.initial();
  }

  initial() {
    this.x = this.parent.moon.x;
    this.y = this.parent.moon.y;
    this.emitter = this.game.add.emitter(this.game, 1, "gas");
    this.sprite = this.game.add.sprite("rocket", "rocket");
    this.sprite.anchor.set(0.5, 1);
    this.sprite.pivot.y = this.parent.moon.height * 0.5;
    this.shake = this.generateTween();
    const plume = this.game.add.animation(
      ["fire1.png", "fire2.png", "fire3.png"].map(
        (key) => utils.TextureCache[key]
      ),
      0.4
    );
    plume.anchor.set(0.5, 0);
    plume.scale.set(0.2);
    plume.position.set(this.sprite.x, this.sprite.y + 10);
    plume.angle = 180;

    const boom = this.game.add.animation(
      [
        "boom1.png",
        "boom2.png",
        "boom3.png",
        "boom4.png",
        "boom5.png",
        "boom6.png",
        "boom7.png"
      ].map((key) => utils.TextureCache[key]),
      0.2
    );
    boom.position.set(0, -this.parent.moon.height * 0.5 - this.sprite.height);
    boom.anchor.set(0.5, 1);
    boom.loop = false;
    this.addChild(this.emitter, plume, boom, this.sprite);
    this.boom = boom;
    this.plume = plume;
    this.boom.visible = false;
    this.plume.visible = false;
    this.emitter.visible = false;
  }

  // 火箭发射缓动
  generateTween() {
    const { duration, scale, scaleloop, yoyo, repeat, ease, inout, delay } = {
      scale: {
        x: 1.1,
        y: 0.95
      },
      scaleloop: true,
      repeat: 5,
      delay: 0,
      duration: 0.1,
      yoyo: true,
      ease: "cubic",
      inout: "easeOut"
    };

    const shakeTween = this.tween.instance.to(this.sprite.scale, duration, {
      startAt: { x: 1, y: 1 },
      x: scale.x,
      y: scale.y,
      paused: true,
      delay,
      yoyo,
      repeat,
      ease: this.tween[ease][inout],
      onComplete: () => {
        scaleloop && shakeTween && shakeTween.seek(0).restart(true);
      }
    });
    return shakeTween;
  }

  // 激活吸取能量
  booting(target) {
    if (this.emitter.visible) {
      this.power += 0.05;
      this.emitter.multeShootOnce(
        this.game,
        this.tween,
        0,
        -target.height * 0.5,
        {
          duration: 0.5,
          count: 2,
          offsetX: target.width * 0.5,
          offsetY: target.height * 0.85,
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
    } else {
      if (this.isInOrbit) {
        this.orbiting();
      } else {
        this.x += this.incX;
        this.y += this.incY;
        this.checkMoving();
      }
    }
  }

  // 起飞时刻计算角度，关闭粒子发射，打开尾焰动画
  takeoff(debug?: number) {
    if (this.power > 0) {
      this.computedDirectSpeed(debug || this.angle);
      this.power = 0;
      this.emitter.visible = false;
      this.plume.visible = true;
      this.plume.play();
    }
    this.shake.pause(0);
  }

  computedDirectSpeed(angle: number) {
    const rotate: number = (Math.PI / 180) * angle;
    const [x, y] = [
      Math.sin(rotate) * this.power,
      -Math.cos(rotate) * this.power
    ];
    this.incX = +x.toFixed(2);
    this.incY = +y.toFixed(2);
  }

  landed() {
    this.plume.visible = false;
    this.plume.stop();
  }

  // 坠毁
  crashed(point: any) {
    this.landed();
    this.sprite.visible = false;
    this.boom.visible = true;
    const hitAngle = math.angleBetweenPoints(
      this.parent.planetSystem.position,
      point
    );
    console.log(hitAngle);
    this.boom.rotation += hitAngle + Math.PI / 2;
    this.boom.onComplete = () => {
      this.boom.visible = false;
    };
    this.boom.play();
  }

  // 入轨环绕
  orbiting() {
    this.position.set(this.parent.planetSystem.x, this.parent.planetSystem.y);
    this.angle += 1.5;
  }

  // 驻扎在星球转动
  landing(target) {
    if (!this.plume.visible) {
      this.angle = target.angle;
    }
  }

  checkMoving() {
    if (
      this.x < 0 ||
      this.x > this.game.config.width ||
      this.y < 0 ||
      this.y > this.game.config.height
    ) {
      this.gameOver();
    }
  }

  gameOver(point?: any) {
    this.parent.gameOver = true;
    point && this.crashed(point);
    // if (restart) {
    //   this.angle = 0;
    //   this.incX = 0;
    //   this.incY = 0;
    //   this.parent.planetSystem.angle = 0;
    //   this.parent.moon.angle = 0;
    //   this.position.set(this.parent.moon.x, this.parent.moon.y);
    //   this.parent.gameOver = false;
    // }
  }
}

export default Rocket;
