import {Graphics} from 'pixi.js';

class KnGraphics extends Graphics {
	constructor (game) {
		super();
		this.game = game;
	}

	// 绘制矩形
	generateRect (color, points, anchor) {
		this.beginFill(color);

		// 锚点居中
		anchor && (points[0] -= points[2] * 0.5, points[1] -= points[3] * 0.5);
		if (points.length === 5) {
			this.drawRoundedRect(...points);
		} else {
			this.drawRect(...points);
		}
		this.endFill();
		return this;
	}
}

export default KnGraphics;