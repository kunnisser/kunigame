/*
 * @Author: kunnisser 
 * @Date: 2019-09-14 23:40:01 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-01-16 16:02:39
 */

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import Game from 'ts@/lib/core';
import TileMap from 'ts@/lib/gameobjects/kn_tilemap';
import { Rectangle, Ticker, Sprite } from 'pixi.js';
import BaseRole from './roles/baseRole';
import KnSkButton from 'ts@/lib/gameui/kn_skbutton';
import KnGroup from 'ts@/lib/gameobjects/kn_group';

interface Path {
  pointer: Array<number>,
  F?: number,
  G?: number,
  H?: number,
  D?: number, // 当前点到open数组中元素的距离
  prev?: Path
}

class Role extends BaseRole {
  timeline: any;
  tweening: boolean; // 是否出现新的运动指令
  pointer: Array<number>;
  paths: Array<Path>;
  start: Path;
  end: Path;
  acting: boolean; // 是否进行动作
  step: number; // 角色行走步数
}

class MapDemo extends KnScene {
  public tilemap: TileMap;
  public depthmap: TileMap;
  public obstacles: Array<Number>; // 障碍集合
  public gamer: Role;
  public ticker: Ticker;
  public darkCamera: Sprite;
  public alphaLight: Sprite;
  public mark: Sprite;
  public scene: KnGroup;
  constructor(game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.obstacles = [];
    this.ticker = null;
    this.scene = this.game.add.group('scene', this);
    this.scene.pivot.set(0, 0);
    this.drawStage = this.game.add.graphics();
    this.resouces = {
      'worldmap': './assets/data/rpg.json',
      'world': './assets/images/GrasslandColor.png',
      'lightmap': './assets/images/lightmap.png',
      'druid_ske': './assets/data/deluyi_ske.json',
      'druid_tex': './assets/data/deluyi_tex.json',
      'druid': './assets/images/deluyi_tex.png',
      'mark': './assets/images/mark.png',
      'rpg_sk_bg': './assets/images/rpg_sk_bg.png',
      'rpg_mask': './assets/images/rpg_mask.png',
      'rpg_druid_weapon': './assets/images/rpg_druid_weapon.png',
      'druid_sk_cure': './assets/images/druid_sk_cure.png',
    };
  }

  dev() {
    if (this.game.gui.__controllers[0] && this.game.gui.__controllers[0].property === '随机生成地牢') {
      return;
    }
    const dat = {
      '随机生成地牢': () => {
        this.boot();
      }
    };

    const toggle = {
      'LightmapVisible': !1,
    }

    this.game.gui.add(dat, '随机生成地牢');
    const controller = this.game.gui.add(toggle, 'LightmapVisible');
    controller.onChange((flag: boolean) => {
      if (flag) {
        this.alphaLight.visible = !0;
        this.mask = this.alphaLight;
      } else {
        this.alphaLight.visible = !1;
        this.mask = null;
      }
    });
  }

  boot() {
    this.dev();
    this.reset();
    const staticWorldTexture = this.loader.resources.world.texture;

    let textures = [];

    // 定义瓷砖尺寸
    const tiledSizeX = 32;
    const tiledSizeY = 32;
    const tileWidth = 64, tileHeight = 64;
    const limitX = tiledSizeX * tileWidth - (this.game.camera.width / this.game.world.scale.x),
      limitY = tiledSizeY * tileHeight - (this.game.camera.height / this.game.world.scale.y);
    for (var i = 0, l = 256; i < l; i++) {
      const rectangle = new Rectangle(i % 16 * tileWidth, ~~(i / 16) * tileHeight, tileWidth, tileHeight);
      const texture = staticWorldTexture.clone();
      texture.frame = rectangle;
      textures.push(texture);
    }
    const aliasData = this.loader.resources.worldmap.data.layers;

    this.tilemap = new TileMap(0, textures, aliasData.slice(0, 4), { tiledSizeX, tiledSizeY, tileWidth, tileHeight });
    this.tilemap.pivot.set(0, 0);

    this.scene.addChild(this.tilemap);

    // 添加地图角色
    this.initialRoles();

    // 添加纵深层
    this.depthmap = new TileMap(0, textures, aliasData.slice(4, 5), { tiledSizeX, tiledSizeY, tileWidth, tileHeight });
    this.depthmap.pivot.set(0, 0);
    this.scene.addChild(this.depthmap);

    this.addMark(tileWidth, tileHeight);

    // 加入lightmap
    this.addDarkLight();

    // 定义地图layer用于点击
    const layer: any = this.drawStage.generateRect(0xffffff, [0, 0, this.game.camera.width, this.game.camera.height], !1);
    layer.interactive = true;
    layer._events.pointerdown = [];

    // 添加点击layerWrap容器
    const layerWrap = new PIXI['tilemap'].RectTileLayer(1, []);
    layerWrap.addChild(layer);
    this.depthmap.addChild(layerWrap);

    // 生成tween的时间线
    this.gamer.timeline = this.game.add.tweenline();
    this.gamer.paths = [];

    // 监听点击
    layer.on('pointerdown', (e) => {
      const pos = e.data.global;
      const start: Path = {
        pointer: this.gamer.pointer,
        F: 0,
        G: 0,
        H: 0,
        D: 0,
        prev: null
      };

      const end = {
        pointer: this.transformPointer(pos.x, pos.y, tileWidth)
      };

      this.gamer.step = 0;

      // 之前的路径惯性续行(当首次tween没有结束，goingpointer还生成，则使用后者)
      if (this.gamer.paths.length) {
        start.pointer = this.gamer['goingPointer'] || this.gamer.paths[this.gamer.step].pointer;
      }

      // 点击障碍物无法移动或NPC自身
      if (this.isobstacle(end.pointer) || this.isPointerOverlap(start, end)) {
        this.gamer.paths = [];
        return;
      }

      // 設置路徑
      this.gamer.paths = this.astar(start, end);
      this.gamer.start = start;
      this.gamer.end = end;

      // 设置mark
      this.mark.visible = !0;
      this.mark.position.set((end.pointer[0] + 0.5) * tileWidth, (end.pointer[1] + 0.5) * tileHeight);
      this.mark.alpha = 1;
      const tween = this.game.add.tween();
      tween.instance.killTweensOf(this.mark);
      tween.instance.to(this.mark, 0.25, {
        y: this.mark.y + 10,
        alpha: 0.2,
        ease: tween.linear.easeNone,
        repeat: 2,
        yoyo: true,
        onComplete: () => {
          this.mark.visible = !1;
        }
      });

      // 定义行走动画
      this.gamer.role.animation.play('walk').timeScale = 2;
    });

    // 幀刷新
    this.update = () => {
      if (!this.gamer.tweening && this.gamer.paths.length) {
        this.gamer.tweening = true;

        // 定义初始方向?
        this.setRolesDirect(this.gamer, this.gamer.start.pointer, this.gamer.end.pointer);
        this.roleRunning(this.gamer, tileWidth, tileHeight);
      }
      this.alphaLight.position.set(this.gamer.x, this.gamer.y);
      this.cameraUpdate(limitX, limitY);
    };
    this.game.ticker.start();

    // UI
    this.addUIGroup();
  }

  // 添加点击标记
  addMark(tileWidth, tileHeight) {
    this.mark = this.game.add.image('mark', this.scene, [0.5, 0.5]);
    this.mark.visible = !1;
    this.mark.width = tileWidth * 0.5;
    this.mark.height = tileHeight * 0.5;
  }

  roleRunning(character: Role, tileWidth: number, tileHeight: number) {

    // 每一格方向判断
    const pointer = character.paths[character.step].pointer;

    this.setRolesDirect(character, character.start.pointer, pointer);

    // 将要去的路径作为参考路径用来做下一次方向判断
    character.start.pointer = pointer;

    character.timeline.clear();
    character.timeline.to(character, 0.25, {
      x: (pointer[0] + 0.5) * tileWidth,
      y: (pointer[1] + 0.5) * tileHeight,
      ease: character.timeline.linear.easeNone
    }).call(() => {
      const nextPath = character.paths[this.gamer.step] || character.end;

      // 更新gamer的地图坐标
      character.pointer = pointer;
      character['goingPointer'] = nextPath.pointer;
      character.tweening = false;

      // 当行走至路径终点时
      if (character.step === character.paths.length) {
        character.paths.length > 0 &&
        character.role.animation.play('stay');
        character.paths = [];
        character['goingPointer'] = null;
      }
    });
    character.step += 1;
  }

  addDarkLight() {
    const alphaLight = this.game.add.image('lightmap', this.scene, [0.5, 0.5]);
    alphaLight.position.set(this.gamer.x, this.gamer.y);
    alphaLight.scale.set(2, 1);
    const tween = this.game.add.tween();
    tween.instance.to(alphaLight.scale, 0.95, {
      x: 2.05,
      y: 0.95,
      repeat: 1000,
      ease: tween.cubic.easeInOut,
      yoyo: true,
    });
    this.alphaLight = alphaLight;
    this.alphaLight.visible = !1;
  }

  cameraUpdate(limitX, limitY) {

    // 镜头更新
    const globalOffsetX = this.gamer.x - this.game.camera.half_w / this.game.world.scale.x;
    const globalOffsetY = this.gamer.y - this.game.camera.half_h / this.game.world.scale.y;
    if (globalOffsetX >= 0 && globalOffsetX < limitX) {
      this.scene.pivot.x = globalOffsetX;
    } else if (globalOffsetX >= limitX) {
      this.scene.pivot.x = limitX;
    } else {
      this.scene.pivot.x = 0;
    }
    if (globalOffsetY >= 0 && globalOffsetY < limitY) {
      this.scene.pivot.y = globalOffsetY;
    } else if (globalOffsetY >= limitY) {
      this.scene.pivot.y = limitY;
    } else {
      this.scene.pivot.y = 0;
    }
  }

  initialRoles() {

    // 定义德鲁伊
    const stageRes = this.loader.resources;
    const druidRes = [stageRes.druid_ske.data, stageRes.druid_tex.data, stageRes.druid.texture];
    this.gamer = new Role(this.game, this.scene, druidRes);
    this.gamer.pointer = [2, 2];
    this.gamer.position.set(64 * this.gamer.pointer[0] + 32, 64 * this.gamer.pointer[1] + 32);
    this.gamer.setFaceToRight();
  }

  // 设置角色面向
  setRolesDirect(gamer: Role, prev: Array<number>, next: Array<number>) {
    if (prev[0] < next[0]) {
      gamer.setFaceToRight();
    } else if (prev[0] > next[0]) {
      gamer.setFaceToLeft();
    }
  }

  // 坐标重叠
  isPointerOverlap(start: Path, end: Path) {
    return start.pointer[0] === end.pointer[0] && start.pointer[1] === end.pointer[1];
  }


  // 点击坐标转换
  transformPointer(x: number, y: number, tileWidth: number) {
    const mapX = x / this.game.world.scale.x + this.scene.pivot.x,
      mapY = y / this.game.world.scale.y + this.scene.pivot.y;
    return [~~(mapX / tileWidth), ~~(mapY / tileWidth)];
  }

  // A*寻路
  astar(start: Path, end: Path) {
    let findFlag: Boolean = true;
    let opens = [], closed = [];
    closed.push(start);
    let cur = start;
    // 节点相邻
    if (Math.abs(start.pointer[0] - end.pointer[0]) + Math.abs(start.pointer[1] - end.pointer[1]) === 1) {
      closed.push(end);
      end.prev = cur;
      findFlag = false;
    }

    // 当前元素不在closed路径中
    if (!this.isExistList(closed, cur)) {
      closed.push(cur);
    }

    // 循环执行
    while (findFlag && cur) {

      // 获取当前
      let rounds = this.getRound(this.tilemap.size_x, this.tilemap.size_y, cur);
      for (let rd of rounds) {

        // 存在于open,close数组以及元素为障碍物则排除。
        if (this.isExistList(opens, rd) || this.isExistList(closed, rd) || this.isobstacle(rd)) {
          continue;
        } else if (!this.isExistList(closed, rd) && !this.isobstacle(rd)) {

          // 满足移动的条件则构造Pointer
          let p: Path = {
            pointer: rd,
            G: cur.G + 1,
            F: 0,
            H: Math.abs(rd[0] - end.pointer[0]) + Math.abs(rd[1] - end.pointer[1]), // 设置曼哈顿距离
            prev: cur // 设置回溯指针
          };
          p.F = p.G + p.H;
          opens.push(p);
        }
      }

      // 死胡同没路
      if (opens.length === 0) {
        cur = null;
        opens = [];
        closed = [];
        break;
      }

      // 分析open数组，选择F值最小的
      opens.sort((a, b) => {
        return a.F - b.F;
      });

      let oMinF = opens[0];

      let oMinArray = opens.filter((o) => o.F === oMinF.F);

      // 如果opens存在多个最小值，选择离当前点最近的。
      if (oMinArray.length > 1) {
        for (let oma of oMinArray) {
          oma.D = Math.abs(oma.pointer[0] - cur.pointer[0]) + Math.abs(oma.pointer[1] - cur.pointer[1])
        }
        oMinArray.sort((a, b) => a.D - b.D);
        oMinF = oMinArray[0];
      }

      cur = oMinF;

      // 将最小F值的open存入closed
      if (!this.isExistList(closed, cur)) {
        closed.push(cur);
      }

      // 在open中删除cur
      const delIndex = opens.findIndex((o) => o === cur);
      opens.splice(delIndex, 1);

      // 找到最后一步的时候
      if (cur.H === 1) {
        end.prev = cur;
        closed.push(end);
        cur = null;
        findFlag = false;
      }
    }

    let paths = [];
    if (closed.length > 0) {
      let pathdot = closed[closed.length - 1];
      while (pathdot) {
        pathdot.prev && paths.unshift(pathdot);
        pathdot = pathdot.prev;
      }
    }
    return paths;
  }

  // 获取周边OPEN
  getRound(size_x: number, size_y: number, cur: Path) {
    let rounds = [];

    // 向上检索
    if (cur.pointer[1] - 1 >= 0) {
      rounds.push([cur.pointer[0], cur.pointer[1] - 1]);
    }

    // 向左检索
    if (cur.pointer[0] - 1 >= 0) {
      rounds.push([cur.pointer[0] - 1, cur.pointer[1]]);
    }

    // 向下检索
    if (cur.pointer[1] + 1 < size_y) {
      rounds.push([cur.pointer[0], cur.pointer[1] + 1]);
    }

    // 向右检索
    if (cur.pointer[0] + 1 < size_x) {
      rounds.push([cur.pointer[0] + 1, cur.pointer[1]]);
    }

    return rounds;
  }

  // 检测是否在list中已存在
  isExistList(list: Array<Path>, cur) {
    for (let l of list) {
      if (cur.pointer) {
        if (l.pointer[0] === cur.pointer[0] && l.pointer[1] === cur.pointer[1]) {
          return true;
        }
      } else {
        if (l.pointer[0] === cur[0] && l.pointer[1] === cur[1]) {
          return true;
        }
      }
    }
    return false;
  }

  // 判断是否为障碍
  isobstacle(pointer: Array<number>) {
    const index = pointer[0] + this.tilemap.size_x * pointer[1];
    if (this.tilemap.mapData[2].data[index] > 0 && this.tilemap.mapData[3].data[index] === 0) {
      return true;
    } else {
      return false;
    }
  }

  // 暂停运动
  pauseWalking () {
    this.gamer.paths = [];
    this.gamer['goingPointer'] = null;
    this.gamer.step = 0;
  }

  // UI组
  addUIGroup() {
    const Gui = this.game.add.group('gui', this);
    Gui.position.set(this.game.config.half_w, this.game.config.height - 50);
    const attackConfig = {
      type: 'normal',
      cd: 0.8,
      action: () => {
        this.pauseWalking();

        this.gamer.role.animation.play('sk_attack', 1);
        this.gamer.role.addDBEventListener(this.gamer.DB.EventObject.COMPLETE, () => {
          this.gamer.role.removeDBEventListener(this.gamer.DB.EventObject.COMPLETE);
          const roleState = this.gamer.tweening ? 'walk' : 'stay';
          this.gamer.role.animation.play(roleState);
        }, this);
        return this.gamer;
      }
    };
    const attack = new KnSkButton(this.game, Gui, 'rpg_druid_weapon', attackConfig);
    attack.position.set(0, 0);
    const cureConfig = {
      cd: 5,
      action: () => {
        this.pauseWalking();

        this.gamer.role.animation.play('sk_cure', 1);
        this.gamer.role.addDBEventListener(this.gamer.DB.EventObject.COMPLETE, () => {
          this.gamer.role.removeDBEventListener(this.gamer.DB.EventObject.COMPLETE);
          const roleState = this.gamer.tweening ? 'walk' : 'stay';
          this.gamer.role.animation.play(roleState);
        }, this);
        return this.gamer;
      }
    };
    const cure = new KnSkButton(this.game, Gui, 'druid_sk_cure', cureConfig);
    cure.position.set(attack.width + 20, 0);
  }

  reset() {
    if (this.children.length > 1) {

      // 清除grahpics 画布
      this.drawStage.clear();

      // // 清空对象MASK
      // this.children[2] && (this.children[2].mask = null);

      // 清除group子对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default MapDemo;
