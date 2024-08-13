/*
 * @Author: kunnisser
 * @Date: 2024-08-13 11:11:10
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-08-13 17:45:32
 * @FilePath: /kunigame/projects/kuni/lib/gameobjects/kn_panel.ts
 * @Description: ---- 面板容器 ----
 */

import { Container } from "pixi.js";
import KnSprite from "./kn_sprite";

class KnPanel extends Container {
  public game: object;
  public name: string;
  _bg: KnSprite;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  point: PIXI.Point;
  space: number;
  constructor(game: object, name: string, parent?: any) {
    super();
    this.game = game;
    this.name = name;
    parent && parent.addChild(this);
    this.x = 0;
    this.y = 0;
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
    this.paddingLeft = padding;
    this.paddingRight = this.width - padding;
    this.paddingTop = padding;
    this.paddingTop = this.height - padding;
    this.point.y = this.paddingTop;
  }

  setSpace(space: number) {
    this.space = space;
  }

  // 排版
  add(children: Array<any>, align: string) {
    const alignAction = {
      left: (child: any) => {
        child.x = this.paddingLeft + this.point.x;
        child.y = this.point.y;
        this.point.y += child.height + this.space;
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
