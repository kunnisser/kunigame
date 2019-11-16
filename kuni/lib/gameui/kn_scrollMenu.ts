import KnGroup from "../gameobjects/kn_group";
import Game from "../core";
import { Container } from "pixi.js";

class KnScrollMenu extends KnGroup{
  public options: any;
  public game: Game;
  constructor(game: Game, parent: Container, options: any) {
    super(game, 'scrollmenu', parent);
    this.options = options;
    this.game = game;
    this.position.set(game.config.half_w, game.config.half_h);
    this.generateMenu();
  }

  generateMenu() {
    this.options.forEach((opt: any, index: number) => {
      const menu = this.buildMenu(opt);
      menu.position.set(index * 100, 0);
    });
  }

  buildMenu(opt: any) {
    const menu = this.game.add.group(`${opt.key}menu`, this);
    const menuIcon = this.game.add.image(opt.key, menu, [0.5, 0.5]);
    const menuName = this.game.add.image(opt.name, menu, [0.5, 0.5]);
    menuName.position.y = menuIcon.height * 0.5 + 10;
    return menu;
  }
}

export default KnScrollMenu;