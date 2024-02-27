/*
 * @Author: kunnisser
 * @Date: 2023-09-24 21:44:29
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-27 23:09:16
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\gui\level.ts
 * @Description: ---- 等级条 ----
 */

import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Card from "../scene";
import Game from "ts@/kuni/lib/core";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";
import { KnTween } from "ts@/kuni/lib/gameobjects/kn_tween";

class LevelBar extends KnGroup {
  game: Game;
  outBar: KnSprite;
  innerBar: KnSprite;
  maskBar: KnSprite;
  level: number;
  levelInfo: KnText;
  tween: KnTween
  constructor(game: Game, parent: Card) {
    super(game, "levelBar", parent);
    this.parent = parent;
    this.game = game;
    this.tween = game.add.tween();
    this.generator();
  }

  generator() {
    this.outBar = this.game.add.image(
      "outBar",
      "levelOutbar",
      this,
      [0, 0.5]
    );
    this.outBar.x = -this.outBar.width * 0.5;
    this.innerBar = this.game.add.image(
      "innerBar",
      "levelInnerbar",
      this,
      [0, 0.5]
    );
    this.innerBar.x = -this.innerBar.width * 0.5;
    this.maskBar = this.game.add.image(
      "maskBar",
      "levelMaskBar",
      this,
      [0.5, 0.5]
    );
    this.maskBar.x = 0;
    this.innerBar.mask = this.maskBar;
    this.level = 1;
    this.levelInfo = this.game.add.text(
      "levelInfo",
      "Lv." + this.level,
      {
        fontSize: 40,
        fontWeight: "bold",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 20
      },
      [0.5, 0.5]
    );
    this.addChild(this.levelInfo);
    this.position.set(this.game.config.half_w, this.outBar.height);
  }

  increaseExp(exp: number) {
    const outLevelExp = this.maskBar.x + exp - this.innerBar.width;
    if (outLevelExp >= 0) {
      this.maskBar.x = outLevelExp;
      this.level += 1;
      this.levelInfo.text = "Lv." + this.level;
    } else { 
      this.tween.instance.to(this.maskBar, 0.6, {
        x: this.maskBar.x + exp,
        ease: this.tween.bounce.easeOut
      })
    }
  }
}

export default LevelBar;

