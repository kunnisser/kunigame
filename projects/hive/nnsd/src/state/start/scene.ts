/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-10-08 16:04:54
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";
import KnSprite from "/Users/qiankun/cams/kunigame/projects/kuni/lib/gameobjects/kn_sprite";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";

class Start extends KnScene {
  game: Game;
  demoTest: KnText;
  rocket: import("/Users/qiankun/cams/kunigame/projects/kuni/lib/gameobjects/kn_sprite").default;
  emitter: import("/Users/qiankun/cams/kunigame/projects/kuni/lib/gameobjects/kn_emitter").default;
  delta: number;
  tween: import("/Users/qiankun/cams/kunigame/projects/kuni/lib/gameobjects/kn_tween").KnTween;
  bullets: Array<KnSprite>;
  bulletsContainer: KnGroup;
  fired: boolean;
  base: KnSprite;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      attack: "assets/images/attack.png",
      logo: "assets/images/logo.png",
      avator_01: "assets/images/avator_01.png",
      loadingrun: "assets/atlas/loadingrun.json",
      icon: "assets/atlas/icon.json",
      rocket: "assets/images/rocket.png",
      gas: "assets/images/gas.png"
    };
  }

  boot() {}

  create() {
    const rocket = this.game.add.image("rocketTemp", "rocket", this);
    rocket.position.set(this.game.config.half_w, this.game.config.half_h);
    rocket.anchor.set(0.5);
    this.rocket = rocket;
    this.rocket.pivot.y = 250;
    this.bulletsContainer = this.game.add.group("bullets", this);
    this.bullets = [];
    for (let i = 0, l = 1; i < l; i++) {
      this.bullets.push(this.game.add.sprite("", "attack", [0.5, 0.5]));
    }
    this.base = this.game.add.sprite("", "rocket", [0.5, 0.5]);
    this.base.position.set(this.rocket.x, this.rocket.y);
    this.base.pivot.y = 250;
    this.base.angle = -180;
    this.bulletsContainer.addChild(...this.bullets);
    this.addChild(this.base);
    this.bulletsContainer.position.set(this.rocket.x, this.rocket.y);
    this.delta = 30;
    this.bullets[0].pivot.y = 250;
    this.interactive = true;
    this.fired = false;
    this.on("pointerdown", () => {
      this.bullets[0].visible = true;
      this.bullets[0].angle = this.base.angle;
      this.fired = true;
    });
  }

  update() {
    this.rocket.angle += 0.5;
    this.base.angle += 0.5;
    if (this.rocket.angle - this.bullets[0].angle > 0 && this.fired) {
      this.bullets[0].angle += 4;
    } else {
      this.bullets[0].visible = false;
    }
    this.delta -= 1;
    if (this.delta < 0) {
      this.delta = 30;
    }
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Start;
