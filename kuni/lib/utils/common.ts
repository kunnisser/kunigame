import Game from "../core";
import { Graphics, Container } from "pixi.js";

// 防抖函数
const debounce = {
	tick: null,
	handler: (next: Function) => {
		if (debounce.tick) {
			clearTimeout(debounce.tick);
		}
		debounce.tick = setTimeout(() => {
			next();
		}, 200);
	}
};

// 代理事件
const events: IEvents = {
	reset() {
		events['valve'] && (events['valve'] = null);
	},
	addOnce(next: Function) {
		if (!events['valve']) {
			events['valve'] = true;
			return next();
		}
	}
}

// 数学函数类
const math: IMath = {
	rdirect() {
		return Math.random() * 100 < 50 ? 1 : -1;
	},
	clamp(v: number, min: number, max: number) {
		if (v < min) {
			return min;
		}
		else if (max < v) {
			return max;
		}
		else {
			return v;
		}
	}
}

/* 纹理精灵图 */

const TransformImage = {

	// 形状转纹理
	transformToTexture: (game: Game, graphics: Graphics) => {
		return game.app.renderer.generateTexture(graphics, 1, window.devicePixelRatio);
	},
	// 形状转Sprite
	transformToSprite: (game: Game, graphics: Graphics, parent: Container) => {
		const texture = TransformImage.transformToTexture(game, graphics);
		return game.add.image(texture, parent);
	}
}

export {
	debounce,
	math,
	events,
	TransformImage
}
