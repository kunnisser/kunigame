import * as PIXI from 'pixi.js';
window['PIXI'] = PIXI;
import 'pixi-tilemap';

class TileMap extends PIXI['tilemap'].CompositeRectTileLayer{
  public alias: Object;
  public textures: Array<PIXI.Texture>;
  public size: number;
  public tileWidth: number;
  public mapData: Array<number>;
  position: any;
  constructor (zindex: Number, textures: Array<PIXI.Texture>, alias: Object, size: number, tileWidth: number) {
    super(0, textures);
    this.alias = alias;
    this.textures = textures;
    this.size = size;
    this.tileWidth = tileWidth;
    this.mapData = [];
    this.buildTilemap();
    return this;
  }

  public buildTilemap () {
    this.clear();
    this.mapData = this.alias['layers'][0].data;
    const textures = this.textures;
    let index = 0;

    // 遍历data数据，根据layer数据中的类型下标添加对应的texture。
    for (let md of this.mapData) {
      this.addFrame(textures[md - 1], this.size * (index % this.tileWidth), this.size * ~~(index / this.tileWidth));
      index += 1;
    }
  }
}

export default TileMap;