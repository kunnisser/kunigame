/*
 * @Author: kunnisser
 * @Date: 2023-11-27 16:52:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-11-29 16:39:37
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/enemy/index.ts
 * @Description: ---- 敌对角色的容器 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import NormalMonster from "./normalMonster/monster";

class TdEnemy extends KnGroup {
  game: Game;
  monsterPool: Array<NormalMonster>; // 默认怪物池
  activeMonsterPool: Array<NormalMonster>; // 激活的怪物池
  constructor(game: Game, parent: KnScene) {
    super(game, "tdEnemy", parent);
    this.game = game;
    this.initial();
  }

  initial() {
    this.monsterPool = [];
    this.activeMonsterPool = [];
  }

  generator() {
    const monster = new NormalMonster(this.game, this);
    this.monsterPool.push(monster);
    return monster;
  }

  dispatch(target: any) {
    let bootMonster: NormalMonster | undefined = this.monsterPool.find(
      (monster: NormalMonster) => {
        return monster.visible === false;
      }
    );
    bootMonster = bootMonster || this.generator();
    bootMonster.visible = true;
    this.appearPosition(bootMonster);
    bootMonster.setAttackTarget(target);
    this.activeMonsterPool.push(bootMonster);
    return bootMonster;
  }

  // 出场定位
  appearPosition(monster: NormalMonster) {
    monster.x =
      monster.width * 0.5 +
      Math.random() * (this.game.config.width - monster.width);
    monster.y = -monster.height;
  }

  // 怪物移动及边界回收
  advancing() {
    this.activeMonsterPool.forEach((monster: NormalMonster, index: number) => {
      if (monster.moving) {
        monster.isAttachTarget();
        monster.x += monster.vx;
        monster.y += monster.vy;
      }
      // if (monster.y > this.game.config.height) {
      //   monster.visible = false;
      //   this.activeMonsterPool.splice(index, 1);
      // } else {
      //   monster.y += monster.speed;
      // }
    });
  }
}

export default TdEnemy;
