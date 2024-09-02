/*
 * @Author: kunnisser
 * @Date: 2024-02-14 21:23:42
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-09-02 17:29:39
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/resource/fruit.ts
 * @Description: ---- 资源 - 水果 ----
 */

import Game from "ts@/kuni/lib/core";
import CardContent from "../content";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import CheckerCardWrap from "../../checkerboard/checkerCard";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Don from "../role/player";
import { cureEffectParticle } from "../../particle";
import KnBitMapText from "ts@/kuni/lib/gameobjects/kn_bitmap_text";
import DragonBones from "../../module/dragonbones.min";

class Fruit extends CardContent {
  game: Game;
  sprite: KnSprite;
  parent: CheckerCardWrap;
  pureVal: number;
  pureText: KnBitMapText;
  constructor(game: Game, parent: KnGroup, card: CheckerCardWrap) {
    super(game, parent, card);
    this.game = game;
    this.attribute = "resource";
    this.pureVal = 3 + Math.floor(Math.random() * 4);
    this.initial();
  }

  initial() {
    const sprite = this.game.add.image("orange", "orange", this, [0.5, 0.5]);
    this.addChild(sprite);
    this.setHealthPlus();
  }

  onClick(): void {}

  event(target: Don, self: Fruit): void {
    target.hpValue += this.pureVal;
    target.hp.text = target.hpValue + "";
    const [emitter, effect] = cureEffectParticle(
      this.game,
      this.parent.parent.tween
    );
    target.setParticleEmitter(emitter);
    effect && effect(target);
    this.playerRecoverAnimation(target);
  }

  // 定义玩家血量恢复的动作
  playerRecoverAnimation(target: Don) {
    const recoverAction = target.sprite.animation.play("recover");
    recoverAction && (recoverAction.playTimes = 1);
    target.sprite.armature.eventDispatcher.addDBEventListener(
      DragonBones.EventObject.COMPLETE,
      () => {
        target.sprite.animation.timeScale = 2;
        target.sprite.animation.play("idle");
      },
      target
    );
  }

  setHealthPlus() {
    const plusIcon = this.game.add.image(
      "healthPlus",
      "healthPlus",
      this,
      [0.5, 0.5]
    );
    plusIcon.scale.set(0.8);
    plusIcon.position.set(
      this.parent.wrap.width * 0.5 - 50,
      -this.parent.wrap.height * 0.5 + 50
    );
    this.pureText = this.game.add.bitmapText(
      "pureText",
      this.pureVal + "",
      {
        fontName: "cureFont",
        fontSize: 40
      },
      [0.5, 0.5]
    );
    this.pureText.position.set(plusIcon.x, plusIcon.y);
    this.addChild(plusIcon, this.pureText);
  }

  update(): void {}
}

export default Fruit;
