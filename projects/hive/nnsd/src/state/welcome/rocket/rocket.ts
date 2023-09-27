/*
 * @Author: kunnisser
 * @Date: 2023-09-14 15:13:11
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-28 00:19:25
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\welcome\rocket\rocket.ts
 * @Description: ---- 创建🚀的基本型 ----
 */

import { TweenMax } from 'gsap';
import { utils } from 'pixi.js';
import Game from 'ts@/kuni/lib/core';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import { KnTween } from 'ts@/kuni/lib/gameobjects/kn_tween';
import Welcome from '../scene';
import PlanetSystem from '../planet';
import { math } from 'ts@/kuni/lib/utils/common';
import SatelliteGroup from '../planet/satellite';
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
  parent: PlanetSystem;
  isInOrbit: boolean;
  scene: Welcome;
  isLanded: boolean;
  isFlying: boolean;
  hitPoint: { x: number; y: number };
  self: KnGroup;
  orbitIndex: number;
  constructor(game: Game, parent: Welcome) {
    super(game, 'default_rocket_group', parent.planetSystem);
    this.game = game;
    this.scene = parent;
    this.tween = game.add.tween();
    this.power = 0;
    this.isInOrbit = false; // 是否进入轨道
    this.incX = 0;
    this.incY = 0;
    this.isLanded = true; // 是否着陆
    this.isFlying = false; // 是否飞行中
    this.orbitIndex = 1; // 在轨道中的序列
    this.initial();
  }

  initial() {
    this.x = this.scene.planetSystem.startingPlanet.x;
    this.y = this.scene.planetSystem.startingPlanet.y;
    this.emitter = this.game.add.emitter(this.game, 1, 'gas');
    this.sprite = this.game.add.sprite('rocket', 'rocket');
    this.sprite.anchor.set(0.5, 1);
    this.pivot.y = this.scene.planetSystem.startingPlanet.body.height * 0.5;
    this.emitter.y = this.scene.planetSystem.startingPlanet.body.height * 0.5;
    this.shake = this.generateTween();
    const plume = this.game.add.animation(
      ['fire1.png', 'fire2.png', 'fire3.png'].map(
        (key) => utils.TextureCache[key]
      ),
      0.4
    );
    plume.anchor.set(0.5, 1);
    plume.scale.set(0.2);
    plume.position.set(0, 4);
    plume.angle = 180;

    const boom = this.game.add.animation(
      [
        'boom1.png',
        'boom2.png',
        'boom3.png',
        'boom4.png',
        'boom5.png',
        'boom6.png',
      ].map((key) => utils.TextureCache[key]),
      0.2
    );
    boom.position.set(0, -this.sprite.height);
    boom.anchor.set(0.5, 0);
    boom.loop = false;
    this.self = this.game.add.group('self', this);
    this.self.addChild(this.emitter, plume, boom, this.sprite);
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
        y: 0.95,
      },
      scaleloop: true,
      repeat: 5,
      delay: 0,
      duration: 0.1,
      yoyo: true,
      ease: 'cubic',
      inout: 'easeOut',
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
      },
    });
    return shakeTween;
  }

  // 激活吸取能量
  booting(target) {
    if (this.emitter.visible) {
      this.power > 4 || (this.power += 0.1);
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
          ease: 'cubic',
          inout: 'easInOut',
          angle: 360,
          angleRandom: true,
          angleDirect: true,
          width: 0,
          height: 0,
        },
        'from'
      );
    } else {
      if (this.isInOrbit && !this.isFlying) {
        this.orbiting();
      } else {
        this.checkMoving();
      }
      this.x += this.incX;
      this.y += this.incY;
    }
  }

  // 还原火箭碰撞点的相对坐标
  resetRocketHitPosition() {
    const rocketFromPlanet: number =
      this.parent.startingPlanet.body.height * 0.5 + this.sprite.height;
    const offset = this.computeAngleOffset(this.angle, rocketFromPlanet);
    this.hitPoint = { x: offset.x, y: -offset.y };
  }

  // 起飞时刻计算角度，关闭粒子发射，打开尾焰动画
  takeoff(debug?: number) {
    if (this.power > 0) {
      this.resetRocketHitPosition();
      this.isLanded = false;
      this.isInOrbit = false;
      this.isFlying = true;
      this.computedDirectSpeed(debug || this.angle);
      this.emitter.visible = false;
      this.plume.visible = true;
      this.plume.play();
    }
    this.shake.pause(0);
  }

  computedDirectSpeed(angle: number) {
    const rotate: number = (Math.PI / 180) * angle;
    const power = 5 + this.power;
    const [x, y] = [Math.sin(rotate) * power, -Math.cos(rotate) * power];
    this.incX = +x.toFixed(2);
    this.incY = +y.toFixed(2);
  }

  computeAngleOffset(angle: number, distance: number) {
    const rotate: number = (Math.PI / 180) * angle;
    const [x, y] = [Math.sin(rotate) * distance, Math.cos(rotate) * distance];
    return { x, y };
  }

  landed() {
    this.power = 0;
    this.isFlying = false;
    this.plume.visible = false;
    this.plume.stop();
  }

  // 坠毁
  crashed(point: any) {
    this.scene.gameOver = true;
    this.sprite.visible = false;
    this.isFlying = false;
    this.landed();
    const hitAngle = math.angleBetweenPoints(
      this.scene.planetSystem.targetPlanet.position,
      point
    );
    this.boom.visible = true;
    console.log(hitAngle);
    this.boom.rotation = -hitAngle;
    this.boom.gotoAndPlay(0);
    this.boom.onComplete = () => {
      this.boom.visible = false;
      this.scene.gameOverGui.open();
    };
  }

  // 入轨环绕
  orbiting() {
    const satellites: SatelliteGroup =
      this.scene.planetSystem.startingPlanet.satellites;
    if (!satellites) {
      return;
    }
    // const satellite = satellites.children[0];
    // console.log('a:', this.angle % 360);
    // console.log("b:", (360 - satellites.angle) % 360);
    // console.log(satellites.angle);
    satellites.children.map((satellite: KnGroup, index: number) => {
      if (
        Math.abs(
          (this.angle % 360) - (360 + ((satellites.angle + index * 90) % 360))
        ) < 30 &&
        this.orbitIndex === index
      ) {
        if (!satellite.visible) {
          return;
        }
        console.log(index);
        const satelliteText: any = satellite.children[1];
        const satellitePower = +satelliteText.text;
        if (satellitePower <= 0) {
          satellite.visible = false;
          // satellites.removeChild(satellite);
        } else {
          satelliteText.text = satellitePower - 1 + '';
        }
        // this.scene.gameOver = true;
      }
      return null;
    });
  }

  // 驻扎在星球转动
  landing(target) {
    if (this.isLanded) {
      this.angle += this.isInOrbit ? 0.5 : 1.5;
    }
  }

  checkMoving() {
    if (
      this.x < 0 ||
      this.x > this.game.config.width ||
      this.y < 0 - this.parent.y ||
      this.y > this.game.config.height - this.parent.y
    ) {
      console.log(this.x, this.y);
      this.gameOver();
    }
  }

  reset() {
    this.visible = true;
    this.sprite.visible = true;
    this.landed();
    this.pivot.y = this.scene.planetSystem.startingPlanet.body.height * 0.5;
    this.isLanded = true;
    this.angle = 0;
    this.incX = 0;
    this.incY = 0;
    this.boom.angle = 0;
    this.emitter.visible = false;
    this.position.set(
      this.scene.planetSystem.startingPlanet.x,
      this.scene.planetSystem.startingPlanet.y
    );
  }

  update() {
    this.landing(this.parent.startingPlanet);
    this.booting(this.parent.startingPlanet.body);
  }

  gameOver() {
    this.scene.gameOver = true;
    this.scene.gameOverGui.open();
  }
}

export default Rocket;
