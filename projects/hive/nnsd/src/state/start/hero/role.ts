/*
 * @Author: kunnisser
 * @Date: 2023-11-30 15:31:44
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-12-03 22:17:57
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\start\hero\role.ts
 * @Description: ---- 基础英雄角色类 ----
 */
import Game from 'ts@/kuni/lib/core';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import * as dragonBones from '../module/dragonbones.min.js';

class Role extends KnGroup {
  public body: KnSprite | null;
  public game: Game;
  // 数值
  public health: number;
  public attack: number; // 攻击力
  public defense: number; // 防御力

  // 状态
  public isDestroyed: boolean; // 被消灭
  public isAttacking: boolean; // 正在战斗
  public isIdling: boolean; // 是否待机中
  constructor(game: Game, parent: KnScene) {
    super(game, 'baseRole', parent);
    this.game = game;
    this.initial();
    this.initialRoleValue();
    this.initialRoleStatus();
  }

  initial() {
    this.body = null;
  }

  setRole(bonesKey: string, bonesName: string) {
    const loader = this.game.loader;
    const DB: any = dragonBones.default;
    const factory: any = DB.PixiFactory.factory;
    factory.parseDragonBonesData(loader.resources[bonesKey + 'Ske'].data);
    factory.parseTextureAtlasData(
      loader.resources[bonesKey + 'Data'].data,
      PIXI.utils.TextureCache[bonesKey]
    );
    const sprite: any = factory.buildArmatureDisplay(bonesName);
    // sprite.scale.set(0.2);
    // sprite.animation.play('attack');
    // sprite.animation.timeScale = 2;
    this.addChild(sprite);
    return sprite;
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
