import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import Game from 'ts@/kuni/lib/core';
import TileMap from 'ts@/kuni/lib/gameobjects/kn_tilemap';
import { Rectangle, Sprite, Point, Texture } from 'pixi.js';
import { math } from 'ts@/kuni/lib/utils/common';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import PlayerRole from './player/playerRole';
import EnemyRole from './enemy/enemyRole';
import ExpBar from './gui/expbar';
import KnAvatar from 'ts@/kuni/lib/gameui/kn_avatar';
import KnMessage from 'ts@/kuni/lib/gameui/kn_message';

interface Path {
  pointer: Point,
  F?: number,
  G?: number,
  H?: number,
  D?: number, // 当前点到open数组中元素的距离
  prev?: Path
}

class MapDemo extends KnScene {
  public tilemap: TileMap;
  public depthmap: TileMap;
  public obstacles: Array<Number>; // 障碍集合
  public gamer: any;
  public ticker: any;
  public darkCamera: Sprite;
  public alphaLight: any;
  public mark: Sprite;
  public scene: KnGroup;
  public expbar: KnGroup;
  public tip: KnMessage;
  constructor(game: Game, key: string) {
    super(game, key);
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
      'exp_icon': './assets/images/exp.png',
      'exp_outbar': './assets/images/exp_outbar.png',
      'exp_innerbar': './assets/images/exp_innerbar.png',
      'avatar': './assets/images/avator_01.png',
      'hp_bg': './assets/images/hp_bg.png',
      'player_hp': './assets/images/player_hp.png',
      'enemy_hp': './assets/images/enemy_hp.png',
      'rpg_health_bar': './assets/images/rpg_health_bar.png',
      'rpg_magic_bar': './assets/images/rpg_magic_bar.png',
      'druid_sk_cure': './assets/images/druid_sk_cure.png',
      'druid_bullet': './assets/images/druid_bullet.png',
      'skull_ske': './assets/data/skull_ske.json',
      'skull_tex': './assets/data/skull_tex.json',
      'skull': './assets/images/skull_tex.png'
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
        // 加入lightmap
        this.addDarkLight();
        this.mask = this.alphaLight;
      } else {
        this.alphaLight.visible = !1;
        this.mask = null;
        this.scene.removeChild(this.alphaLight);
        this.alphaLight = null;
      }
    });
  }

  boot() {
    this.dev();
    this.reset();
  }

  create() {
    const staticWorldTexture = this.loader.resources.world.texture;

    let textures: Array<Texture> = [];

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
    this.tilemap.tile.pivot.set(0, 0);

    this.scene.addChild(this.tilemap.tile);

    // 添加地图角色
    this.initialRoles();

    // 添加纵深层
    this.depthmap = new TileMap(0, textures, aliasData.slice(4, 5), { tiledSizeX, tiledSizeY, tileWidth, tileHeight });
    this.depthmap.tile.pivot.set(0, 0);
    this.scene.addChild(this.depthmap.tile);

    // this.addMark(tileWidth, tileHeight);

    // 定义地图layer用于点击
    const layer: any = this.drawStage.generateRect(0xffffff, [0, 0, this.game.camera.width, this.game.camera.height], !1);
    layer.interactive = true;
    layer._events.pointerdown = [];

    // 添加点击layerWrap容器
    const layerWrap = new PIXI['tilemap'].RectTileLayer(1, []);
    layerWrap.addChild(layer);
    this.tilemap.tile.addChild(layerWrap);

    // 生成tween的时间线
    this.gamer.timeline = this.game.add.tweenline();
    this.gamer.paths = [];

    // 监听点击
    layer.on('pointerdown', (e) => {
      this.setWalkPath(e, tileWidth, 0);
    });

    // 幀刷新
    this.update = () => {
      if (!this.gamer.tweening && this.gamer.paths.length) {
        this.gamer.tweening = true;

        // 定义初始方向
        this.roleRunning(this.gamer, tileWidth, tileHeight);
      }
      this.alphaLight && this.alphaLight.position.set(this.gamer.x, this.gamer.y);
      this.cameraUpdate(limitX, limitY);

      if (this.gamer.bullets.length > 0 && this.gamer.target) {
        this.gamer.bullets.forEach((bullet, index) => {
          const atan2 = math.angleToPointer(bullet, null, this.gamer.target);
          bullet.angle = -180 + 180 * atan2 / Math.PI;
          const xDistance = bullet.x - this.gamer.target.x;
          const yDistance = bullet.y - this.gamer.target.y;
          if (Math.abs(xDistance) < 32 && Math.abs(yDistance) < 32) {
            // 这里设定命中后事件
            bullet.alpha = 0;
            this.gamer.bullets.splice(index, 1);

            this.gamer.target.tip.pop();
          } else {
            const vx = -Math.cos(atan2) * this.gamer.bulletSpeed;
            const vy = -Math.sin(atan2) * this.gamer.bulletSpeed;
            bullet.x += vx;
            bullet.y += vy;
          }
        });
      }
    };
    this.game.ticker.start();

    // 若要使用message功能，请先激活
    this.bootMessage();
  }

  // 设置行走路径
  setWalkPath(e, tileWidth, distance: number = 0) {
    const pos = this.game.add.pointer(0, 0);
    let target: any = null;
    if (e.data) {
      pos.x = e.data.global.x;
      pos.y = e.data.global.y;
      target = this.transformPointer(pos, tileWidth)
    } else {
      target = e.pointer;
    }

    const start: Path = {
      pointer: this.gamer.pointer,
      F: 0,
      G: 0,
      H: 0,
      D: 0,
      prev: void 0
    };

    const end = {
      pointer: target
    };

    this.gamer.step = 0;
    this.gamer.pause = false;

    // 之前的路径惯性续行
    if (this.gamer.paths.length) {
      this.gamer.reentry = true;
    }

    // 点击障碍物无法移动或NPC自身
    if (this.isobstacle(end.pointer) || this.isPointerOverlap(start, end)) {
      this.gamer.paths = [];
      return;
    }

    // 設置路徑
    this.gamer.paths = this.astar(start, end, distance);
    this.gamer.start = start;
    this.gamer.end = end;

    // 设置mark
    // this.mark.visible = !0;
    // this.mark.position.set((end.pointer.x + 0.5) * tileWidth, (end.pointer.y + 0.5) * tileHeight);
    // this.mark.alpha = 1;

    // const tween = this.game.add.tween();
    // tween.instance.killTweensOf(this.mark);
    // tween.instance.to(this.mark, 0.25, {
    //   y: this.mark.y + 10,
    //   alpha: 0.2,
    //   ease: tween.linear.easeNone,
    //   repeat: 2,
    //   yoyo: true,
    //   onComplete: () => {
    //     this.mark.visible = !1;
    //   }
    // });

    // 定义行走动画
    this.gamer.role.animation.play('walk').timeScale = 2;
  }

  // 添加点击标记
  addMark(tileWidth, tileHeight) {
    this.mark = this.game.add.image('mark', this.scene, [0.5, 0.5]);
    this.mark.visible = !1;
    this.mark.width = tileWidth * 0.5;
    this.mark.height = tileHeight * 0.5;
  }

  roleRunning(character: PlayerRole, tileWidth: number, tileHeight: number) {

    // 每一格方向判断
    const pointer = character.paths[character.step].pointer;

    this.setRolesDirect(character, character.pointer, pointer);
    character.pointer.set(pointer.x, pointer.y);
    character.timeline.clear();
    character.timeline.to(character, 0.24, {
      x: (pointer.x + 0.5) * tileWidth,
      y: (pointer.y + 0.5) * tileHeight,
      ease: character.timeline.linear.easeNone
    }).call(() => {
      const nextPath = character.paths[this.gamer.step] || character.end;
      character.goingPointer.set(nextPath.pointer.x, nextPath.pointer.y);

      // 更新gamer的地图坐标
      this.gamer.reentry || character.pointer.set(pointer.x, pointer.y);
      character.tweening = false;
      this.gamer.reentry = false;

      // 当行走至路径终点时
      if (character.step === character.paths.length) {
        character.pause ||
          character.role.animation.play('stay');
        character.paths = [];
        character.goingPointer.set(0, 0);
      }
    });
    character.step += 1;
  }

  addDarkLight() {
    this.alphaLight = this.game.add.image('lightmap', this.scene, [0.5, 0.5]);
    this.alphaLight.position.set(this.gamer.x, this.gamer.y);
    this.alphaLight.scale.set(2, 1);
    const tween = this.game.add.tween();
    tween.instance.to(this.alphaLight.scale, 0.95, {
      x: 2.05,
      y: 0.95,
      repeat: 1000,
      ease: tween.cubic.easeInOut,
      yoyo: true,
    });
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
    const stageRes = this.loader.resources;

    // 设定敌对角色
    const skull = new EnemyRole(this, stageRes, 'skull');
    skull.initial(20, 3);
    skull.role.animation.play('stay').timeScale = 1.8;

    // 定义德鲁伊
    this.gamer = new PlayerRole(this, stageRes, 'druid');
    this.gamer.initial(24, 7);
    this.gamer.setFaceToRight();

    this.initialGUI(this.gamer);
  }

  // 设置角色行走面向
  setRolesDirect(gamer: PlayerRole, prev: Point, next: Point) {
    if (prev.x < next.x) {
      gamer.setFaceToRight();
    } else if (prev.x > next.x) {
      gamer.setFaceToLeft();
    }
  }

  // 初始化UI
  initialGUI(character: PlayerRole) {
    this.expbar = new ExpBar(this, character);
    this.addSkillGroup(character);
    const avatar = new KnAvatar(this.game, this, 'avatar', 0xda9e55);
    avatar.setPosition(avatar.avatar_w + 4, avatar.avatar_h + 4);
  }

  // 技能UI组
  addSkillGroup(character) {
    const Gui = this.game.add.group('gui', this);
    character.initSkill(Gui);
    Gui.position.set(this.game.config.width - Gui.width, this.game.config.height - Gui.height * 0.5);
  }

  // 坐标重叠
  isPointerOverlap(start: Path, end: Path) {
    return start.pointer.x === end.pointer.x && start.pointer.y === end.pointer.y;
  }


  // 点击坐标转换
  transformPointer(pos: Point, tileWidth: number) {
    const mapX = pos.x / this.game.world.scale.x + this.scene.pivot.x,
      mapY = pos.y / this.game.world.scale.y + this.scene.pivot.y;
    pos.x = ~~(mapX / tileWidth);
    pos.y = ~~(mapY / tileWidth);
    return pos;
  }

  // A*寻路
  astar(start: Path, end: Path, distance: number = 0) {
    let findFlag: Boolean = true;
    let opens: Array<Path> = [], closed: Array<Path> = [];
    closed.push(start);
    let cur: any = start;

    // 节点相邻
    if (Math.abs(start.pointer.x - end.pointer.x) + Math.abs(start.pointer.y - end.pointer.y) === 1) {
      closed.push(end);
      end.prev = cur;
      findFlag = false;
    }

    // 当前元素不在closed路径中
    if (!this.isExistList(closed, cur)) {
      closed.push(cur);
    }

    if (Math.pow(start.pointer.x - end.pointer.x, 2) + Math.pow(start.pointer.y - end.pointer.y, 2) <= Math.pow(distance, 2)) {
      return [];
    }

    // 循环执行
    while (findFlag && cur) {

      // 获取当前
      let rounds: Array<any> = this.getRound(this.tilemap.size_x, this.tilemap.size_y, cur);
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
            H: Math.abs(rd.x - end.pointer.x) + Math.abs(rd.y - end.pointer.y), // 设置曼哈顿距离
            prev: cur // 设置回溯指针
          };
          p.F = p.G || 0 + (p.H || 0);
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
        return a.F ?? 0 - (b.F ?? 0);
      });

      let oMinF = opens[0];

      let oMinArray = opens.filter((o) => o.F === oMinF.F);

      // 如果opens存在多个最小值，选择离当前点最近的。
      if (oMinArray.length > 1) {
        for (let oma of oMinArray) {
          oma.D = Math.abs(oma.pointer.x - cur.pointer.x) + Math.abs(oma.pointer.y - cur.pointer.y)
        }
        oMinArray.sort((a, b) => a.D ?? 0 - (b.D ?? 0));
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

    let paths: Array<Path> = [], finalPaths: Array<Path> = [];
    if (closed.length > 0) {
      let pathdot: any = closed[closed.length - 1];
      while (pathdot) {
        pathdot.prev && paths.unshift(pathdot);
        pathdot = pathdot.prev;
      }
    }

    // 设定目标远程范围
    for (let path of paths) {
      if (Math.pow(path.pointer.x - end.pointer.x, 2) + Math.pow(path.pointer.y - end.pointer.y, 2) < Math.pow(distance, 2)) {
        break;
      }
      finalPaths.push(path);
    }

    return finalPaths;
  }

  // 获取周边OPEN
  getRound(size_x: number, size_y: number, cur: Path) {
    let rounds: Array<any> = [];

    // 向上检索
    if (cur.pointer.y - 1 >= 0) {
      rounds.push(this.game.add.pointer(cur.pointer.x, cur.pointer.y - 1));
    }

    // 向左检索
    if (cur.pointer.x - 1 >= 0) {
      rounds.push(this.game.add.pointer(cur.pointer.x - 1, cur.pointer.y));
    }

    // 向下检索
    if (cur.pointer.y + 1 < size_y) {
      rounds.push(this.game.add.pointer(cur.pointer.x, cur.pointer.y + 1));
    }

    // 向右检索
    if (cur.pointer.x + 1 < size_x) {
      rounds.push(this.game.add.pointer(cur.pointer.x + 1, cur.pointer.y));
    }

    return rounds;
  }

  // 检测是否在list中已存在
  isExistList(list: Array<Path>, cur) {
    for (let l of list) {
      if (cur.pointer) {
        if (l.pointer.x === cur.pointer.x && l.pointer.y === cur.pointer.y) {
          return true;
        }
      } else {
        if (l.pointer.x === cur.x && l.pointer.y === cur.y) {
          return true;
        }
      }
    }
    return false;
  }

  // 判断是否为障碍
  isobstacle(pointer: Point) {
    const index = pointer.x + this.tilemap.size_x * pointer.y;
    if (this.tilemap.mapData[2].data[index] > 0 && this.tilemap.mapData[3].data[index] === 0) {
      return true;
    } else {
      return false;
    }
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
