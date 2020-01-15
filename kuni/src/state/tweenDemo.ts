import KnScene from "ts@/lib/gameobjects/kn_scene";
import Game from "ts@/lib/core";
import { GlowFilter } from 'ts@/src/filter/glow';
import { Sprite } from "pixi.js";

class TweenDemo extends KnScene {
  public game: Game;
  public shootType: number;
  public tween: any;
  constructor(game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.shootType = 1;
    this.resouces = {
      'wsjBg': './assets/images/wsj_bg.png',
      'staff': './assets/images/titleWeapon_02.png',
      'glow': './assets/shader/frag/glow.frag',
      'pumpkin': './assets/images/pumpkin.png',
      'cannikin': './assets/images/cannikin.png',
      'start': './assets/images/start.png'
    }
  }

  boot() {
    this.tween = this.game.add.tween();
    this.addBackground();
    this.addStaff();
    this.dev();
  }

  dev() {
    if (this.game.gui.__controllers[0] && this.game.gui.__controllers[0].property === '缓动模式') {
      return;
    }

    const dat = {
      '缓动模式': '均匀'
    },
      datArr = ['均匀', '正弦', '定时弹动', '摇摆'];
    this.dat = this.game.gui.add(dat, '缓动模式', datArr);
    this.dat.onChange((v: string) => {
      this.shootType = datArr.indexOf(v) + 1;
      this.toggleEnv(this.shootType);
    });
  }

  toggleEnv(type: number) {
    this.reset();
    switch (type) {
      case 1:
        this.addStaff();
        break;
      case 2:
        this.addPumpkin();
        break;
      case 3:
        this.addCannikin();
        break;
      case 4:
        this.addStart();
        break;
      default:
        this.addStaff();
        break;
    }
  }

  addBackground() {
    const bg = this.game.add.image('wsjBg', this);
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
  }

  // 居中构建添加
  addSprite(spritekey: string) {
    const demo = this.game.add.image(spritekey, this, [0.5, 0.5]);
    demo.position.set(this.game.config.half_w, this.game.config.half_h);
    return demo;
  }

  // 添加法杖武器
  addStaff() {
    const staff = this.addSprite('staff');
    staff.scale.set(0.2);
    staff.filters = [new GlowFilter(this.loader)];
    staff.angle = 0;
    this.easeTween(staff);
  }

  // 添加南瓜
  addPumpkin() {
    const pumpkin = this.addSprite('pumpkin');
    pumpkin.filters = [new GlowFilter(this.loader, 0xffffff)];
    pumpkin.angle = -2;
    this.sineTween(pumpkin);
  }

  // 增加木桶
  addCannikin() {
    const cannikin = this.addSprite('cannikin');
    this.bounceTween(cannikin);
    this.fallingTween(cannikin);
  }

  // 增加开始按钮
  addStart() {
    const start = this.game.add.button('start', 'cannikin', this, [0.5, 0.5]);
    start.position.set(this.game.config.half_w, this.game.config.half_h);
    start.scale.set(0.36);
    this.angleTween(start);
  }

  easeTween(staff: Sprite) {
    const tween: any = this.game.add.tween();
    tween.instance.to(staff, 1, {
      angle: 96,
      ease: tween.linear.easeNone,
      repeat: -1,
      yoyo: true
    });
  }

  fallingTween(sprite: Sprite) {
    const tween: any = this.game.add.tween();
    tween.instance.to(sprite, 1, {
      y: sprite.y + 100,
      ease: tween.bounce.easeOut
    });
  }

  sineTween(pumpkin: Sprite) {
    const tween: any = this.game.add.tween();
    tween.instance.to(pumpkin.scale, 0.5, {
      y: 0.95,
      ease: tween.sine.easeInOut,
      repeat: -1,
      yoyo: true
    });
    tween.instance.to(pumpkin, 1, {
      angle: Math.abs(pumpkin.angle),
      ease: tween.sine.easeInOut,
      repeat: -1,
      yoyo: true
    });
  }

  bounceTween(cannikin: Sprite) {
    const tween: any = this.game.add.tween();
    const test = tween.instance.to(cannikin.scale, 0.16, {
      delay: 1.2,
      y: 0.95,
      x: 1.15,
      ease: tween.cubic.easeInOut,
      repeat: 3,
      yoyo: true,
      onComplete: () => {
        test.restart(true);
      }
    })
  }

  angleTween(start: Sprite) {
    const tween: any = this.game.add.tween();
    const angle = -8;
    start.angle = 0;
    const angleTween = tween.instance.to(start, 0.16, 
    {
      delay: 1.2,
      angle: Math.abs(angle),
      ease: tween.sine.easeInOut,
      startAt: {
        angle: angle
      },
      repeat: 2,
      yoyo: true,
      onComplete: () => {
        tween.instance.to(start, 0.16, {
          angle: 0,
          ease: tween.sine.easeInOut,
          onComplete: () => {
            angleTween.restart(true);
          }
        });
      }
    });
  }

  reset() {
    if (this.children.length > 1) {

      // 清除group子对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default TweenDemo;