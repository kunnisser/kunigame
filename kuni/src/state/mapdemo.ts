/*
 * @Author: kunnisser 
 * @Date: 2019-09-14 23:40:01 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-09-27 16:04:51
 */

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import Game from 'ts@/lib/core';
import TileMap from 'ts@/lib/gameobjects/kn_tilemap';
import { Rectangle, AnimatedSprite, Ticker } from 'pixi.js';
import KnLoader from 'ts@/lib/loader/kn_loader';

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
  constructor(game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.road = 1;
    this.ticker = null;
    this.pivot.set(0, 0);
    this.initialWorld();
  }

  initialWorld() {
    KnLoader.preloader
      .add('worldmap', './assets/data/worldmap.json')
      .add('world', './assets/images/maptiles.png')
      .add('./assets/data/boy.json');
    KnLoader.preloader.load((loader, resources) => {
      const staticWorldTexture = resources.world.texture;
      let textures = [];

      // 定义瓷砖尺寸
      const tiledSize = 32;
      const tileWidth = 32, tileHeight = 32;
      const limitX = tiledSize * tileWidth - (this.game.camera.width / this.game.world.scale.x),
        limitY = tiledSize * tileHeight - (this.game.camera.height / this.game.world.scale.y);
      for (var i = 0, l = 4; i < l; i++) {
        const rectangle = new Rectangle(i * tiledSize, 0, tiledSize, tiledSize);
        const texture = staticWorldTexture.clone();
        texture.frame = rectangle;
        textures.push(texture);
      }
      const aliasData = loader.resources.worldmap.data;
      this.tilemap = new TileMap(0, textures, aliasData, tiledSize);
      this.tilemap.pivot.set(0, 0);
      this.addChild(this.tilemap);
      this.initialBoy();
      const layer = this.game.add.graphics().generateRect(0x1099bb, [0, 0, this.game.camera.width, this.game.camera.height], !1);
      layer.interactive = true;
      this.tilemap.addChild(layer);
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

        // 点击障碍物无法移动或NPC自身
        if (this.isobstacle(end.pointer) || this.isPointerOverlap(start, end)) {
          return;
        }

        // 設置路徑
        if (this.boy.paths.length) {
          start.pointer = this.boy['goingPointer'];
        }
        this.boy.paths = this.astar(start, end);
        this.boy.start = start;
        this.boy.end = end;
        this.boy.step = 0;
      });

      // 幀刷新
      this.update(() => {
        if (!this.boy.tweening && this.boy.paths.length) {
          this.boy.tweening = true;
          this.roleRunning(this.boy, tileWidth, tileHeight);
        }
        this.cameraUpdate(limitX, limitY);
      });
    });
  }

  roleRunning(role: Role, tileWidth: number, tileHeight: number) {

    // 每一格方向判断
    this.setRolesDirect(this.boy, role.start.pointer, role.paths[this.boy.step].pointer);
    const pointer = role.paths[this.boy.step].pointer;
    this.boy['timeline'].clear();
    this.boy['timeline'].to(this.boy, 0.25, {
      x: (pointer[0] + 0.5) * tileWidth,
      y: (pointer[1] + 0.5) * tileHeight,
      ease: this.boy['timeline'].linear.easeNone
    }).call(() => {
      if (this.boy.step === role.paths.length) {
        role.paths = [];
      }

      const nextPath = role.paths[this.boy.step] || role.end;

      // 更新boy的地图坐标
      this.boy.pointer = pointer;
      this.boy['goingPointer'] = nextPath.pointer;
      this.boy.stop();
      this.boy.tweening = false;
    });
    this.boy.step += 1;
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
    this.boy.position.set(144, 80);
    this.boy.anchor.set(0.5);

    // 设定人物初始坐标
    this.boy['pointer'] = [4, 2];
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
      let rounds = this.getRound(this.tilemap.size, cur);
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
  getRound(size: number, cur: Path) {
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
    if (cur.pointer[1] + 1 < size) {
      rounds.push([cur.pointer[0], cur.pointer[1] + 1]);
    }

    // 向右检索
    if (cur.pointer[0] + 1 < size) {
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
    const index = pointer[0] + this.tilemap.size * pointer[1];
    return this.tilemap.mapData[index] !== this.road;
  }

  update(cb: Function) {

    // 创建刷新器
    this.ticker = this.game.add.ticker();
    this.ticker.add((delta) => {
      this.game.stats.begin();
      cb(delta);
      this.game.app.renderer.render(this.game.world);
      this.game.stats.end();
    });
    this.ticker.start();
  }
}

export default MapDemo;
