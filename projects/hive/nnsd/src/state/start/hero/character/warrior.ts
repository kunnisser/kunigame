/*
 * @Author: kunnisser
 * @Date: 2023-12-03 22:15:07
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-12-04 17:05:20
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/hero/character/warrior.ts
 * @Description: ---- 初始战士 ----
 */

import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Role from "../role";
import Game from "ts@/kuni/lib/core";
import { KnTween } from "ts@/kuni/lib/gameobjects/kn_tween";

class Warrior extends Role {
  body: any;
  tween: KnTween;
  constructor(game: Game, parent: KnScene) {
    super(game, parent);
    this.setCharacter();
    this.setWarriorBar();
  }

  setCharacter() {
    this.tween = this.game.add.tween();
    this.body = this.setRole("tex", "role");
    this.body?.scale.set(0.2);
    this.body.animation.play("attack");
    this.body.animation.timeScale = 2;
  }

  // 设置战士角色数值状态条
  setWarriorBar() {
    this.setHealthBar();
    this.generatorHP();
  }

  generatorHP() {
    this.hpBar = this.game.add.sprite("hpInnerBar", "hpInnerBar", [0, 0.5]);
    this.hpOutBar = this.game.add.sprite("hpOutBar", "hpOutBar", [0, 0.5]);
    this.hpGroup.addChild(this.hpOutBar, this.hpBar);
    this.hpGroup.y = -this.height * 0.5 - this.hpGroup.height;
    this.hpGroup.x = -this.hpGroup.width * 0.5;
    this.hpBar.x = (this.hpOutBar.width - this.hpBar.width) * 0.5;
  }

  underAttack(damage: number) {
    this.deductHp(damage || 0);
  }

  deductHp(damage: number) {
    if (this.hpBar?.width && this.hpBar?.width > damage) {
      this.tween.instance.to(this.hpBar, 0.8, {
        width: this.hpBar?.width - damage,
        ease: this.tween["back"]["easeOut"]
      });
    }
  }
}

export default Warrior;
