/*
 * @Author: kunnisser
 * @Date: 2021-02-04 16:00:55
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-04 17:38:45
 * @FilePath: /kunigame/projects/kuni/lib/dev/editor_mask/cover.ts
 * @Description: ---- 编辑蒙层 ----
 */

import { Graphics } from "pixi.js";
import Game from "../../core";
import KnGroup from "../../gameobjects/kn_group";

class CoverMask extends KnGroup {
  public game: Game;
  constructor(game: Game, parent: PIXI.Container) {
    super(game, 'coverMask', parent);
    this.game = game;
    this.initial();
  }

  initial() {
    this.generateGrid();
    this.bindListener();
  }

  /**
   * @description: 绘制网格线
   * @param {void}
   * @return {void}
   */
  generateGrid(): void {
    const width: number = this.game.camera.width ?? 0;
    const height: number = this.game.camera.height ?? 0;
    const size: number = 50;
    const border: IBorder = {
      width: 1,
      color: 0xffffff,
      alpha: 1,
    }
    const lines: Graphics = this.game.add.graphics().generateLine(border);

    // 绘制横向线
    for (let y = size, l = height; y < l; y += size) {
      lines.moveTo(0, y);
      lines.lineTo(width, y);
    }

    // 绘制竖向线
    for (let x = size, l = width; x < l; x += size) {
      lines.moveTo(x, 0);
      lines.lineTo(x, height);
    }
    this.addChild(lines);
  }

  /**
   * @description: 绑定操作监听事件
   * @param {*}
   * @return {*}
   */
  bindListener(): void {
    let scale: number = 1;
    const SCALE_VALUE: number = 1000;
    let scaleVal: number = SCALE_VALUE;

    this.game.view.addEventListener('wheel', (e) => {
      scaleVal -= e.deltaY;
      if (scaleVal < SCALE_VALUE) {
        scaleVal = SCALE_VALUE;
      }
      scale = scaleVal / SCALE_VALUE;
      console.log(scale);
    });
  }
}

export default CoverMask;