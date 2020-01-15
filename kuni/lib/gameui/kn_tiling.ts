import { TilingSprite, Texture } from 'pixi.js';
import KnGroup from '../gameobjects/kn_group';
import KnScene from '../gameobjects/kn_scene';
class KnTiling extends TilingSprite{
  constructor(texture: Texture, width: number, height: number) {
    super(texture, width, height);
  }

  initialTiling(parent: KnGroup | KnScene) {
    parent.addChild(this);
  }

  set tileX(x) {
    this.tilePosition.x = x;
  }

  get tileX() {
    return this.tilePosition.x;
  }

  set tileY(y) {
    this.tilePosition.x = y;
  }

  get tileY() {
    return this.tilePosition.y;
  }

  moveX(v: number) {
    this.tileX = this.tilePosition.x + v;
  }

  moveY(v: number) {
    this.tileX = this.tilePosition.y + v;
  }
}

export default KnTiling;