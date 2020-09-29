import KnScene from "ts@/lib/gameobjects/kn_scene";
import Game from "ts@/lib/core";
// import { GlowFilter } from 'ts@/src/filter/glow';
// import { Sprite } from "pixi.js";

const startHeaderLen = 80;
class LaserDemo extends KnScene {
  public game: Game;
  public shootType: number;
  public tween: any;
  public turnPoints: Array<any> = [];
  public sectionLen: number = startHeaderLen;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.shootType = 1;
    this.resouces = {
      'beams': './assets/images/beams.png'
    }
  }

  boot() {
  }

  create() {
    this.laser();
  }

  laser() {
    // const laserWidth = 100;
    // const turnPointNums = 4;

    let sectionLen = 90;
    for (let i = 0, l = 3; i < l; i++) {
      this.turnPoints.push(this.game.add.pointer(sectionLen * i, 100));
    }

    let texture = this.loader.resources.beams.texture;
    const strip = new PIXI.SimpleRope(texture, this.turnPoints);

    this.addChild(strip);
    strip.position.set(0, 100);
  }

  update() {
    this.turnPoints[0].x = 0;
    this.turnPoints[1].x = this.sectionLen;
    this.turnPoints[2].x = this.sectionLen + startHeaderLen;
    this.sectionLen += 10;
    if (this.sectionLen > 1400) {
      this.sectionLen = startHeaderLen;
    }
  }

  reset() {
    if (this.children.length > 1) {

      // 清除group子对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default LaserDemo;