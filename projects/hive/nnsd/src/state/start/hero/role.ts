/*
 * @Author: kunnisser
 * @Date: 2023-11-30 15:31:44
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-12-01 11:09:12
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/hero/role.ts
 * @Description: ---- 基础英雄角色类 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";

class Role extends KnGroup {
  public sprite: KnSprite | null;

  // 数值
  public health: number;
  public attack: number; // 攻击力
  public defense: number; // 防御力

  // 状态
  public isDestroyed: boolean; // 被消灭
  public isAttacking: boolean; // 正在战斗
  public isIdling: boolean; // 是否待机中
  constructor(game: Game, parent: KnScene) {
    super(game, "baseRole", parent);
    this.initial();
    this.initialRoleValue();
    this.initialRoleStatus();
  }

  initial() {
    this.sprite = null;
  }

  initialRoleValue() {
    this.health = 100;
    this.defense = 0;
    this.attack = 0;
  }

  initialRoleStatus() {
    this.isDestroyed = false;
    this.visible = true;
    this.isAttacking = false;
    this.isIdling = true;
  }
}
export default Role;
