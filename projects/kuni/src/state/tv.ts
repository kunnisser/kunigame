/*
 * @Author: kunnisser
 * @Date: 2021-03-12 14:00:26
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-01-13 10:08:06
 * @FilePath: /kunigame/projects/kuni/src/state/tv.ts
 * @Description: ---- 电视filter ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";

class TvDemo extends KnScene {
  public game: Game;
  public shootType: number;
  public tween: any;
  public turnPoints: Array<any> = [];
  public time: number;
  tvFilter: PIXI.Filter;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.shootType = 1;
    this.resources = {
      "tv": "/projects/kuni/assets/images/tv.png"
    };
    this.time = 0;
  }

  boot() {}

  create() {
    this.createTv();
  }

  createTv() {
    const tv = this.game.add.image("", "tv", this, [0.5, 0.5]);
    tv.position.set(this.game.config.half_w, this.game.config.half_h);
    const screen: KnGraphics = this.game.add
      .graphics()
      .generateRect(0xffffff, [0, 0, 470, 370, 0], true);
    const childContainer = this.game.add.group("filter", this);
    childContainer.addChild(screen);
    screen.position.set(tv.x - 44, tv.y + 182);
    const mask = this.game.add
      .graphics()
      .generateRect(0xd10311, [0, 0, 470, 370, 20], true);
    mask.position.set(screen.x, screen.y);
    childContainer.addChild(mask);
    const fShader = `
    precision mediump float;
    varying vec2 vTextureCoord;
    uniform float time;
    void main() {
    vec2 uv = vTextureCoord;
    float col = fract(sin(uv.x * 2000. + uv.y * 10.) * time * 3000.0);
    // Output to screen
    gl_FragColor = vec4(vec3(col),1.0);
}`;
    this.tvFilter = new PIXI.Filter(void 0, fShader, { time: this.time });
    screen.filters = [this.tvFilter];
    childContainer.mask = mask;
  }

  update(delta) {
    this.time += delta;
    this.tvFilter.uniforms.time = this.time;
  }

  reset() {
    if (this.children.length > 1) {
      // 清除group子对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default TvDemo;
