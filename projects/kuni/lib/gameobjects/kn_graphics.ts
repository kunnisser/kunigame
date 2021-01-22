import { Graphics } from 'pixi.js';
import Game from '../core';

class KnGraphics extends Graphics {
	public game: Game;
	public border: IBorder;
	constructor(game: Game) {
		super();
		this.game = game;
	}

	setBorder(border: IBorder) {
		this.lineStyle(border.width, border.color, border.alpha, 1);
	}

	// 绘制矩形
	generateRect(color: number, points: Array<number>, anchor?: boolean, alpha?: number) {
		this.beginFill(color, typeof alpha === 'number' ? alpha : 1);

		// 锚点居中
		anchor && (points[0] -= points[2] * 0.5, points[1] -= points[3] * 0.5);

		if (points.length === 5) {
			this.drawRoundedRect(...points as [number, number, number, number, number]);
		} else {
			this.drawRect(...points as [number, number, number, number]);
		}
		this.endFill();
		return this;
	}

	// 绘制圆
	generateCircle(color: number, points: Array<number>, alpha?: number) {
		this.beginFill(color, typeof alpha === 'number' ? alpha : 1);

		// 锚点居中
		this.drawCircle(...points as [number, number, number]);
		this.endFill();
		return this;
	}

	// 绘制空心圆
	generateLineCircle(color: number, points: Array<number>, alpha?: number) {
		this.beginFill(color, typeof alpha === 'number' ? alpha : 1);
		// 锚点居中
		this.drawCircle(...points as [number, number, number]);
		this.beginHole();
		this.drawCircle(points[0], points[1], points[2] - 10);
		this.endHole();
		this.endFill();
		return this;
	}
}

export default KnGraphics;