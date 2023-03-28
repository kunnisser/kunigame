import { Loader } from "pixi.js";
import Game from "../core";

class KnLoader extends Loader {
  public game: Game;
  public preloader: any;
  loader: any;
  constructor(game: Game) {
    super();
    this.game = game;
    this.preloader = Loader.shared;
  }

  // 队列载入
  filling(resources: any) {
    for (let key of Object.keys(resources)) {
      if (!this.preloader.resources[key]) {
        this.preloader.add(key, resources[key]);
      }
    }
  }
}

export default KnLoader;
