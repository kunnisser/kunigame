/*
 * @Author: kunnisser 
 * @Date: 2019-09-14 23:40:01 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-09-16 18:09:15
 */

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import Game from 'ts@/lib/core';
import TileMap from 'ts@/lib/gameobjects/kn_tilemap';
import { Rectangle, AnimatedSprite } from 'pixi.js';
import KnLoader from 'ts@/lib/loader/kn_loader';
import {Linear} from 'gsap';

interface Point {
  pointer: Array<number>,
  F: number,
  G: number,
  H: number,
  D?: number, // 当前点到open数组中元素的距离
  prev: Point
}
class MapDemo extends KnScene {
  public tilemap: TileMap;
  public road: Number;
  constructor(game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.road = 1;
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
      for (var i = 0, l = 4; i < l; i++) {
        const rectangle = new Rectangle(i * 32, 0, 32, 32);
        const texture = staticWorldTexture.clone();
        texture.frame = rectangle;
        textures.push(texture);
      }
      const aliasData = loader.resources.worldmap.data;
      this.tilemap = new TileMap(0, textures, aliasData);
      this.tilemap.position.set(0, 0);
      this.addChild(this.tilemap);
      this.initialBoy();
    });
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
    const boy: AnimatedSprite = this.game.add.animation(frames.down, 0.2);
    boy.width = 24;
    boy.height = 32;
    const start: Point = {
      pointer: [4, 2],
      F: 0,
      G: 0,
      H: 0,
      D: 0,
      prev: null
    };
    const end = {
      pointer: [8, 2]
    };
    boy.position.set((start.pointer[0] + 0.5) * this.tilemap.size, (start.pointer[1] + 0.5) * this.tilemap.size);
    boy.anchor.set(0.5);
    this.addChild(boy);
    boy.textures = frames.right;
    boy.play();
    const paths = this.astar(start, end);
    const timeline = this.game.add.tweenline();
    for (let ps of paths) {
      timeline.to(boy, 0.25, {
        x: (ps.pointer[0] + 0.5) * this.tilemap.size,
         y: (ps.pointer[1] + 0.5) * this.tilemap.size,
         ease: Linear.easeNone
        });
    }
  }

  astar(start, end) {
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
          let p: Point = {
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
        paths.unshift(pathdot);
        pathdot = pathdot.prev;
      }
    }
    console.log(paths);
    return paths;
  }

  // 获取周边OPEN
  getRound(size: number, cur: Point) {
    let rounds = [null, null, null, null];

    // 向上检索
    if (cur.pointer[1] - 1 >= 0) {
      rounds[0] = [cur.pointer[0], cur.pointer[1] - 1];
    }

    // 向左检索
    if (cur.pointer[0] - 1 >= 0) {
      rounds[1] = [cur.pointer[0] - 1, cur.pointer[1]];
    }

    // 向下检索
    if (cur.pointer[1] + 1 < size) {
      rounds[2] = [cur.pointer[0], cur.pointer[1] + 1];
    }

    // 向右检索
    if (cur.pointer[0] + 1 < size) {
      rounds[3] = [cur.pointer[0] + 1, cur.pointer[1]];
    }

    return rounds;
  }

  // 检测是否在list中已存在
  isExistList(list: Array<Point>, cur) {
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
  isobstacle(pointer) {
    const index = pointer[0] + this.tilemap.size * pointer[1];
    return this.tilemap.mapData[index] !== this.road;
  }
}

export default MapDemo;
