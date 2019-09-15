import * as PIXI from 'pixi.js';
window['PIXI'] = PIXI;
import 'pixi-tilemap';

class TileMap extends PIXI.tilemap.CompositeRectTileLayer{
  public alias: Object;
  public textures: Array<PIXI.Texture>;
  public size: number;
  constructor (zindex: Number, textures: Array<PIXI.Texture>, alias: Object) {
    super(0, textures);
    this.alias = alias;
    this.textures = textures;
    this.size = 32;
    this.buildTilemap();
    return this;
  }

  public buildTilemap () {
    this.clear();
    const mapData = this.alias['layers'][0].data;
    const textures = this.textures;
    let index = 0;

    // 遍历data数据，根据layer数据中的类型下标添加对应的texture。
    for (let md of mapData) {
      this.addFrame(textures[md - 1], this.size * (index % 32), this.size * Math.floor(index / 32));
      index += 1;
    }
  }
}

export default TileMap;