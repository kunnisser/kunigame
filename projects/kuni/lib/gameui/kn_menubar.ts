import KnGroup from "../gameobjects/kn_group";
import Game from "../core";
import { Container } from "pixi.js";

class KnMenuBar extends KnGroup{
  public game: Game;
  public bars: Array<KnGroup>;
  public options: Array<any>;
  constructor(game: Game, parent: Container, options: Array<any>, interval?: number) {
    super(game, 'footbar', parent);
    this.game = game;
    this.options = options;
    this.generateBar(parent, interval || 0);
  }

  generateBar(parent: Container, interval: number) {
    const start = -Math.floor(this.options.length / 2);
    this.options.forEach((opt, index) => {
      const btnGp = this.game.add.group(`${opt.name}_footbar`, this);
      const btnIcon = this.game.add.button(opt.icon, null, btnGp, [0.5, 0.5]);
      btnIcon.next = () => {
        opt.handler && opt.handler();
      }
      btnIcon.x = (index + start) * btnIcon.width * (1 + interval);
    });
  }
}

export default KnMenuBar;