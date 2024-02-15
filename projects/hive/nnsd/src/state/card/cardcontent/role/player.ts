/*
 * @Author: kunnisser
 * @Date: 2024-02-02 15:41:11
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-15 12:11:20
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/role/player.ts
 * @Description: ---- 玩家角色1 ----
 */
import CheckerCardWrap from '../../checkerboard/checkerCard';
import Game from 'ts@/kuni/lib/core';
import CardContent from '../content';
import { Point } from 'pixi.js';
import dragonBones from '../../module/dragonbones.min';
import Card from '../../scene';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
class Don extends CardContent {
  game: Game;
  sprite: any;
  parent: CheckerCardWrap;

  // 角色是否存活
  isAlive: Boolean;

  // 角色默认的初始索引坐标
  currentGlobal: Point;

  // 角色面向的数值
  faceDirect: { left: number; right: number };
  constructor(game: Game, parent: KnGroup, card: CheckerCardWrap) {
    super(game, parent, card);
    this.game = game;
    this.attribute = 'player';
    this.race = 'human';
    this.faceDirect = {
      left: -1,
      right: 1,
    };
    this.isAlive = true;
    this.initial();
  }

  initial() {
    const role = this.setRole('tex', 'role');
    role.scale.set(0.5);
    role.y += role.getBounds().height * 0.25;
    role.animation.timeScale = 2;
    role.animation.play('idle');
    this.sprite = role;
    this.currentGlobal = new Point(0, 0);
    this.setHealth(10);
    this.setAttack(5);
  }

  onClick() {}

  onMove(direct?: string) {
    // 设定方向
    // 设定为左右移动方向，则更改角色面向
    direct &&
      this.faceDirect[direct] &&
      (this.sprite.scale.x =
        Math.abs(this.sprite.scale.x) * this.faceDirect[direct]);
    this.sprite.animation.timeScale = 4;
    this.sprite.animation.play('attack').playTimes = 1;
    this.sprite.armature.eventDispatcher.addDBEventListener(
      dragonBones.EventObject.COMPLETE,
      () => {
        this.sprite.animation.timeScale = 2;
        this.sprite.animation.play('idle');
      }
    );
  }

  defeat(target: CheckerCardWrap): void {
    const scene = this.game.currentScene as Card;

    target.content.event(this, scene);

    // 更新计分栏数值
    scene.scoreBar.updateScore(scene.scoreBar.score);
  }

  checkPlayerHealth() {
    if (this.hpValue <= 0) {
      this.isAlive = false;
    } else {
      this.isAlive = true;
    }
  }
}

export default Don;
