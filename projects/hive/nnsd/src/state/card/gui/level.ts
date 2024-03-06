/*
 * @Author: kunnisser
 * @Date: 2023-09-24 21:44:29
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-06 23:28:25
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\gui\level.ts
 * @Description: ---- 等级条 ----
 */

import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Card from "../scene";
import Game from "ts@/kuni/lib/core";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";
import { KnTween } from "ts@/kuni/lib/gameobjects/kn_tween";
import KnEmitter from "ts@/kuni/lib/gameobjects/kn_emitter";
import CheckerCardWrap from "../checkerboard/checkerCard";
import { rem } from "ts@/kuni/lib/utils/common";

class LevelBar extends KnGroup {
  game: Game;
  outBar: KnSprite;
  innerBar: KnSprite;
  maskBar: KnSprite;
  level: number;
  levelInfo: KnText;
  tween: KnTween;
  expEmitter: KnEmitter;
  levelEmitter: KnEmitter;
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
    this.expEmitter = this.game.add.emitter(this.game, 10, "exp");
    this.expEmitter.position.set(this.position.x, this.position.y);
    this.levelEmitter = this.game.add.emitter(this.game, 30, "star");
    this.parent.addChild(this.expEmitter);
    this.addChildAt(this.levelEmitter, 0);
  }

    // 获取经验的效果
    shootExp(target) {
      this.expEmitter.multiShootOnce(
        this.game,
        this.tween,
        0, // 粒子发射器的坐标
        0,
        {
          duration: 0.35,
          count: 5,
          targetX: target.x - this.position.x, // 粒子发射的目标坐标
          targetY: target.y - this.position.y,
          offsetX: target.width * 0.4, // 粒子发射的目标范围
          offsetY: -target.height * 0.3,
          xRandom: true,
          yRandom: true,
          xDirect: true,
          yDirect: false,
          ease: 'back',
          inout: 'easeIn',
          angle: 360,
          angleRandom: true,
          angleDirect: true,
          width: 0, // 粒子发生器的尺寸范围
          height: 0,
          delay: true
        },
        'from',
        1,
        (particle: any) => { 
          particle.visible = false;
          particle.alpha = 0;
        }
      );
    }
  
  // 经验增加
  increaseExp(exp: number, target: CheckerCardWrap) {
    const outLevelExp = this.maskBar.x + exp - this.innerBar.width;
    exp > 0 && this.shootExp(target);
    if (outLevelExp >= 0) {
      this.maskBar.x = outLevelExp;
      this.level += 1;
      this.levelInfo.text = "Lv." + this.level;
      this.levelUpEffect();
    } else { 
      this.tween.instance.to(this.maskBar, 0.6, {
        x: this.maskBar.x + exp,
        ease: this.tween.bounce.easeOut
      })
    }
  }

  // 升级特效
  levelUpEffect() { 
    this.tween.instance.to(this.maskBar, 0.1, {
      alpha: 0.55,
      ease: this.tween.cubic.easeOut,
      yoyo: true,
      repeat: 3
    });
    this.levelEmitter.multiShootOnce(
      this.game,
      this.tween,
      0, // 粒子发射器的坐标
      0,
      {
        duration: 1,
        count: 20,
        offsetX: rem(30), // 粒子发射的目标范围
        offsetY: this.outBar.height * 2,
        xRandom: true,
        yRandom: true,
        xDirect: true,
        yDirect: true,
        ease: 'cubic',
        inout: 'easeOut',
        angle: 360,
        angleRandom: true,
        angleDirect: true,
        width: this.outBar.width * 0.5, // 粒子发生器的尺寸范围
        height: 0,
        delay: false
      },
      'to',
      void 0,
      (particle: any) => { 
        particle.visible = false;
        particle.alpha = 0;
      }
    );
  }
}

export default LevelBar;

