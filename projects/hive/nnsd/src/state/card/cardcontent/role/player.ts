/*
 * @Author: kunnisser
 * @Date: 2024-02-02 15:41:11
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-06 23:32:47
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\cardcontent\role\player.ts
 * @Description: ---- 玩家角色1 ----
 */
import CheckerCardWrap from '../../checkerboard/checkerCard';
import Game from 'ts@/kuni/lib/core';
import CardContent from '../content';
import { Point, Texture } from 'pixi.js';
import Card from '../../scene';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import { rem } from 'ts@/kuni/lib/utils/common';
import DragonBones from '../../module/dragonbones.min';
import dragonBones from '../../module/dragonBones';
class Don extends CardContent {
  game: Game;
  parent: CheckerCardWrap;
  sprite: dragonBones.PixiArmatureDisplay;
  // 角色是否存活
  isAlive: Boolean;

  // 角色默认的初始索引坐标
  currentGlobal: Point;

  // 角色技能
  skills: {
    attack: any;
  };

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
    this.initialParticle();
    this.initialSkills();
  }

  initial() {
    this.sprite = this.setRole(
      'tex',
      'role'
    ) as dragonBones.PixiArmatureDisplay;
    this.sprite.scale.set(rem(0.35));
    this.sprite.y += this.sprite.getBounds().height * 0.25;
    this.sprite.animation.timeScale = 2;
    this.sprite.animation.play('idle');
    this.currentGlobal = new Point(0, 0);
    this.setHealth(20);
    this.setAttack(7);
  }

  // 定义角色的技能动画
  initialSkills() {
    const frames: Array<Texture> = [];
    for (let i = 0, l = 5; i < l; i++) {
      const val = `0${i}`;
      frames.push(this.game.add.texture(`a_sk_${val}.png`));
    }
    const attack = this.game.add.animation(frames, 0.2);
    attack.position.set(
      this.sprite.getBounds().width * 0.75,
      this.sprite.getBounds().height * 0.25
    );
    attack.visible = false;
    this.skills = {
      attack: (direct: number) => {
        if (direct) {
          attack.x = this.sprite.getBounds().width * 0.25 * direct;
          attack.scale.x = direct;
        }
        attack.visible = true;
        attack.loop = false;
        attack.gotoAndPlay(0);
        attack.onComplete = () => {
          attack.visible = false;
        };
      },
    };
    this.addChild(attack);
  }

  onClick() {}

  defeat(target: CheckerCardWrap, direct: string): boolean {
    const scene = this.game.currentScene as Card;

    //执行目标卡牌的触发事件
    target.content.event(this, scene);

    // 执行人物骨骼动作
    // 设定方向
    // 设定为左右移动方向，则更改角色面向
    direct &&
      this.faceDirect[direct] &&
      (this.sprite.scale.x =
        Math.abs(this.sprite.scale.x) * this.faceDirect[direct]);

    if (target.content.attack) {
      this.sprite.animation.timeScale = 4;
      const attackAction = this.sprite.animation.play('attack');
      attackAction && (attackAction.playTimes = 1);
      this.sprite.armature.eventDispatcher.addDBEventListener(
        DragonBones.EventObject.COMPLETE,
        () => {
          this.sprite.animation.timeScale = 2;
          this.sprite.animation.play('idle');
        },
        this
      );

      // 执行技能动画
      this.skills.attack(this.faceDirect[direct]);
    }

    // 没有击败目标
    if (target.content.hpValue && target.content.hpValue > 0) {
      this.attacking(direct, target);
      return false;
    } else {
      // 更新计分栏数值
      scene.scoreBar.score += target.content.score;
      scene.level.increaseExp(target.content.exp, target);
      scene.scoreBar.updateScore(scene.scoreBar.score);
      return true;
    }
  }

  // 攻击动画
  attacking(direct: string, target: CheckerCardWrap) {
    const [dx, dy] = this.parent.parent.moveBehavior[direct];
    this.changeSpriteTint(target.content.sprite, 0xd10311);
    this.tween.instance.to(this.parent, 0.1, {
      x: this.parent.x + dx * rem(40),
      y: this.parent.y + dy * rem(40),
      yoyo: true,
      repeat: 1,
      ease: this.tween.cubic.easeOut,
      onComplete: () => {
        this.changeSpriteTint(this.sprite, 0xffffff);
        this.changeSpriteTint(target.content.sprite, 0xffffff);
      },
    }).progress;
  }

  // 检测当前角色生命值
  checkPlayerHealth() {
    if (this.hpValue <= 0) {
      this.isAlive = false;
    } else {
      this.isAlive = true;
    }
  }
}

export default Don;
