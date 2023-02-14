import { Text } from "pixi.js";
import Game from "../core";

class KnText extends Text {
  game: Game;
  public id: String;
  constructor(
    id: string,
    game: Game,
    content: string,
    style: object,
    anchor: Array<number>
  ) {
    super(content, style);
    this.game = game;
    this.resolution = window.devicePixelRatio;
    this.anchor.set(...anchor);
    this.id = id;
  }
}

export default KnText;
