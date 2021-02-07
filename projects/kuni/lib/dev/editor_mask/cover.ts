/*
 * @Author: kunnisser
 * @Date: 2021-02-04 16:00:55
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-07 17:34:13
 * @FilePath: /kunigame/projects/kuni/lib/dev/editor_mask/cover.ts
 * @Description: ---- 编辑蒙层 ----
 */

import { Graphics, Text } from "pixi.js";
import Game from "../../core";
import KnGroup from "../../gameobjects/kn_group";

class CoverMask extends KnGroup {
  public game: Game;
  public curTip_X: number;
  public curTip_Y: number;
  public start_X: number;
  public start_Y: number;
  public isDragging: boolean;
  constructor(game: Game, parent: PIXI.Container) {
    super(game, 'coverMask', parent);
    this.game = game;
    this.start_X = 0;
    this.start_Y = 0;
    this.curTip_X = 0;
    this.curTip_Y = 0;
    this.isDragging = false;
    this.initial();
  }

  initial() {
    this.generateGrid();
    this.bindControllerHandler();
  }

  /**
   * @description: 绘制网格线
   * @param {void}
   * @return {void}
   */
  generateGrid(): void {
    const width: number = this.game.config.width ?? 0;
    const height: number = this.game.config.height ?? 0;
    const size: number = 100;
    const border: IBorder = {
      width: 1,
      color: 0xffffff,
      alpha: 0.15,
    }
    const lines: Graphics = this.game.add.graphics().generateLine(border);
    const texts_x: Array<Text> = [];
    const texts_y: Array<Text> = [];

    // 绘制横向线
    for (let y = size, l = height; y < l; y += size) {
      lines.moveTo(0, y);
      lines.lineTo(width, y);
      const scaleText = this.game.add.text(`${y}`, {
        fontSize: 14,
        fontWeight: 'bold',
        fill: 0x8ac007,
      }, [0, 0.5]);
      scaleText.position.set(0, y);
      texts_y.push(scaleText);
    }

    // 绘制竖向线
    for (let x = size, l = width; x < l; x += size) {
      lines.moveTo(x, 0);
      lines.lineTo(x, height);
      this.addChild(lines);
      const scaleText = this.game.add.text(`${x}`, {
        fontSize: 14,
        fontWeight: 'bold',
        fill: 0x8ac007,
      }, [0.5, 0]);
      scaleText.position.set(x, 0);
      texts_x.push(scaleText);
    }
    this.addChild(...texts_x);
    this.addChild(...texts_y);
  }

  /**
   * @description: 绑定操作监听事件
   * @param {*}
   * @return {*}
   */
  bindControllerHandler() {
    const SCALE_VALUE: number = 1000;
    let scaleVal: number = SCALE_VALUE;
    // 原先画布的缩放
    const COVER_SCALE = this.game.world.scale.x;
    // 缩放系数
    let scale: number = 1;
    const canvas: any = this.game.view.children[0];
    // 绑定move事件
    const posTextTip = this.game.add.text(``, {
      fontSize: 14,
      fontWeight: 'bold',
      fill: 0x8ac007,
      stroke: 0xffffff,
      strokeThickness: 6,
    }, [0, 0.5]);
    canvas.addEventListener('mousedown', (e) => {
      console.log(e);
      this.isDragging = true;
      this.start_X = e.offsetX / (COVER_SCALE * scale);
      this.start_Y = e.offsetY / (COVER_SCALE * scale);
    });
    canvas.addEventListener('mousemove', (e) => {
      this.curTip_X = e.offsetX / (COVER_SCALE * scale);
      this.curTip_Y = e.offsetY / (COVER_SCALE * scale);
      posTextTip.text = `${~~this.curTip_X}, ${~~this.curTip_Y}`;
      posTextTip.position.set(this.curTip_X, this.curTip_Y);
      if (this.isDragging) {

      }
    });
    // 绑定wheel事件
    canvas.addEventListener('wheel', (e) => {
      scaleVal -= e.deltaY;
      if (scaleVal < SCALE_VALUE) {
        scaleVal = SCALE_VALUE;
      }
      scale = scaleVal / SCALE_VALUE;
      this.scale.set(COVER_SCALE * scale);
      this.game.world.scale.set(COVER_SCALE * scale);
    });
    this.addChild(posTextTip);
  }
}

export default CoverMask;
