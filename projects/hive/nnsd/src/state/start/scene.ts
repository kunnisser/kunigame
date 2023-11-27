/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-11-27 14:48:59
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import { KnTween } from "ts@/kuni/lib/gameobjects/kn_tween";

class Start extends KnScene {
  game: Game;
  demoTest: KnText;
  rocket: KnSprite;
  delta: number;
  tween: KnTween;
  bullets: Array<KnSprite>;
  bulletsContainer: KnGroup;
  fired: boolean;
  base: KnSprite;
  monsterGroup: KnGroup;
  monster: KnSprite;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      attack: "assets/images/attack.png",
      logo: "assets/images/logo.png",
      monsterlv1: "assets/images/monster01.png",
      gas: "assets/images/gas.png"
    };
  }

  boot() {}

  create() {
    this.monsterGroup = this.game.add.group("monsterGroup", this);
    this.monster = this.game.add.sprite("monsterlv1", "monsterlv1", [0.5, 0.5]);
    this.monsterGroup.addChild(this.monster);
    this.monster.position.set(300, 300);
  }

  update() {}

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Start;
