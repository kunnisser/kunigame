import * as PIXI from 'pixi.js';
window['PIXI'] = PIXI;
import 'pixi-tilemap';

class TileMap extends PIXI['tilemap'].CompositeRectTileLayer{
  public alias: Object;
  public textures: Array<PIXI.Texture>;
  public size_x: number;
  public size_y: number;
  public tileWidth: number;
  public tileHeight: number;
  public mapData: Array<number>;
  public multeMapData: Array<Array<any>>;
  public mapWall: Number; // 为墙体的瓷砖类型
  public staticMap: Boolean; // 是否为固定地图数据
  position: any;
  constructor (zindex: Number, textures: Array<PIXI.Texture>, alias: Object, options: any) {
    super(0, textures);
    this.alias = alias;
    this.textures = textures;
    this.size_x = options.tiledSizeX;
    this.size_y = options.tiledSizeY;
    this.tileWidth = options.tileWidth;
    this.tileHeight = options.tileHeight;
    this.mapData = [];
    this.mapWall = 3;
    this.staticMap = false;
    this.buildTilemap();
    return this;
  }

  // 构建tilemap数据及地图
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
      this.addFrame(textures[md - 1], this.tileWidth * (index % this.size_x), this.tileHeight * ~~(index / this.size_x));
      index += 1;
    }
  }

  // 获取多维地图数据(最外一层为围墙，自动机效果，从内部一圈开始判断)
  public generateMulteMapData () {
    this.mapData = Array.from({length: this.size_x * this.size_y}, (t, v) => 1);

    this.multeMapData = [];
    let tmpArr = [this.mapWall];
    for (let i = 1, l = this.mapData.length; i <= l; i++) {
      if (i % this.size_x === 0) {
        tmpArr.length && this.multeMapData.push(tmpArr);
        tmpArr = [];
      }

      if (~~(Math.random() * 100) < 40 || this.isMapBoundary(this.multeMapData, tmpArr)) {
        tmpArr.push(this.mapWall);
      } else {
        tmpArr.push(this.mapData[i]);
      }
    }
  }

  // 判断是否为地图边界
  public isMapBoundary(multe: Array<Array<number>>, tmpArr: Array<Number>) {
    if (multe.length === 0 || multe.length === this.size_y - 1) {
      return true;
    }
    if (tmpArr.length === 0 || tmpArr.length === this.size_x - 1) {
      return true;
    }
    return false;
  }

  // 自动生成随机地图（细胞自动机）
  public randomMapGenerator () {
    this.multeMapData.forEach((mdArr, col) => {
      mdArr.forEach((md, row) => {
        // 只计算边界内的地图块
        if (col !== 0 && (col !== this.size_y - 1) && row !== 0 && (row !== this.size_x - 1)) {
          const wall = this.checkNeighborWalls([col, row]);
          const outwall = this.checkIntervalWalls([col, row]) - this.checkNeighborWalls([col, row]);
          if (md === this.mapWall) {
            wall >= 4 ? (this.multeMapData[col][row] = this.mapWall) : (this.multeMapData[col][row] = 1);
          } else {
            wall >= 5 ? (this.multeMapData[col][row] = this.mapWall) : (this.multeMapData[col][row] = 1);
            outwall <=2 && (this.multeMapData[col][row] = 2);
          }
        }
      });
    });
  }

  public checkNeighborWalls(point: Array<number>) {
    let countWall = 0;
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const checkMd = this.multeMapData[point[0] + y] && this.multeMapData[point[0] + y][point[1] + x];
        if (x !== 0 || y !== 0) {
          (checkMd === this.mapWall || checkMd === 2) && (countWall += 1);
        }
      }
    }
    return countWall;
  }

  public checkIntervalWalls(point: Array<number>) {
    let countWall = 0;
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        const checkMd = this.multeMapData[point[0] + y] && this.multeMapData[point[0] + y][point[1] + x];
        if (x !== 0 || y !== 0) {
          (checkMd === this.mapWall || checkMd === 2) && (countWall += 1);
        }
      }
    }
    return countWall;
  }
}

export default TileMap;