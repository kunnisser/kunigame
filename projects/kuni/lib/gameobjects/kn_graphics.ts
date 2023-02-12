import { Graphics } from 'pixi.js';
import Game from '../core';

class KnGraphics extends Graphics {
  public game: Game;
  public border: IBorder;
  public id: string | undefined;
  constructor(game: Game, id?: string) {
    super();
    this.game = game;
    this.id = id || '';
  }

  setBorder(border: IBorder) {
    this.lineStyle(border.width, border.color, border.alpha, 1);
  }

  // 绘制线段
  generateLine(border) {
    this.setBorder(border);
    return this;
  }

  // 绘制矩形
  generateRect(
    color: number,
    points: Array<number>,
    anchor?: boolean,
    alpha?: number
  ) {
    this.beginFill(color, typeof alpha === 'number' ? alpha : 1);

    // 锚点居中
    anchor && ((points[0] -= points[2] * 0.5), (points[1] -= points[3] * 0.5));

    if (points.length === 5) {
      this.drawRoundedRect(
        ...(points as [number, number, number, number, number])
      );
    } else {
      this.drawRect(...(points as [number, number, number, number]));
    }
    this.endFill();
    return this;
  }

  /**
   * @description: 绘制stroke线
   * @param lineWidth 边线宽度
   * @param fillColor 内线填充色
   * @param strokeColor 边线颜色
   * @param rectPoints 绘制线段矩形的坐标和宽高
   * @return {*}
   */

  generateStrokeLine(
    lineWidth: number,
    fillColor: number,
    strokeColor: number,
    rectPoints: [number, number, number, number]
  ) {
    this.setBorder({
      width: lineWidth,
      color: strokeColor,
      alpha: 1,
    } as IBorder);

    // 根据绘制的矩形图形宽高比来决定锚点修正
    rectPoints[2] > rectPoints[3]
      ? (rectPoints[1] -= rectPoints[3] * 0.5)
      : (rectPoints[0] -= rectPoints[2] * 0.5);
    this.beginFill(fillColor);
    this.drawRect(...(rectPoints as [number, number, number, number]));
    this.endFill();
    return this;
  }

  /**
   * @description: 绘制带stroke描边的线边框
   * @param widths 边框宽度和stroke宽度
   * @param color 边框颜色
   * @param strokeColor 边框描线颜色
   * @param points 包裹对象的坐标和宽高
   * @return {KnGraphics} this
   */
  generateRectLineStyle(
    widths: Array<number>,
    color: number,
    strokeColor: number,
    points: Array<number>,
    anchor: any
  ) {
    const [BorderWidth, StrokeWidth] = widths;
    const [x, y, width, height, radius] = points;
    const borderX: number =
      x - BorderWidth * 0.5 - width * anchor.x - StrokeWidth;
    const borderY: number =
      y - BorderWidth * 0.5 - height * anchor.y - StrokeWidth;
    const rectWidth: number = width + BorderWidth + 2 * StrokeWidth;
    const rectHeight: number = height + BorderWidth + 2 * StrokeWidth;
    this.lineStyle(BorderWidth + StrokeWidth * 2, strokeColor, 1);
    if (points.length === 5) {
      this.drawRoundedRect(
        ...([borderX, borderY, rectWidth, rectHeight, radius] as [
          number,
          number,
          number,
          number,
          number
        ])
      );
      this.lineStyle(BorderWidth, color, 1);
      this.drawRoundedRect(
        ...([borderX, borderY, rectWidth, rectHeight, radius] as [
          number,
          number,
          number,
          number,
          number
        ])
      );
    } else {
      this.drawRect(
        ...([borderX, borderY, rectWidth, rectHeight] as [
          number,
          number,
          number,
          number
        ])
      );
      this.lineStyle(BorderWidth, color, 1);
      this.drawRect(
        ...([borderX, borderY, rectWidth, rectHeight] as [
          number,
          number,
          number,
          number
        ])
      );
    }
    return this;
  }

  /**
   * @description: 绘制三角形
   * @return {*}
   */
  generateTriangle(fillColor, strokeColor, strokeWidth, target) {
    this.beginFill(fillColor);
    this.setBorder({ width: strokeWidth, color: strokeColor, alpha: 1 });
    const triangleType: boolean = this.width > this.height;
    const SPACE_MAR: number = 2;
    if (triangleType) {
      const baseX = target.x + this.width - SPACE_MAR;
      this.moveTo(baseX + 8, target.y);
      this.lineTo(baseX, target.y - 4);
      this.lineTo(baseX, target.y + 4);
      this.closePath();
    } else {
      const baseY = target.y + this.height - SPACE_MAR;
      this.moveTo(target.x, baseY + 8);
      this.lineTo(target.x + 4, baseY);
      this.lineTo(target.x - 4, baseY);
      this.closePath();
    }

    this.endFill();
    return this;
  }

  // 绘制圆
  generateCircle(color: number, points: Array<number>, alpha?: number) {
    this.beginFill(color, typeof alpha === 'number' ? alpha : 1);

    // 锚点居中
    this.drawCircle(...(points as [number, number, number]));
    this.endFill();
    return this;
  }

  // 绘制空心圆
  generateLineCircle(color: number, points: Array<number>, alpha?: number) {
    this.beginFill(color, typeof alpha === 'number' ? alpha : 1);
    // 锚点居中
    this.drawCircle(...(points as [number, number, number]));
    this.beginHole();
    this.drawCircle(points[0], points[1], points[2] - 10);
    this.endHole();
    this.endFill();
    return this;
  }
}

export default KnGraphics;
