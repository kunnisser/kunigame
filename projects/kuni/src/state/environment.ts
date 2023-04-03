import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnEmitter from "ts@/kuni/lib/gameobjects/kn_emitter";
import { GodrayFilter } from "../filter/godray";

class Environment extends KnScene {
  public game: Game;
  public emitter: any;
  public shootType: number;
  public tween: any;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      "rain": "/projects/kuni/assets/images/rain.png",
      "snow": "/projects/kuni/assets/images/snow.png",
      "envBg": "/projects/kuni/assets/images/env_bg.png",
      "perlin": "/projects/kuni/assets/shader/frag/perlin.frag",
      "godray": "/projects/kuni/assets/shader/frag/godray.frag"
    };
  }

  boot() {
    this.dev();
  }

  create() {
    this.shootType = 1;
    this.filters = [];
    this.tween = this.game.add.tween();
    this.emitter;
    this.addBackground();
    this.generateRains();
  }

  dev() {
    if (
      this.game.gui.__controllers[0] &&
      this.game.gui.__controllers[0].property === "环境效果"
    ) {
      return;
    }

    const dat = {
        "环境效果": "下雨"
      },
      datArr = ["下雨", "下雪", "阳光"];
    this.dat = this.game.gui.add(dat, "环境效果", datArr);
    this.dat.onChange((v: string) => {
      this.shootType = datArr.indexOf(v) + 1;
      this.toggleEnv(this.shootType);
    });
  }

  toggleEnv(type: number) {
    this.emitter && this.emitter.destroy();
    this.emitter = null;
    this.filters = [];
    switch (type) {
      case 1:
        this.generateRains();
        break;
      case 2:
        this.generateSnows();
        break;
      case 3:
        this.addFilter();
        break;
      default:
        this.generateRains();
        break;
    }
  }

  addFilter() {
    this.filters = [new GodrayFilter(this.loader)];
  }

  addBackground() {
    const bg = this.game.add.image("", "envBg", this);
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
  }

  // 粒子加载
  generateRains() {
    this.emitter = this.game.add.emitter(this.game, 200, "rain");
    this.emitter.shooting = !0;
    this.addChild(this.emitter);
    console.log(this.children);
  }

  generateSnows() {
    this.emitter = this.game.add.emitter(this.game, 200, "snow");
    this.emitter.shooting = !0;
    this.addChild(this.emitter);
  }

  // 范围连续发射
  rangeShoot() {
    this.emitter.throtting -= 2;
    if (this.emitter.throtting < 0) {
      const particle = this.emitter.shoot();
      particle.x = Math.random() * this.game.config.width;
      particle.y = 0;
      this.tween.instance.to(particle, 1.6, {
        x: particle.x + 100,
        y: this.game.config.height,
        alpha: 0,
        ease: this.tween.linear.easeNone
      });
      this.emitter.throtting = KnEmitter.throtting;
    }
  }

  rangeShoot_snow() {
    this.emitter.throtting -= 2;
    if (this.emitter.throtting < 0) {
      const particle = this.emitter.shoot();
      particle.x = Math.random() * this.game.config.width;
      particle.y = 0;
      this.tween.instance.to(particle, 2.4, {
        x: particle.x + this.game.math.redirect() * 100,
        y: this.game.config.height,
        angle: this.game.math.redirect() * 360,
        alpha: 0,
        ease: this.tween.linear.easeNone
      });
      this.emitter.throtting = KnEmitter.throtting;
    }
  }

  update() {
    if (this.emitter && this.emitter.shooting) {
      if (this.shootType === 1) {
        this.rangeShoot();
      } else {
        this.rangeShoot_snow();
      }
    }
  }
}

export default Environment;
