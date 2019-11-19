import KnGroup from "../gameobjects/kn_group";
import Game from "../core";
import { Container } from "pixi.js";

class KnScrollMenu extends KnGroup{
  public options: any; // 菜单配置信息
  public game: Game;
  public menus: Array<KnGroup>; // 菜单数组
  constructor(game: Game, parent: Container, options: any) {
    super(game, 'scrollmenu', parent);
    this.options = options;
    this.game = game;
    this.menus = [];
    this.position.set(game.config.half_w, game.config.half_h);
    this.generateMenu();
    this.updateMenusView();
  }

  generateMenu() {
    this.options.forEach((opt: any, index: number) => {
      const menu = this.buildMenu(opt);
      menu.position.set(index * menu.width * 1.5, 0);
      this.menus.push(menu);
    });
  }

  buildMenu(opt: any) {
    const menu = this.game.add.group(`${opt.key}menu`, this);
    const menuIcon = this.game.add.button(opt.key, null, menu, [0.5, 0.5]);
    opt.callback && (menuIcon.next = opt.callback);
    const menuName = this.game.add.section(opt.name, '', 10, menu, {
      padding: 10,
      bg: 0xe5b240
    });
    menuName.x = -menuName.width * 0.5;
    menuName.position.y = menuIcon.height * 0.5 + 10;
    return menu;
  }

  // 更新菜单状态
  updateMenusView() {
    for (let menu of this.menus) {
      let currentX = this.x + menu.x;
      let currentD = this.game.config.half_w - currentX;
      let currentD_ABS = Math.abs(currentD);
      if (currentD_ABS > this.game.config.half_w + menu.width) {
        menu.visible = !1;
      } else {
        menu.visible = !0;
        let scale = 1 - currentD_ABS / (this.game.config.half_w + 300);
        menu.scale.set(scale);
        menu.position.y = currentD_ABS / menu.width * 20;
        menu.angle = currentD / (this.game.config.half_w + menu.width) * 40 * -1;
      }
    }
  }
}

export default KnScrollMenu;