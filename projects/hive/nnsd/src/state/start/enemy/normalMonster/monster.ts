/*
 * @Author: kunnisser
 * @Date: 2023-11-27 16:58:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-11-29 17:05:54
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
  public step: number; // 初始移动总步数
  public health: number; // 血量
  public attack: number; // 攻击力
  // -- 状态
  public moving: boolean; // 是否移动
  public attacking: boolean; // 是否攻击
  public injured: boolean; // 是否受伤
  public killed: boolean; // 是否被干掉

  // -- 距离环境
  public distanceTargetX: number; // 距离目标X距离差
  public distanceTargetY: number; // 距离目标Y距离差
  public vx: number; // 计算x每一步的距离(x速率)
  public vy: number; // 计算y每一步的距离（y速率）

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
    this.sprite.scale.set(0.5);
    this.word.y = -this.sprite.height * 0.5;
    this.target = null;
    this.addChild(this.word, this.sprite);
  }

  // 初始化角色数值
  initialValues() {
    this.step = 200;
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
    this.moving = true;
    this.target = target;
    this.distanceTargetX = target.x - this.x;
    this.distanceTargetY = target.y - this.y;
    this.vx = this.distanceTargetX / this.step;
    this.vy = this.distanceTargetY / this.step;
  }

  // 怪物已抵达目标
  isAttachTarget() {
    const absDistanceX: number = Math.abs(this.target.x - this.x);
    const absDistanceY: number = Math.abs(this.target.y - this.y);
    if (absDistanceX < this.target.width && absDistanceY < this.target.height) {
      this.moving = false;
    }
  }

  // 怪物被摧毁
  remove() {
    this.target = null;
    this.killed = true;
    this.visible = false;
  }
}

export default NormalMonster;
