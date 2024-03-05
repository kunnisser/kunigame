/*
 * @Author: kunnisser
 * @Date: 2019-08-17 23:46:59
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-11-29 17:31:53
 */

/* 粒子发射器类 */

import { ParticleContainer, Sprite, utils } from 'pixi.js';
import Game from '../core';
const ParticleConfig: any = {
  scale: true,
  position: true,
  visible: true,
  rotation: true,
  uvs: true,
  alpha: true,
};
class KnEmitter extends ParticleContainer {
  public key: string;
  public game: Game;
  public throtting: number; // 发射频率
  public tween: any; // 动画对象
  static throtting = 4; // 频率常量
  public shooting = !1; // 默认粒子发射状态关闭
  public constructor(game: Game, quality: number, key: string) {
    super(quality, ParticleConfig, void 0, true);
    this.game = game;
    this.key = key;
    this.throtting = KnEmitter.throtting;
    quality && this.create(quality, key);
  }

  public create(quality: number = 10, key: string) {
    const createdSprite: Array<Sprite> = [];
    for (let i = 0; i < quality; i++) {
      let sprite: Sprite = new Sprite(utils.TextureCache[key]);
      sprite.visible = false;
      sprite.alpha = 0;
      sprite.anchor.set(0.5);
      // 一次新增的多个对象
      createdSprite.push(sprite);
    }
    this.addChild(...createdSprite);
    return createdSprite;
  }
  public getParticle(count?: number) {
    const freeParticles: Array<any> = this.children.filter((particle: any) => {
      return particle.visible === false;
    });
    const bootCount: number = count || 1;
    if (freeParticles.length >= bootCount) {
      return freeParticles.slice(0, bootCount);
    } else {
      return this.create(bootCount, this.key);
    }
  }

  // 单粒子发射 (发射器移动)
  public shoot() {
    let shootParticle: Sprite = this.getParticle(1)[0];
    shootParticle.visible = true;
    shootParticle.alpha = 1;
    shootParticle.angle = 0;
    return shootParticle;
  }

  public particleBooleanDispose = (bool, ret: any) => {
    return bool ? ret : 1;
  };

  // 多粒子发射 (发射器静止)
  public shootMulti(num: number = 1): Array<Sprite> {
    const shootParticles = this.getParticle(num);
    const bootParticles: Array<Sprite> = shootParticles.map((shootParticle) => {
      shootParticle.visible = true;
      shootParticle.alpha = 1;
      shootParticle.angle = 0;
      return shootParticle;
    });
    return bootParticles;
  }

  // 粒子发射
  public multiShootOnce = (
    game,
    tween,
    pointX: number, // 粒子发射器的自身坐标
    pointY: number,
    options,
    method?: string, // 正反播放
    alpha?: number,
    callback?: any // 到达目的地回调
  ) => {
    const {
      xDirect,
      xRandom,
      yDirect,
      yRandom,
      offsetX, // 粒子发射的目标范围
      offsetY,
      count,
      duration,
      ease,
      inout,
      angle,
      angleRandom,
      angleDirect,
      width, // 粒子发生器的尺寸范围
      height,
      targetX, // 粒子发射的目的地坐标
      targetY,
    } = options;
    const particles: Array<Sprite> = this.shootMulti(count);
    let i = 0;
    for (let particle of particles) {
      particle.x = pointX + game.math.redirect() * Math.random() * width;
      particle.y = pointY + game.math.redirect() * Math.random() * height;
      tween.instance[method || 'to'](particle, duration, {
        x:
          (targetX || particle.x) +
          this.particleBooleanDispose(xDirect, game.math.redirect()) *
            this.particleBooleanDispose(xRandom, Math.random()) *
            offsetX,
        y:
          (targetY || particle.y) +
          this.particleBooleanDispose(yDirect, game.math.redirect()) *
            this.particleBooleanDispose(yRandom, Math.random()) *
            offsetY,
        angle:
          particle.angle +
          this.particleBooleanDispose(angleDirect, game.math.redirect()) *
            this.particleBooleanDispose(angleRandom, Math.random()) *
            angle,
        alpha: alpha || 0,
        delay: i * 0.08
        ,
        ease: tween[ease][inout],
        onComplete: () => callback(particle)
      });
    i++;
    }
  };
}

export default KnEmitter;
