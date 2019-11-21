import KnGroup from "../gameobjects/kn_group";
import Game from "../core";
import { Container, Graphics, Sprite } from "pixi.js";
import { math } from 'ts@/lib/utils/common';

class KnScrollMenu extends KnGroup {
  public options: any; // 菜单配置信息
  public game: Game;
  public menuBg: Graphics | Sprite; // 菜单背景
  public menusGp: KnGroup; // 菜单组
  public menus: Array<KnGroup>; // 菜单数组
  public dragAble: boolean; // 是否可滑动
  public clickAble: boolean; // 可否点击
  public startX: number; // 起始滑动的X坐标
  public distance: number; // 横向滑动的距离
  public bounds: Array<number>; // 滑动范围
  constructor(game: Game, parent: Container, options: any) {
    super(game, 'scrollmenu', parent);
    this.options = options;
    this.game = game;
    this.menuBg = null;
    this.dragAble = !1;
    this.menus = [];
    this.clickAble = !0;
    this.startX = 0;
    this.distance = 0;
    this.position.set(game.config.half_w, game.config.half_h);
  }

  initial(bg: any) {
    this.menuBg = bg;
    bg.interactive = !0;
    bg.on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointerupoutside', this.onDragEnd)
      .on('pointermove', this.onDragMove);
    this.appendMenus();
  }

  appendMenus() {
    this.generateMenu();
    this.updateMenusView();
  }

  onDragStart = (e) => {
    this.dragAble = !0;
    this.clickAble = !0;
    this.startX = e.data.global.x;
  }

  onDragMove = (e) => {
    if (this.dragAble) {

      // 横向滑动距离
      this.distance = (e.data.global.x - this.startX) / 25;
      
      // 滑动过程禁用点击
      this.clickAble = Math.abs(this.distance) < 0.2 ? !0 : !1;

      // 更新菜单显示状态
      this.menusGp.x += this.distance;
      this.menusGp.x = math.clamp(this.menusGp.x, ...this.bounds);
      this.updateMenusView();
    }
  }

  onDragEnd = (e) => {
    this.dragAble = !1;
    const menuBetweenDistance = Math.abs (this.bounds[0] / (this.menus.length - 1));
    const currentIndex = Math.abs(Math.round(this.menusGp.x * (this.menus.length - 1) / this.bounds[0]));
    const tween: any = this.game.add.tween();
    tween.instance.to(this.menusGp, 0.2, {
      x: -currentIndex * menuBetweenDistance,
      ease: tween.bounce.easeOut,
      onUpdate: () => {
        this.updateMenusView();
      }
    });
  }

  generateMenu() {
    this.menusGp = this.game.add.group('menuGp', this);
    this.options.forEach((opt: any, index: number) => {
      const menu = this.buildMenu(opt);
      menu.position.set(index * menu.width * 1.5, 0);
      this.menus.push(menu);
    });
    const {length} = this.menus;
    this.bounds = [-this.menusGp.width + this.menus[length - 1].width, 0];
  }

  buildMenu(opt: any) {

    const menu: KnGroup = this.game.add.group(`${opt.key}menu`, this.menusGp);
    const menuIcon = this.game.add.button(opt.key, null, menu, [0.5, 0.5]);
    menuIcon.start = this.onDragStart;
    menuIcon.outside = () => {
      this.dragAble = !1;
    };
    menuIcon.next = (e) => {
      this.onDragEnd(e);

      // 滑动状态不可点击，停止滑动再触发点击事件
      this.clickAble && opt.callback && opt.callback();
    }
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
      let currentX = this.x + menu.x + this.menusGp.x;
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