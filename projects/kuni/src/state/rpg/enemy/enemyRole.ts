import BaseRole from "../roles/baseRole";
import * as RoleConfig from './roleConfig';
import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnEmitter from "ts@/kuni/lib/gameobjects/kn_emitter";
import { Point, Sprite } from "pixi.js";
import MapDemo from "../mapDemo";
import AttackTip from "../gui/attackTip";

interface Player {
  name: string;
  remote?: any;
  skills?: Array<any>;
  hp: number;
  crit: number;
  critVal: number;
}

interface Path {
  pointer: Point,
  F?: number,
  G?: number,
  H?: number,
  D?: number, // 当前点到open数组中元素的距离
  prev?: Path
}

class EnemyRole extends BaseRole {
  public state: MapDemo;
  public game: Game;
  public config: Player;
  public timeline: any;
  public tweening: boolean; // 是否出现新的运动指令
  public pointer: Point;
  public paths: Array<Path>;
  public start: Path;
  public end: Path;
  public goingPointer: Point;
  public step: number; // 角色行走步数
  public pause: boolean; // 是否暂停行走
  public target?: any; // 角色的目标
  public emitter?: KnEmitter; // 远程角色发射器
  public bullets?: Array<any> = []; // 远程角色伤害弹
  public bulletSpeed?: number; // 弹道速度
  public attackDirect: boolean; // 攻击面向
  public reentry: boolean; // 是否中途打断折返
  public parent: KnGroup;
  public hpbar: Sprite;
  public hp: number;
  public maxHp: number;
  public staticHpWidth: number;
  public sign: Sprite;
  public tip: AttackTip;
  constructor(state: MapDemo, res: any, name: string) {
    super(state.game, state.scene, res, name);
    this.config = RoleConfig[name];
    this.state = state;
    this.parent = state.scene;
    this.game = state.game;
    this.goingPointer = this.game.add.pointer(0, 0);
    this.reentry = !1;
  }

  initial(x: number, y: number) {
    this.pointer = this.game.add.pointer(x, y);
    this.position.set(64 * this.pointer.x + 32, 64 * this.pointer.y + 32);

    if (this.config.remote) {
      // 如是远程角色
      this.emitter = this.game.add.emitter(this.game, 10, this.config.remote.bullet);
      this.parent.addChild(this.emitter);
      this.emitter.position.set(0, 0);

      // 设置弹道速度
      this.bulletSpeed = this.config.remote.speed;
    }

    // 设置生命条
    const hpBg = this.game.add.image('hp_bg', this, [0, 0.5]);
    hpBg.scale.set(2.4);
    hpBg.y -= 160;
    hpBg.x -= hpBg.width * 0.5;
    this.hpbar = this.game.add.image('enemy_hp', this, [0, 0.5]);
    this.hpbar.width = hpBg.width - 12;
    this.hpbar.height = hpBg.height - 10;
    this.hpbar.position.set(hpBg.x + (hpBg.width - this.hpbar.width) * 0.5, hpBg.y);

    // 设置初始生命值
    this.maxHp = this.config.hp;
    this.staticHpWidth = this.hpbar.width;
    this.hp = this.maxHp;

    // 设置tip信息
    this.tip = new AttackTip(this.config.name, this);

    this.pointActive();
  }

  // 光标事件
  pointActive() {
    const role = this.role.armature.getDisplay();
    role.interactive = true;
    role.on('pointerover', () => {
      role.cursor = 'hover';
    });
    role.on('pointerdown', () => {
      this.state.gamer.target = this;
      this.sign || this.targetSign();
    });
  }

  // 初始化技能
  initSkill() {
  }

  // 暂停运动
  pauseWalking() {
    this.pause = true;
    this.paths = [];
    this.goingPointer = this.game.add.pointer(0, 0);
    this.step = 0;
  }

  // 标记
  targetSign() {
    this.sign = this.game.add.image('mark', this, [0.5, 0.5]);
    this.sign.scale.set(1.8);
    this.sign.y = - 100;
    this.sign.visible = !0;
    this.sign['flash'] = this.game.add.tween().instance;
    this.sign['flash'].to(this.sign, 0.4, {
      alpha: 0.5,
      repeat: 1e3,
      yoyo: true
    });
  }

  // 设置角色攻击面向
  setAttackDirect(gamer: EnemyRole) {
    if (gamer.x > gamer.target.x) {
      gamer.setFaceToLeft();
      return -1;
    } else {
      gamer.setFaceToRight();
      return 1;
    }
  }

  // 角色平A攻击
  attack(direct: number) {
    if (this.config.remote) {
      const currentBullet = this.emitter?.shoot();
      currentBullet?.position.set(this.x + 32 * direct, this.y);
      this.bullets = this.emitter?.children.filter((bullet) => {
        return bullet.alpha === 1;
      });
    }
  }

  // 角色挂掉
  bekilled() {
    this.visible = !1;
    this.state.gamer.target = null;
  }
}

export default EnemyRole;