import * as PIXI from 'pixi.js';
window['PIXI'] = PIXI;
import 'pixi-tilemap';

class TileMap extends PIXI['tilemap'].CompositeRectTileLayer{
  public alias: Object;
  public textures: Array<PIXI.Texture>;
  public size: number;
  public mapData: Array<number>;
  public mapWall: Number; // 为墙体的瓷砖类型
  position: any;
  constructor (zindex: Number, textures: Array<PIXI.Texture>, alias: Object, size: number) {
    super(0, textures);
    this.alias = alias;
    this.textures = textures;
    this.size = size;
    this.mapData = [];
    this.buildTilemap();
    this.mapWall = 3;
    return this;
  }

  public buildTilemap () {
    this.clear();
    this.mapData = this.alias['layers'][0].data;
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

  }

  // 细胞自动机
  public randomMapGenerator () {
    for (let [index, md] of this.mapData.entries()) {
      this.checkNeighborWalls(index, md);
    }
  }

  public checkNeighborWalls (index: number, md: number) {

  }
}

export default TileMap;