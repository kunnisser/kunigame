import BaseRole from "../roles/baseRole";
import * as RoleConfig from "./roleConfig";
import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnEmitter from "ts@/kuni/lib/gameobjects/kn_emitter";
import { Point, Sprite } from "pixi.js";
import KnSkButton from "ts@/kuni/lib/gameui/kn_skillBtn";
import MapDemo from "../mapDemo";

interface Player {
  name: string;
  remote?: any;
  skills?: Array<any>;
  hp: number;
  mp: number;
  crit: number;
  critVal: number;
}

interface Path {
  pointer: Point;
  F?: number;
  G?: number;
  H?: number;
  D?: number; // 当前点到open数组中元素的距离
  prev?: Path;
}

class PlayerRole extends BaseRole {
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
  public level: number; // 等级
  public exp: number; // 当前经验
  public hpbar: Sprite; // 生命条
  public hp: number; // 当前生命值
  public mp: number; // 魔法值
  public distance: number; // 攻击距离
  constructor(state: MapDemo, res: any, name: string) {
    super(state.game, state.scene, res, name);
    this.config = RoleConfig[name];
    this.state = state;
    this.parent = state.scene;
    this.game = state.game;
    this.level = 1;
    this.exp = 10;
    this.goingPointer = this.game.add.pointer(0, 0);
    this.reentry = !1;
    this.hp = this.config.hp;
    this.mp = this.config.mp;
  }

  initial(x: number, y: number) {
    this.pointer = this.game.add.pointer(x, y);
    this.position.set(64 * this.pointer.x + 32, 64 * this.pointer.y + 32);

    if (this.config.remote) {
      // 如是远程角色
      this.emitter = this.game.add.emitter(
        this.game,
        10,
        this.config.remote.bullet
      );
      this.parent.addChild(this.emitter);
      this.emitter.position.set(0, 0);

      // 设置弹道速度
      this.bulletSpeed = this.config.remote.speed;
    }

    // 设置生命条
    const hpBg = this.game.add.image("", "hp_bg", this, [0, 0.5]);
    hpBg.scale.set(2.4);
    hpBg.y -= 160;
    hpBg.x -= hpBg.width * 0.5;
    this.hpbar = this.game.add.image("", "player_hp", this, [0, 0.5]);
    this.hpbar.scale.set(2.4);
    this.hpbar.position.set(
      hpBg.x + (hpBg.width - this.hpbar.width) * 0.5,
      hpBg.y
    );
  }

  initSkill(gui: KnGroup) {
    let keySkills = {};
    this.config.skills?.forEach((sk, index) => {
      const btnConfig = {
        index: index + 1,
        cd: sk.cd,
        action: (cb) => {
          if (!this.target) {
            this.state.tip.showMessage("请选择目标");
            return false;
          }
          this.state.setWalkPath(this.target, 64, sk.distance);
          if (this.paths.length > 0) {
            return false;
          }
          this.pauseWalking();
          const direct = this.setAttackDirect(this);
          this.role.animation.play(sk.animate, 1);
          this.role.hasDBEventListener(this.DB.EventObject.COMPLETE) > 0 ||
            this.role.addDBEventListener(
              this.DB.EventObject.COMPLETE,
              () => {
                this.role.removeDBEventListener(this.DB.EventObject.COMPLETE);

                // 执行CD
                cb();
                this.attack(direct, this.config);

                // 计算伤害
                sk.action(
                  sk.attack,
                  this.config.crit,
                  this.config.critVal,
                  this.target
                );
                const roleState = this.tweening ? "walk" : "stay";
                this.role.animation.play(roleState);
              },
              this
            );
          return this;
        }
      };

      const skillBtnGp = new KnSkButton(this.game, gui, sk.icon, btnConfig);
      skillBtnGp.position.set((index + 0.5) * skillBtnGp.width, 0);
      keySkills[index + 49] = () => {
        skillBtnGp.dispatchSkill.bind(skillBtnGp)(btnConfig);
      };
    });

    // 绑定键盘事件
    document.addEventListener("keydown", (e) => {
      keySkills[e.keyCode] && keySkills[e.keyCode]();
    });
  }

  // 暂停运动
  pauseWalking() {
    this.pause = true;
    this.paths = [];
    this.goingPointer = this.game.add.pointer(0, 0);
    this.step = 0;
  }

  // 设置角色攻击面向
  setAttackDirect(gamer: PlayerRole) {
    if (gamer.x > gamer.target.x) {
      gamer.setFaceToLeft();
      return -1;
    } else {
      gamer.setFaceToRight();
      return 1;
    }
  }

  // 角色平A攻击
  attack(direct: number, config) {
    if (this.config.remote) {
      const currentBullet = this.emitter?.shoot();
      currentBullet?.position.set(this.x + 32 * direct, this.y);
      this.bullets = this.emitter?.children.filter((bullet) => {
        return bullet.alpha === 1;
      });
    }
  }
}

export default PlayerRole;
