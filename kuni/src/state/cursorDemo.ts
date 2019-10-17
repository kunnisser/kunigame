import KnScene from "ts@/lib/gameobjects/kn_scene";
import Game from "ts@/lib/core";
import KnEmitter from "ts@/lib/gameobjects/kn_emitter";

class CursorDemo extends KnScene{
  public game: Game;
  public emitter: KnEmitter;
	constructor(game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.resouces = {
      'rankBtn': './assets/images/rankBtn.png',
      'settingBtn': './assets/images/settingBtn.png',
      'star': './assets/images/star.png',
      'bg002': './assets/images/bg002.jpg'
    }
  }

  boot() {
    this.addBackground();
    this.createButtonGroup();
    this.generateStar();
  }

  addBackground() {
    const bg = this.game.add.image('bg002', this);
    bg.interactive = !0;
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
    bg.on('pointermove', (e) => {
      const pointX = e.data.global.x / this.game.world.scale.x,
      pointY = e.data.global.y / this.game.world.scale.y;
      this.emitter.position.set(pointX, pointY);
    });
  }

  createButtonGroup() {
    const btn1 = this.game.add.image('rankBtn', this, [0.5, 0.5]);
    const btn2 = this.game.add.image('settingBtn', this, [0.5, 0.5]);
    [btn1, btn2].forEach((btn, index) => {
      btn.width = 100; btn.height = 100;
      btn.position.set(this.game.config.half_w + (index - 0.5) * btn.width, this.game.config.half_h);
      btn.interactive = true;
      btn.on('pointerdown', () => {console.log(index)});
    })
  }

  	// 粒子加载
	generateStar() {
    this.emitter = this.game.add.emitter(this.game, 100, 'star');
    this.addChild(this.emitter);
  }
  
  update (time){
    if (this.emitter) {
      this.emitter.throtting -= time;
      if (this.emitter.throtting < 0) {
        const tween: any = this.game.add.tweenline();
        const particle = this.emitter.shoot();
        tween.to(particle, 1.6, {
          x: particle.x + Math.random() * 100,
          y: particle.y - 200,
          angle: 100 + Math.random() * 300,
          alpha: 0,
          ease: tween.linear.easeNone
        });
        this.emitter.throtting = KnEmitter.throtting;
      }
    }
  }
}

export default CursorDemo;