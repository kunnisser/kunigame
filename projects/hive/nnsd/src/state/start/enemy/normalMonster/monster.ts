/*
 * @Author: kunnisser
 * @Date: 2023-11-27 16:58:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-11-28 15:37:27
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/enemy/normalMonster/monster.ts
 * @Description: ---- 普通怪物小兵 ----
 */

import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import TdEnemy from "..";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";

class NormalMonster extends KnGroup {
  public game: Game;
  // -- 怪物角色元素
  public sprite: KnSprite; // 纹理精灵
  public word: KnText; // 中文词名
  public target: any; // 怪物的目标
  // -- 数值
  public speed: number; // 前进速度
  public health: number; // 血量
  public attack: number; // 攻击力
  // -- 状态
  public moving: boolean; // 是否移动
  public attacking: boolean; // 是否攻击
  public injured: boolean; // 是否受伤
  public killed: boolean; // 是否被干掉
  constructor(game: Game, parent: TdEnemy) {
    super(game, "normalMonsterEntity", parent);
    this.game = game;
    this.initialRole();
    this.initialValues();
    this.initialStatus();
    this.parent.addChild(this);
  }

  // 初始化角色对象元素
  initialRole() {
    this.word = this.game.add.text("test", "测试", {}, [0.5, 1]);
    this.word.style.fontSize = 100;
    this.word.style.fill = "#ff6161";
    this.sprite = this.game.add.sprite("monsterlv1", "monsterlv1", [0.5, 0.5]);
    this.word.y = -this.sprite.height * 0.5;
    this.target = null;
    this.addChild(this.word, this.sprite);
  }

  // 初始化角色数值
  initialValues() {
    this.speed = 1;
    this.health = 100;
    this.attack = 10;
  }

  // 初始化角色状态
  initialStatus() {
    this.visible = false;
    this.moving = false;
    this.attacking = false;
    this.injured = false;
    this.killed = false;
  }

  // 设置怪物角色目标
  setAttackTarget(target: any) {
    this.target = target;
  }

  // 怪物弱点
}

export default NormalMonster;
