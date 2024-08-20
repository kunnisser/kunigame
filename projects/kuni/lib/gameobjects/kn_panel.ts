/*
 * @Author: kunnisser
 * @Date: 2024-08-13 11:11:10
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-08-20 17:18:10
 * @FilePath: /kunigame/projects/kuni/lib/gameobjects/kn_panel.ts
 * @Description: ---- 面板容器 ----
 */

import { Container } from "pixi.js";
import KnSprite from "./kn_sprite";
import Game from "../core";

class KnPanel extends Container {
  public game: Game;
  public name: string;
  _bg: KnSprite;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  point: PIXI.Point;
  paddingBottom: number;
  maxWidth: number;
  constructor(game: Game, name: string, parent?: any) {
    super();
    this.game = game;
    this.name = name;
    parent && parent.addChild(this);
    this.x = 0;
    this.y = 0;
    this.maxWidth = 0;
    this.point = new PIXI.Point(0, 0);
  }

  set background(bg: KnSprite) {
    this._bg = bg;
    this.width = bg.width;
    this.height = bg.height;
    this.addChild(bg);
  }

  get background() {
    return this._bg;
  }

  /**
   * @description: 设置panel全局定位，手动设置锚点居中
   * @param {number} x
   * @param {number} y
   * @return {*}
   */
  setPosition(x: number, y: number) {
    this.x = x - (this._bg ? this._bg.width * 0.5 : 0);
    this.y = y - (this._bg ? this._bg.height * 0.5 : 0);
  }

  /**
   * @description: 设置内边距方法
   * @param {number} padding 内边距
   * @return {void}
   */
  setPadding(padding: number) {
    const scalePadding = padding * this.game.gameScale;
    this.paddingLeft = scalePadding;
    this.paddingRight = this.width - scalePadding;
    this.paddingTop = scalePadding;
    this.paddingBottom = this.height - scalePadding;
    this.point.y = this.paddingTop;
    this.point.x = this.paddingLeft;
    this.maxWidth = this.width - scalePadding * 2;
  }

  // 横向排版
  addRow(children: Array<any>, align: string, space?: number) {
    const marginSpace = space || 0;
    const alignAction = {
      left: (child: any) => {
        const childWidth: number = child.width;
        this.point.x += marginSpace + childWidth * child.anchor.x;
        child.x = this.point.x;
        child.y = this.point.y;
        this.point.x += childWidth * (1 - child.anchor.x);
        return child;
      }
    };
    const layoutChildren = children.map((child) => {
      return alignAction[align] && alignAction[align](child);
    });
    this.addChild(...layoutChildren);
  }

  // 纵向排版
  addColumn(children: Array<any>, align: string, space?: number) {
    const marginSpace = space || 0;
    const alignAction = {
      left: (child: any) => {
        const childHeight: number = child.height;
        this.point.y += marginSpace + childHeight * child.anchor.y;
        child.x = this.paddingLeft;
        child.y = this.point.y;
        this.point.y += childHeight * (1 - child.anchor.y);
        return child;
      },
      center: (child: any) => {
        const childHeight: number = child.height;
        this.point.y += marginSpace + childHeight * child.anchor.y;
        child.x = this.width * 0.5;
        child.anchor.x = 0.5;
        child.y = this.point.y;
        this.point.y += childHeight * (1 - child.anchor.y);
        return child;
      }
    };
    const layoutChildren = children.map((child) => {
      return alignAction[align] && alignAction[align](child);
    });
    this.addChild(...layoutChildren);
  }

  update() {}
}

export default KnPanel;
