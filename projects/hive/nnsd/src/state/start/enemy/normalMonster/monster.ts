/*
 * @Author: kunnisser
 * @Date: 2023-11-27 16:58:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-11-27 17:34:55
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/enemy/normalMonster/monster.ts
 * @Description: ---- 普通怪物小兵 ----
 */

import Game from "ts@/kuni/lib/core";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";

class NormalMonster {
  public game: Game;
  public monsterPool: Array<KnSprite>;
  public bootMonsterPool: Array<KnSprite>;
  constructor(game: Game) {
    this.game = game;
    // 怪物池
    this.monsterPool = [];
    // 激活的怪物池
    this.bootMonsterPool = [];
  }

  generator() {
    const monster = this.game.add.sprite(
      "monsterlv1",
      "monsterlv1",
      [0.5, 0.5]
    );
    monster.visible = false;
    monster.interactive = false;
    this.monsterPool.push(monster);
    return monster;
  }

  dispatch() {
    let bootMonster: KnSprite | undefined = this.monsterPool.find(
      (monster: KnSprite) => {
        return (monster.visible = false);
      }
    );
    bootMonster = bootMonster || this.generator();
    bootMonster.visible = true;
    bootMonster.interactive = true;
    return bootMonster;
  }

  destroy(monster: KnSprite) {
    monster.visible = false;
    monster.interactive = false;
  }

  advancing() {
    this.bootMonsterPool = this.monsterPool.filter((monster: KnSprite) => {
      return (monster.visible = true);
    });
  }
}

export default NormalMonster;
