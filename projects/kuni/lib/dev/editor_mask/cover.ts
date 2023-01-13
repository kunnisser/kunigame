/*
 * @Author: kunnisser
 * @Date: 2021-02-04 16:00:55
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-01-11 13:30:08
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
  public move_X: number;
  public move_Y: number;
  public isDragging: boolean;
  public actionMask: Graphics;
  constructor(game: Game, parent: PIXI.Container) {
    super(game, "coverMask", parent);
    this.game = game;
    this.start_X = 0;
    this.start_Y = 0;
    this.curTip_X = 0;
    this.curTip_Y = 0;
    this.move_X = 0;
    this.move_Y = 0;
    this.isDragging = false;
    this.initial();
  }

  initial() {
    this.generateGrid();
    this.actionMask = this.addActionArea();
    this.bindControllerHandler(this.actionMask);
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
      alpha: 0.15
    };
    const lines: Graphics = this.game.add.graphics().generateLine(border);
    const texts_x: Array<Text> = [];
    const texts_y: Array<Text> = [];

    // 绘制横向线
    for (let y = size, l = height; y < l; y += size) {
      lines.moveTo(0, y);
      lines.lineTo(width, y);
      const scaleText = this.game.add.text(
        `${y}`,
        {
          fontSize: 14,
          fontWeight: "bold",
          fill: 0x8ac007
        },
        [0, 0.5]
      );
      scaleText.position.set(0, y);
      texts_y.push(scaleText);
    }

    // 绘制竖向线
    for (let x = size, l = width; x < l; x += size) {
      lines.moveTo(x, 0);
      lines.lineTo(x, height);
      this.addChild(lines);
      const scaleText = this.game.add.text(
        `${x}`,
        {
          fontSize: 14,
          fontWeight: "bold",
          fill: 0x8ac007
        },
        [0.5, 0]
      );
      scaleText.position.set(x, 0);
      texts_x.push(scaleText);
    }
    this.addChild(...texts_x);
    this.addChild(...texts_y);
  }

  /**
   * @description: 添加操作蒙版
   * @param {*}
   * @return {Graphics} actionMask 返回操作蒙层
   */
  addActionArea(): Graphics {
    const actionMask: Graphics = this.game.add.graphics();
    actionMask.hitArea = new PIXI.Rectangle(
      0,
      0,
      this.game.config.width,
      this.game.config.height
    );
    actionMask.interactive = true;
    this.addChild(actionMask);
    actionMask.position.set(0, 0);
    return actionMask;
  }

  /**
   * @description: 绑定操作监听事件集
   * @param {*}
   * @return {*}
   */
  bindControllerHandler(mask: Graphics): void {
    const SCALE_VALUE: number = 1000;
    let scaleVal: number = SCALE_VALUE;
    // 原先画布的缩放
    const COVER_SCALE = this.game.world.scale.x;

    // 缩放系数
    let scale: number = 1;

    const canvas: any = this.game.view.children[0];

    // 绑定move事件
    const posTextTip = this.game.add.text(
      ``,
      {
        fontSize: 14,
        fontWeight: "bold",
        fill: 0x8ac007,
        stroke: 0xffffff,
        strokeThickness: 6
      },
      [0.5, 0.5]
    );

    // 控制鼠标划入面板监听事件
    let mouseIn: boolean = false;

    mask.on("mouseout", (e: MouseEvent) => {
      mouseIn = false;
      posTextTip.visible = mouseIn;
    });

    mask.on("mouseover", (e: any) => {
      mouseIn = true;
      posTextTip.visible = mouseIn;
    });

    mask.on("mousemove", (e) => {
      if (!mouseIn) {
        return;
      }
      posTextTip.visible = true;
      this.curTip_X = e.data.global.x / (COVER_SCALE * scale);
      this.curTip_Y = e.data.global.y / (COVER_SCALE * scale);

      const textTip_X: number = ~~(this.move_X + this.curTip_X);
      const textTip_Y: number = ~~(this.move_Y + this.curTip_Y);

      posTextTip.text = `${textTip_X}, ${textTip_Y}`;
      posTextTip.position.set(textTip_X, textTip_Y);
    });

    // 绑定缩放事件
    canvas.addEventListener("wheel", (e: WheelEvent) => {
      posTextTip.visible = false;
      scaleVal -= e.deltaY;
      if (scaleVal < SCALE_VALUE) {
        scaleVal = SCALE_VALUE;
      }
      scale = scaleVal / SCALE_VALUE;

      // 缩放画布及控制台
      this.scale.set(COVER_SCALE * scale);
      this.game.world.scale.set(COVER_SCALE * scale);

      // 改变缩放锚点
      this.pivot.set(posTextTip.x, posTextTip.y);
      this.position.set(posTextTip.x * COVER_SCALE, posTextTip.y * COVER_SCALE);
      this.game.world.pivot.set(posTextTip.x, posTextTip.y);
      this.game.world.position.set(
        posTextTip.x * COVER_SCALE,
        posTextTip.y * COVER_SCALE
      );

      // 计算缩放产生的相对位置偏离
      this.move_X = this.toLocal(this.game.stage.position).x;
      this.move_Y = this.toLocal(this.game.stage.position).y;

      // 缩小为初始尺寸重置定位
      if (scale == 1) {
        this.game.world.pivot.set(0, 0);
        this.game.world.position.set(0, 0);
        this.pivot.set(0, 0);
        this.position.set(0, 0);
      }
    });

    this.addChild(posTextTip);
  }
}

export default CoverMask;
