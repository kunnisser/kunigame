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
    this.anchor.set(...anchor);
    this.id = id;
    this.name = id;
  }
}

export default KnText;
