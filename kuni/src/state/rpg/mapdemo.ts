/*
 * @Author: kunnisser 
 * @Date: 2019-09-14 23:40:01 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-11-20 10:27:55
 */

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import Game from 'ts@/lib/core';
import TileMap from 'ts@/lib/gameobjects/kn_tilemap';
import { Rectangle, AnimatedSprite, Ticker, Sprite } from 'pixi.js';

interface Path {
  pointer: Array<number>,
  F?: number,
  G?: number,
  H?: number,
  D?: number, // 当前点到open数组中元素的距离
  prev?: Path
}

class Role extends AnimatedSprite {
  timeline: any;
  tweening: boolean; // 是否出现新的运动指令
  pointer: Array<number>;
  paths: Array<Path>;
  start: Path;
  end: Path;
  step: number; // 角色行走步数
}

class MapDemo extends KnScene {
  public tilemap: TileMap;
  public road: Number;
  public boy: Role;
  public ticker: Ticker;
  public darkCamera: Sprite;
  public alphaLight: Sprite;
  constructor(game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.road = 1;
    this.ticker = null;
    this.pivot.set(0, 0);
    this.drawStage = this.game.add.graphics();
    this.resouces = {
      'worldmap': './assets/data/worldmap.json',
      'world': './assets/images/maptiles.png',
      'boy': './assets/data/boy.json',
      'lightmap': './assets/images/lightmap.png'
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
    this.dat = this.game.gui.add(dat, '随机生成地牢');
  }

  boot() {
    this.dev();
    this.reset();
    const staticWorldTexture = this.loader.resources.world.texture;
    let textures = [];

    // 定义瓷砖尺寸
    const tiledSizeX = 32;
    const tiledSizeY = 32;
    const tileWidth = 32, tileHeight = 32;
    const limitX = tiledSizeX * tileWidth - (this.game.camera.width / this.game.world.scale.x),
      limitY = tiledSizeY * tileHeight - (this.game.camera.height / this.game.world.scale.y);
    for (var i = 0, l = 4; i < l; i++) {
      const rectangle = new Rectangle(i * tileWidth, 0, tileWidth, tileHeight);
      const texture = staticWorldTexture.clone();
      texture.frame = rectangle;
      textures.push(texture);
    }
    const aliasData = this.loader.resources.worldmap.data;
    this.tilemap = new TileMap(0, textures, aliasData, { tiledSizeX, tiledSizeY, tileWidth, tileHeight });
    this.tilemap.pivot.set(0, 0);
    this.addChild(this.tilemap);

    // 添加地图角色
    this.initialBoy();
    
    // 加入lightmap
    this.addDarkLight();

    // 定义地图layer用于点击
    const layer: any = this.drawStage.generateRect(0xffffff, [0, 0, this.game.camera.width, this.game.camera.height], !1);
    layer.interactive = true;
    layer._events.pointerdown = [];

    // 添加点击layerWrap容器
    const layerWrap = new PIXI['tilemap'].RectTileLayer(1, []);
    layerWrap.addChild(layer);
    this.tilemap.addChild(layerWrap);

    // 生成tween的时间线
    this.boy.timeline = this.game.add.tweenline();
    this.boy.paths = [];

    // 监听点击
    layer.on('pointerdown', (e) => {
      const pos = e.data.global;
      const start: Path = {
        pointer: this.boy['pointer'],
        F: 0,
        G: 0,
        H: 0,
        D: 0,
        prev: null
      };
      const end = {
        pointer: this.transformPointer(pos.x, pos.y, tileWidth)
      };
      this.boy.step = 0;

      // 之前的路径惯性续行(当首次tween没有结束，goingpointer还生成，则使用后者)
      if (this.boy.paths.length) {
        start.pointer = this.boy['goingPointer'] || this.boy.paths[this.boy.step].pointer;
      }

      // 点击障碍物无法移动或NPC自身
      if (this.isobstacle(end.pointer) || this.isPointerOverlap(start, end)) {
        this.boy.paths = [];
        return;
      }

      // 設置路徑
      this.boy.paths = this.astar(start, end);
      this.boy.start = start;
      this.boy.end = end;
    });

    // 幀刷新
    this.update = () => {
      if (!this.boy.tweening && this.boy.paths.length) {
        this.boy.tweening = true;
        this.roleRunning(this.boy, tileWidth, tileHeight);
      }
      this.alphaLight.position.set(this.boy.x, this.boy.y);
      this.cameraUpdate(limitX, limitY);
    };
  }

  roleRunning(role: Role, tileWidth: number, tileHeight: number) {

    // 每一格方向判断
    const pointer = role.paths[role.step].pointer;
    this.setRolesDirect(role, role.start.pointer, pointer);

    // 将要去的路径作为参考路径用来做下一次方向判断
    role.start.pointer = pointer;
    role.timeline.clear();
    role.timeline.to(role, 0.25, {
      x: (pointer[0] + 0.5) * tileWidth,
      y: (pointer[1] + 0.5) * tileHeight,
      ease: role.timeline.linear.easeNone
    }).call(() => {
      const nextPath = role.paths[this.boy.step] || role.end;

      // 更新boy的地图坐标
      role.pointer = pointer;
      role['goingPointer'] = nextPath.pointer;
      role.stop();
      role.tweening = false;

      // 当行走至路径终点时
      if (role.step === role.paths.length) {
        role.paths = [];
        role['goingPointer'] = null;
      }
    });
    role.step += 1;
  }

  addDarkLight() {
    const alphaLight = this.game.add.image('lightmap', this, [0.5, 0.5]);
    alphaLight.position.set(this.boy.x, this.boy.y);
    alphaLight.scale.set(1, 0.6);
    this.mask = alphaLight;
    const tween = this.game.add.tween();
    tween.instance.to(alphaLight.scale, 0.64, {
      x: 1.08,
      y: 0.58,
      repeat: 1000,
      ease: tween.cubic.easeOut,
      yoyo: true,
    });
    this.alphaLight = alphaLight;
  }

  cameraUpdate(limitX, limitY) {

    // 镜头更新
    const globalOffsetX = this.boy.x - this.game.camera.half_w / this.game.world.scale.x;
    const globalOffsetY = this.boy.y - this.game.camera.half_h / this.game.world.scale.y;
    if (globalOffsetX >= 0 && globalOffsetX < limitX) {
      this.pivot.x = globalOffsetX;
    } else if (globalOffsetX >= limitX) {
      this.pivot.x = limitX;
    } else {
      this.pivot.x = 0;
    }
    if (globalOffsetY >= 0 && globalOffsetY < limitY) {
      this.pivot.y = globalOffsetY;
    } else if (globalOffsetY >= limitY) {
      this.pivot.y = limitY;
    } else {
      this.pivot.y = 0;
    }
  }

  initialBoy() {
    const frames = {
      down: [],
      up: [],
      left: [],
      right: []
    };
    for (let i = 0, l = 4; i < l; i++) {
      frames.down.push(this.game.add.texture(`down0${i}.png`));
      frames.left.push(this.game.add.texture(`left0${i}.png`));
      frames.up.push(this.game.add.texture(`up0${i}.png`));
      frames.right.push(this.game.add.texture(`right0${i}.png`));
    }
    this.boy = this.game.add.animation(frames.down, 0.2);
    this.boy.width = 24;
    this.boy.height = 32;
    this.boy.anchor.set(0.5);

    // 设定人物初始坐标
    this.boy['pointer'] = [16, 16];
    this.boy.position.set(32 * this.boy.pointer[0] + 16, 32 * this.boy.pointer[1] + 16);
    this.addChild(this.boy);
    this.boy['frames'] = frames;

    // 设置初始面向
    this.boy.textures = frames.right;
  }

  // 设置角色面向
  setRolesDirect(role: AnimatedSprite, prev: Array<number>, next: Array<number>) {
    if (prev[0] < next[0]) {
      role.textures = role['frames'].right;
    } else if (prev[0] > next[0]) {
      role.textures = role['frames'].left;
    } else if (prev[1] < next[1]) {
      role.textures = role['frames'].down;
    } else if (prev[1] > next[1]) {
      role.textures = role['frames'].up;
    }
    role.play();
  }

  // 坐标重叠
  isPointerOverlap(start: Path, end: Path) {
    return start.pointer[0] === end.pointer[0] && start.pointer[1] === end.pointer[1];
  }


  // 点击坐标转换
  transformPointer(x: number, y: number, tileWidth: number) {
    const mapX = x / this.game.world.scale.x + this.pivot.x,
      mapY = y / this.game.world.scale.y + this.pivot.y;
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
    return this.tilemap.mapData[index] !== this.road;
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
