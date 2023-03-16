import { Loader } from "pixi.js";
import Game from "../core";

class KnLoader extends Loader {
  public game: Game;
  loader: any;
  constructor(game: Game) {
    super();
    this.game = game;
  }

  static preloader = Loader.shared;

  // 队列载入
  filling(resources: any) {
    for (let key of Object.keys(resources)) {
      if (!this.game.loader.resources[key]) {
        this.add(key, resources[key]);
      }
    }
  }
}

export default KnLoader;
