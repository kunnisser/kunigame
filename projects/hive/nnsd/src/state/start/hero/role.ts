/*
 * @Author: kunnisser
 * @Date: 2023-11-30 15:31:44
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-11-30 16:48:58
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/hero/role.ts
 * @Description: ---- 基础英雄角色类 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";

class Role extends KnGroup {
  public sprite: KnSprite | null;
  public health: number;
  public attack: number; // 攻击力
  public defense: number; // 防御力
  constructor(game: Game, parent: KnScene) {
    super(game, "baseRole", parent);
    this.initial();
  }

  initial() {
    this.sprite = null;
  }

  setRoleValue() {
    this.health = 0;
    this.defense = 0;
    this.attack = 0;
  }
}
export default Role;
