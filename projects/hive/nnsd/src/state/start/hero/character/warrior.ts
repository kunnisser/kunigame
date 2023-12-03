/*
 * @Author: kunnisser
 * @Date: 2023-12-03 22:15:07
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-12-03 22:21:01
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\start\hero\character\warrior.ts
 * @Description: ---- 初始战士 ----
 */

import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import Role from '../role';
import Game from 'ts@/kuni/lib/core';

class Warrior extends Role {
  body: any;
  constructor(game: Game, parent: KnScene) {
    super(game, parent);
  }

  initial() {
    this.body = this.setRole('tex', 'role');
    this.body?.scale.set(0.2);
    this.body.animation.play('attack');
  }
}

export default Warrior;
