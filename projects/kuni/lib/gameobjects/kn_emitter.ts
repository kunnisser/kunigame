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
    this.alpha = 1;
    this.throtting = KnEmitter.throtting;
    quality && this.create(quality, key);
  }

  public create(quality: number = 10, key: string) {
    const createdSprite: Array<Sprite> = [];
    for (let i = 0; i < quality; i++) {
      let sprite: Sprite = new Sprite(utils.TextureCache[key]);
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
      return particle.alpha === 0;
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
    shootParticle.alpha = 1;
    shootParticle.angle = 0;
    return shootParticle;
  }

  public particleBooleanDispose = (bool, ret: any) => {
    return bool ? ret : 1;
  };

  // 多粒子发射 (发射器静止)
  public shootMulite(num: number = 1): Array<Sprite> {
    const shootParticles = this.getParticle(num);
    const bootParticles: Array<Sprite> = shootParticles.map((shootParticle) => {
      shootParticle.alpha = 1;
      shootParticle.angle = 0;
      return shootParticle;
    });
    return bootParticles;
  }

  // 粒子发射
  public multeShootOnce = (
    game,
    tween,
    pointX: number,
    pointY: number,
    options,
    method?: string
  ) => {
    const {
      xDirect,
      xRandom,
      yDirect,
      yRandom,
      offsetX,
      offsetY,
      count,
      duration,
      ease,
      inout,
      angle,
      angleRandom,
      angleDirect,
      width,
      height,
    } = options;
    const particles: Array<Sprite> = this.shootMulite(count);
    for (let particle of particles) {
      particle.x = pointX + game.math.redirect() * Math.random() * width;
      particle.y = pointY + game.math.redirect() * Math.random() * height;
      tween.instance[method || 'to'](particle, duration, {
        x:
          particle.x +
          this.particleBooleanDispose(xDirect, game.math.redirect()) *
            this.particleBooleanDispose(xRandom, Math.random()) *
            offsetX,
        y:
          particle.y +
          this.particleBooleanDispose(yDirect, game.math.redirect()) *
            this.particleBooleanDispose(yRandom, Math.random()) *
            offsetY,
        angle:
          particle.angle +
          this.particleBooleanDispose(angleDirect, game.math.redirect()) *
            this.particleBooleanDispose(angleRandom, Math.random()) *
            angle,
        alpha: 0,
        ease: tween[ease][inout],
      });
    }
  };
}

export default KnEmitter;
