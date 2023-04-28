/*
 * @Author: kunnisser
 * @Date: 2021-02-04 16:00:55
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-28 14:58:49
 * @FilePath: /kunigame/projects/kuni/lib/dev/editor_mask/cover.ts
 * @Description: ---- 编辑蒙层 ----
 */

import { Container, Text } from "pixi.js";
import Game from "../../core";
import KnGraphics from "../../gameobjects/kn_graphics";
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
  public actionMask: Container;
  public cursorX: number;
  public cursorY: number;
  public scaleRatio: number; // 缩放系数
  static COVER_SCALE: number;
  public lines: KnGraphics;
  static scaleRatio: number;
  constructor(game: Game, parent: PIXI.Container) {
    super(game, "coverMask", parent);
    this.game = game;
    this.start_X = 0;
    this.start_Y = 0;
    this.curTip_X = 0;
    this.curTip_Y = 0;
    this.move_X = 0;
    this.move_Y = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.isDragging = false;
    this.scaleRatio = 1;
    this.initial();
  }

  initial() {
    CoverMask.COVER_SCALE = this.game.world.scale.x;
    CoverMask.scaleRatio = 1;
    this.lines = this.generateGrid();
    this.bindControllerHandler(this.lines);
  }

  /**
   * @description: 绘制网格线
   * @param {void}
   * @return {void}
   */
  generateGrid(): KnGraphics {
    const width: number = this.game.config.width ?? 0;
    const height: number = this.game.config.height ?? 0;
    const size: number = 100;
    const border: IBorder = {
      width: 1,
      color: 0xffffff,
      alpha: 0.15
    };
    const lines: KnGraphics = this.game.add.graphics().generateLine(border);
    lines.interactive = true;

    const texts_x: Array<Text> = [];
    const texts_y: Array<Text> = [];

    // 绘制横向线
    for (let y = size, l = height; y < l; y += size) {
      lines.moveTo(0, y);
      lines.lineTo(width, y);
      const scaleText = this.game.add.text(
        "",
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
        "",
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
    return lines;
  }

  /**
   * @description: 添加操作蒙版
   * @param {*}
   * @return {KnGraphics} actionMask 返回操作蒙层
   */
  // addActionArea(): Graphics {
  //   const actionMask: Graphics = this.game.add.graphics();
  //   actionMask.hitArea = new PIXI.Rectangle(
  //     0,
  //     0,
  //     this.game.config.width,
  //     this.game.config.height
  //   );
  //   actionMask.interactive = false;
  //   this.addChild(actionMask);
  //   actionMask.position.set(0, 0);
  //   return actionMask;
  // }

  /**
   * @description: 公共缩放坐标计算
   * @param {*} event
   * @return {*}
   */
  translateWheelScalePosition(event) {
    this.curTip_X =
      event.data.global.x / (CoverMask.COVER_SCALE * this.scaleRatio);
    this.curTip_Y =
      event.data.global.y / (CoverMask.COVER_SCALE * this.scaleRatio);

    this.cursorX = ~~(this.move_X + this.curTip_X);
    this.cursorY = ~~(this.move_Y + this.curTip_Y);
    return [this.cursorX, this.cursorY];
  }

  /**
   * @description: 绑定操作监听事件集
   * @param {*}
   * @return {*}
   */
  bindControllerHandler(mask: KnGraphics): void {
    const SCALE_VALUE: number = 1000;
    let scaleVal: number = SCALE_VALUE;

    // 缩放系数
    this.scaleRatio = 1;

    const canvas: any = this.game.view.children[0];

    // 绑定move事件
    // const posTextTip = this.game.add.text(
    //   '',
    //   ``,
    //   {
    //     fontSize: 14,
    //     fontWeight: 'bold',
    //     fill: 0x8ac007,
    //     stroke: 0xffffff,
    //     strokeThickness: 6,
    //   },
    //   [0.5, 0.5]
    // );

    // 控制鼠标划入面板监听事件
    // let mouseIn: boolean = false;

    // mask.on('mouseout', (e: MouseEvent) => {
    //   mouseIn = false;
    //   posTextTip.visible = mouseIn;
    // });

    // mask.on('mouseover', (e: any) => {
    //   mouseIn = true;
    //   posTextTip.visible = mouseIn;
    // });

    mask.on("mousemove", (e) => {
      // if (!mouseIn) {
      //   return;
      // }
      // posTextTip.visible = true;
      this.translateWheelScalePosition(e);

      // posTextTip.text = `${this.cursorX}, ${this.cursorY}`;
      // posTextTip.position.set(100, 100);
    });

    // 绑定缩放事件
    canvas.addEventListener("wheel", (e: WheelEvent) => {
      // posTextTip.visible = false;
      scaleVal -= e.deltaY;
      if (scaleVal < SCALE_VALUE - 250) {
        scaleVal = SCALE_VALUE - 250;
      }
      this.scaleRatio = scaleVal / SCALE_VALUE;

      // 对外提供scaleRatio
      CoverMask.scaleRatio = this.scaleRatio;

      // 缩放画布及控制台
      this.scale.set(CoverMask.COVER_SCALE * this.scaleRatio);
      this.game.world.scale.set(CoverMask.COVER_SCALE * this.scaleRatio);

      // 改变缩放锚点
      this.pivot.set(this.cursorX, this.cursorY);
      this.position.set(
        this.cursorX * CoverMask.COVER_SCALE,
        this.cursorY * CoverMask.COVER_SCALE
      );
      this.game.world.pivot.set(this.cursorX, this.cursorY);
      this.game.world.position.set(
        this.cursorX * CoverMask.COVER_SCALE,
        this.cursorY * CoverMask.COVER_SCALE
      );

      // 计算缩放产生的相对位置偏离
      this.move_X = this.toLocal(this.game.stage.position).x;
      this.move_Y = this.toLocal(this.game.stage.position).y;

      // 缩小为初始尺寸重置定位
      if (this.scaleRatio == 1) {
        this.game.world.pivot.set(0, 0);
        this.game.world.position.set(0, 0);
        this.pivot.set(0, 0);
        this.position.set(0, 0);
      }
    });

    // this.addChild(posTextTip);
  }
}

export default CoverMask;
