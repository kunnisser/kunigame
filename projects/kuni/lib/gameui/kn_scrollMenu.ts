import KnGroup from "../gameobjects/kn_group";
import Game from "../core";
import { Container, Graphics, Sprite } from "pixi.js";
import { math, rem } from "../utils/common";

class KnScrollMenu extends KnGroup {
  public options: any; // 菜单配置信息
  public game: Game;
  public menuBg?: Graphics | Sprite; // 菜单背景
  public menusGp: KnGroup; // 菜单组
  public menus: Array<KnGroup>; // 菜单数组
  public dragAble: boolean; // 是否可滑动
  public clickAble: boolean; // 可否点击
  public startX: number; // 起始滑动的X坐标
  public distance: number; // 横向滑动的距离
  public bounds: Array<number>; // 滑动范围
  public originW: number;
  public originH: number;
  public anchorW: number; // 处理 锚点变化引起的this.x 变动
  public interval: number; // 菜单间隔
  public cb?: Function; // 外部传入事件
  public bootIndex: number; // 当前激活按钮序号
  constructor(
    game: Game,
    parent: Container,
    options: any,
    anchor?: boolean,
    interval?: number,
    cb?: Function
  ) {
    super(game, "scrollmenu", parent);
    this.options = options;
    this.game = game;
    this.menuBg = void 0;
    this.dragAble = !1;
    this.menus = [];
    this.clickAble = !0;
    this.startX = 0;
    this.distance = 0;
    this.originW = parent.width * 0.5;
    this.originH = parent.height * 0.5;
    this.interval = interval || 1;
    this.bootIndex = 1;
    this.cb = cb;
    if (anchor) {
      this.position.set(this.originW, this.originH);
      this.anchorW = 0;
    } else {
      this.position.set(0, 0);
      this.anchorW = this.originW;
    }
  }

  initial(bg: any) {
    bg.interactive = !0;
    bg.on("pointerdown", this.onDragStart)
      .on("pointerup", (e) => {
        this.onDragEnd(e);
      })
      .on("pointerupoutside", this.onDragEnd)
      .on("pointermove", this.onDragMove);
    this.menuBg = bg;
    this.originW = bg.width * 0.5;
    this.originH = bg.height * 0.5;
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
  };

  onDragMove = (e) => {
    if (this.dragAble) {
      // 横向滑动距离
      this.distance = (e.data.global.x - this.startX) * 10;

      // 滑动过程禁用点击
      this.clickAble = Math.abs(this.distance) < 0.8 ? !0 : !1;

      // 更新菜单显示状态
      this.menusGp.x += this.distance;

      this.startX = e.data.global.x;

      this.menusGp.x = math.clamp(this.menusGp.x, ...this.bounds);
      this.updateMenusView();
    }
  };

  onDragEnd = (e) => {
    this.dragAble = !1;
    const menuBetweenDistance = Math.abs(
      this.bounds[0] / (this.menus.length - 1)
    );
    const currentIndex = Math.abs(
      Math.round((this.menusGp.x * (this.menus.length - 1)) / this.bounds[0])
    );
    this.bootIndex = currentIndex;
    const tween: any = this.game.add.tween();
    tween.instance.to(this.menusGp, 0.45, {
      x: -currentIndex * menuBetweenDistance,
      ease: tween.bounce.easeOut,
      onUpdate: () => {
        this.updateMenusView();
      }
    });
    this.cb && this.cb(currentIndex);
  };

  generateMenu() {
    this.menusGp = this.game.add.group("menuGp", this);
    this.menusGp.y = 0;
    this.options.forEach((opt: any, index: number) => {
      const menu = this.buildMenu(opt, index);
      menu.position.set(index * menu.width * this.interval, 0);
      this.menus.push(menu);
    });
    const { length } = this.menus;
    this.bounds = [-this.menusGp.width + this.menus[length - 1].width, 0];
    const menuBetweenDistance = Math.abs(
      this.bounds[0] / (this.menus.length - 1)
    );
    this.menusGp.x = -menuBetweenDistance;
  }

  buildMenu(opt: any, index: number) {
    const menu: KnGroup = this.game.add.group(`${opt.key}menu`, this.menusGp);
    const menuIcon = this.game.add.button(
      "tipMenu",
      opt.key,
      null,
      menu,
      [0.5, 0.5],
      opt.tipkey
    );
    menuIcon.tip &&
      menuIcon.tip.position.set(
        -menuIcon.width * 0.25,
        -menuIcon.height * 0.25
      );
    menuIcon.start = (e) => {
      this.onDragStart(e);
    };
    menuIcon.outside = (e) => {
      // 处理按钮和滑动背景的判断冲突
      const isContainBg = this.menuBg?.containsPoint(e.data.global);
      isContainBg || this.onDragEnd(e);
    };
    menuIcon.next = (e) => {
      this.onDragEnd(e);

      // 滑动状态不可点击，停止滑动再触发点击事件
      this.clickAble && opt.callback && index === this.bootIndex && opt.callback();
    };

    menuIcon.cancel = (e) => {
      this.onDragEnd(e);
    };

    const menuName = this.game.add.section(
      opt.name,
      "",
      Math.round(menuIcon.width / 6),
      menu,
      {
        padding: [rem(15), rem(15)],
        bg: 0xe5b240
      }
    );
    menuName.x = -menuName.width * 0.5;
    menuName.position.y = menuIcon.height * 0.5;
    return menu;
  }

  // 更新菜单状态
  updateMenusView() {
    for (let menu of this.menus) {
      let currentX = this.anchorW + this.x + menu.x + this.menusGp.x;
      let currentD = this.originW - currentX;
      let currentD_ABS = Math.abs(currentD);
      if (currentD_ABS > this.originW + menu.width * 0.5) {
        // 图片划出边界取消混合叠加渲染
        menu.visible = !1;
      } else {
        menu.visible = !0;
        let scale = 1 - currentD_ABS / (this.originW + 500);
        menu.scale.set(scale);
        menu.position.y = (currentD_ABS / menu.width) * 10;
        menu.angle = (currentD / (this.originW + menu.width)) * 20 * -1;
      }
    }
  }
}

export default KnScrollMenu;
