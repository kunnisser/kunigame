import KnScene from "ts@/lib/gameobjects/kn_scene";
import Game from "ts@/lib/core";
import KnEmitter from "ts@/lib/gameobjects/kn_emitter";
import { Sprite } from "pixi.js";

class CursorDemo extends KnScene {
  public game: Game;
  public emitter: KnEmitter;
  public shootType: number;
  public weapon: Sprite;
  public mark: Sprite;
  public tween: any;
  constructor(game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.shootType = 1;
    this.resouces = {
      'star': './assets/images/star.png',
      'weapon': './assets/images/titleWeapon_01.png'
    }
    this.tween = this.game.add.tween();
  }

  boot() {
    this.addBackground();
    this.generateStar();
    this.addWeapon();
    this.addMark();
    this.dev();
  }

  dev() {
    if (this.game.gui.__controllers[0] && this.game.gui.__controllers[0].property === '光标交互效果') {
      return;
    }

    const dat = {
      '光标交互效果': '移动粒子'
    },
      datArr = ['移动粒子', '点击粒子', '范围粒子', '点击mark'];
    this.dat = this.game.gui.add(dat, '光标交互效果', datArr);
    this.dat.onChange((v: string) => {
      this.shootType = datArr.indexOf(v) + 1;
      this.emitter.shooting = this.shootType === 3 ? !0 : !1;
    });
  }

  addBackground() {
    const bg = this.game.add.image('bg002', this);
    bg.interactive = !0;
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
    bg.on('pointermove', (e) => {
      if (this.shootType === 1) {
        const pointX = e.data.global.x / this.game.world.scale.x,
          pointY = e.data.global.y / this.game.world.scale.y;
        this.emitter.position.set(0, 0);
        this.singleShoot(pointX, pointY);
      }
    });
    bg.on('pointerdown', (e) => {
      let pointX = e.data.global.x / this.game.world.scale.x,
        pointY = e.data.global.y / this.game.world.scale.y;
      if (this.shootType === 2) {
        this.emitter.position.set(0, 0);
        this.multeShootOnce(pointX, pointY);
      } else if (this.shootType === 4) {
        this.mark.visible = !0;
        this.mark.position.set(pointX, pointY);
        this.mark.alpha = 1;
        this.tween.instance.killTweensOf(this.mark);
        this.tween.instance.to(this.mark, 0.25, {
          y: this.mark.y + 10,
          alpha: 0.2,
          ease: this.tween.linear.easeNone,
          repeat: 2,
          yoyo: true,
          onComplete: () => {
            this.mark.visible = !1;
          }
        });
      }
    });
  }

  addMark() {
    this.mark = this.game.add.image('mark', this, [0.5, 0.5]);
    this.mark.visible = !1;
    this.mark.width = 32 / this.game.world.scale.x;
    this.mark.height = 32 / this.game.world.scale.x;
  }

  addWeapon() {
    this.weapon = this.game.add.image('weapon', this, [0.5, 0.5]);
    this.weapon.position.set(this.game.config.half_w, this.game.config.half_h);
    this.weapon.scale.set(0.3);
    this.weapon.interactive = !0;
    this.weapon.buttonMode = !0;
  }

  // 粒子加载
  generateStar() {
    this.emitter = this.game.add.emitter(this.game, 100, 'star');
    this.addChild(this.emitter);
  }

  // 单粒子连续发射
  singleShoot(pointX: number, pointY: number) {
    this.emitter.throtting -= 1;
    if (this.emitter.throtting < 0) {
      const particle = this.emitter.shoot();
      particle.x = pointX;
      particle.y = pointY;
      this.tween.instance.to(particle, 1.6, {
        x: pointX + this.game.math.rdirect() * Math.random() * 200,
        y: pointY - Math.random() * 200,
        angle: 100 + this.game.math.rdirect() * Math.random() * 300,
        alpha: 0,
        ease: this.tween.linear.easeNone
      });
      this.emitter.throtting = KnEmitter.throtting;
    }
  }

  // 范围连续发射
  rangeShoot() {
    this.emitter.throtting -= 2;
    if (this.emitter.throtting < 0) {
      const particle = this.emitter.shoot();
      particle.x = this.weapon.x + this.game.math.rdirect() * ~~(Math.random() * 10) * this.weapon.width ;
      particle.y = this.weapon.y;
      this.tween.instance.to(particle, 1.6, {
        y: particle.y + this.game.math.rdirect() * Math.random() * this.weapon.height,
        angle: 100 + this.game.math.rdirect() * Math.random() * 300,
        alpha: 0,
        ease: this.tween.linear.easeNone
      });
      this.emitter.throtting = KnEmitter.throtting;
    }
  }

  update() {
    if (this.emitter && this.emitter.shooting) {
      this.rangeShoot();
    }
  }

  // 多个粒子单次发射
  multeShootOnce(pointX: number, pointY: number) {
    const particles = this.emitter.shootMulite(4);
    for (let particle of particles) {
      particle.x = pointX;
      particle.y = pointY;
      this.tween.instance.to(particle, 0.5, {
        x: particle.x + this.game.math.rdirect() * Math.random() * 10,
        y: particle.y - Math.random() * 20 - 10,
        angle: 100 + this.game.math.rdirect() * Math.random() * 300,
        alpha: 0,
        ease: this.tween.linear.easeNone
      });
    }
  }
}

export default CursorDemo;