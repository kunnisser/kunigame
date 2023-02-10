import { Text } from "pixi.js";
import Game from "../core";

class KnText extends Text {
  game: Game;
  constructor(
    game: Game,
    content: string,
    style: object,
    anchor: Array<number>
  ) {
    super(content, style);
    this.game = game;
    this.resolution = window.devicePixelRatio;
    this.anchor.set(...anchor);
  }
}

export default KnText;
