import * as PIXI from 'pixi.js';
window['PIXI'] = PIXI;
import 'pixi-tilemap';

class TileMap extends PIXI['tilemap'].CompositeRectTileLayer{
  public alias: Object;
  public textures: Array<PIXI.Texture>;
  public size: number;
  public mapData: Array<number>;
  public multeMapData: Array<Array<any>>;
  public mapWall: Number; // 为墙体的瓷砖类型
  public staticMap: Boolean; // 是否为固定地图数据
  position: any;
  constructor (zindex: Number, textures: Array<PIXI.Texture>, alias: Object, size: number) {
    super(0, textures);
    this.alias = alias;
    this.textures = textures;
    this.size = size;
    this.mapData = [];
    this.mapWall = 3;
    this.staticMap = false;
    this.buildTilemap();
    return this;
  }

  public buildTilemap () {
    this.clear();
    if (this.staticMap) {
      this.mapData = this.alias['layers'][0].data;
    } else {
      this.generateMulteMapData();
      let rollRd = 5;
      while (rollRd > 0) {
        rollRd -= 1;
        this.randomMapGenerator();
      }
      this.mapData = [].concat(...this.multeMapData);
    }
    const textures = this.textures;
    let index = 0;

    // 遍历data数据，根据layer数据中的类型下标添加对应的texture。
    for (let md of this.mapData) {
      this.addFrame(textures[md - 1], this.size * (index % this.size), this.size * ~~(index / this.size));
      index += 1;
    }
  }

  // 获取多维地图数据
  public generateMulteMapData () {
    for (let i = 0, l = 1024; i < l; i++) {
      if (~~(Math.random() * 100) < 48) {
        this.mapData.push(3);
      } else {
        this.mapData.push(1);
      }
    }

    this.multeMapData = [];
    let tmpArr = [this.mapData[0]];
    for (let i = 1, l = this.mapData.length; i <= l; i++) {
      if (i % this.size === 0) {
        tmpArr.length && this.multeMapData.push(tmpArr);
        tmpArr = [];
      }

      tmpArr.push(this.mapData[i]);
    }
  }

  // 自动生成随机地图（细胞自动机）
  public randomMapGenerator () {
    this.multeMapData.forEach((mdArr, col) => {
      mdArr.forEach((md, row) => {
        const wall = this.checkNeighborWalls([col, row]);
        if (md === 3) {
          wall >= 4 ? (this.multeMapData[col][row] = 3) : (this.multeMapData[col][row] = 1);
        } else {
          wall >= 5 ? (this.multeMapData[col][row] = 3) : (this.multeMapData[col][row] = 1);
        }
      });
    });
  }

  public checkNeighborWalls(point: Array<number>) {
    let countWall = 0;
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const checkMd = this.multeMapData[point[1] + x] && this.multeMapData[point[1] + x][point[0] + y];
        if (checkMd && (x !== 0 || y !== 0)) {
          checkMd === this.mapWall && (countWall += 1);
        }
      }
    }
    return countWall;
  }
}

export default TileMap;