/*
 * @Author: kunnisser
 * @Date: 2024-09-03 15:43:07
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-09-03 17:37:38
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/progress/player.ts
 * @Description: ---- 能量槽 ----
 */
import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Card from "../scene";
import { rem } from "ts@/kuni/lib/utils/common";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
class PlayProgress extends KnGroup {
  game: Game;
  parent: Card;
  progressBoot: Array<KnSprite>; // 能量进度池
  side: number;
  stepVal: number; // 能量值
  level: number;
  constructor(game: Game, parent, level: number, side: number) {
    super(game, "playProgress", parent);
    this.game = game;
    this.parent = parent;
    this.progressBoot = [];
    this.side = side;
    this.stepVal = 0;
    this.level = level;
    this.initial(level);
  }

  initial(level: number) {
    for (let i = 0; i < level; i++) {
      const outBar = this.game.add.sprite(
        "playProgressWrap" + i,
        "progressBarOut",
        [0.5, 0.5]
      );
      const innerBar = this.game.add.sprite(
        "playProgress" + i,
        "progressBar",
        [0.5, 0.5]
      );
      const spaceY = i * (outBar.width + rem(10));
      outBar.y += spaceY;
      outBar.angle = 90;
      innerBar.y += spaceY;
      innerBar.angle = 90;
      innerBar.visible = false;
      this.addChild(outBar);
      this.progressBoot.push(innerBar);
    }
    this.addChild(...this.progressBoot);
    this.position.set(
      this.game.config.half_w +
        (this.parent.layout.width * 0.5 + rem(20)) * this.side,
      this.game.config.half_h - this.height * 0.5 + rem(50)
    );
  }

  step() {
    this.stepVal += 1;
    this.stepVal > this.level && (this.stepVal = 0); // todo 能量释放
    this.progressBoot.map((bar: KnSprite, index: number) => {
      if (index < this.stepVal) {
        bar.visible = true;
      } else {
        bar.visible = false;
      }
      return bar;
    });
  }
}

export default PlayProgress;
