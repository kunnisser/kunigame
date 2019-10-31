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
      'vertex': './assets/shader/vertex/default.vert',
    }
  }

  boot() {
    this.tween = this.game.add.tween();
    this.addBackground();
    this.addStaff();
    this.dev();
    this.game.ticker.start();
  }

  dev() {
    if (this.game.gui.__controllers[0] && this.game.gui.__controllers[0].property === '缓动模式') {
      return;
    }

    const dat = {
      '缓动模式': '均匀'
    },
      datArr = ['均匀'];
    this.dat = this.game.gui.add(dat, '缓动模式', datArr);
    this.dat.onChange((v: string) => {
      this.shootType = datArr.indexOf(v) + 1;
      this.toggleEnv(this.shootType);
    });
  }

  toggleEnv(type: number) {
    this.filters = [];
    switch (type) {
      default:
        break;
    }
  }

  addBackground() {
    const bg = this.game.add.image('wsjBg', this);
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
  }

  // 添加法杖武器
  addStaff() {
    const staff = this.game.add.image('staff', this, [0.5, 0.5]);
    staff.scale.set(0.2);
    staff.position.set(this.game.config.half_w, this.game.config.half_h);
    staff.filters = [new GlowFilter(this.loader)];
    staff.angle = 0;
    this.easeTween(staff);
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
}

export default TweenDemo;