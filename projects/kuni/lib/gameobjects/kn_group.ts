import { Container } from "pixi.js";

class KnGroup extends Container {
  public game: object;
  public name: string;
  constructor(game: object, name: string, parent: any) {
    super();
    this.game = game;
    this.name = name;
    parent.addChild(this);
    this.x = 0;
    this.y = 0;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // @align - true 统一锚点居中
  add(childs: Array<any>, align: boolean) {
    const handler = align
      ? (chd: any) => {
          chd.anchor && chd.anchor.set(0.5);
          this.addChild(chd);
        }
      : (chd: any) => {
          this.addChild(chd);
        };
    for (let chd of childs) {
      handler(chd);
    }
  }

  update() {}
}

export default KnGroup;
