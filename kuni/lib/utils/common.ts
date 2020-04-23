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

// 节流降帧
const Throtte = (fps: number, elapsedMS: number, next: Function) => {
	Throtte['origin'] === void 0 && (Throtte['origin'] = 0);
	const bootMs = 60 / fps * elapsedMS;
	if (Throtte['origin'] >= bootMs) {
		Throtte['origin'] = 0;
		next();
	} else {
		Throtte['origin'] += elapsedMS;
	}
}

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
  between(range) {
    return range[0] + Math.floor(Math.random() * (range[1] - range[0]));
  },
  crit(val, crit, critVal) { // 暂用
    return (Math.floor(Math.random() * 100) < crit) ? Math.round(val * (1 + critVal / 100)) : val;
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
	},
	angleToPointer (source, parent, target) {
		if (parent) {
			const sourcePos = parent.toGlobal(source.position);
			return Math.atan2(sourcePos.y - target.y, sourcePos.x - target.x);
		} else {
		    return Math.atan2(source.y - target.y, source.x - target.x);
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

// 古代时间转换
const TransformAncientDate = {
	generate(prefix: string = '') {
		let cnStr = ['十', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
		let days = [];
		for (let i = 1, l = 30; i <= l; i++) {
			if (i <= 10) {
				days.push(`${prefix}${cnStr[i % 10]}`);
			} else if (i > 10 && i < 20) {
				days.push(`${cnStr[0]}${cnStr[i % 10]}`);
			} else {
				days.push(`${cnStr[~~(i / 10)]}${i % 10 > 0 ? cnStr[0] + cnStr[i % 10] : cnStr[0]}`);
			}
		}
		return days;
	},
	transform(dayStamp) {
		const year = ~~(dayStamp / 360);
		let rest = dayStamp % 360;
		const month = ~~(rest / 30);
		rest = rest % 30;
		return [year, month, rest];
	},
	toString(gameDate, resArr) {
		const settingString = TransformAncientDate.generate('');
		const settingStringPrefix = TransformAncientDate.generate('初');
		return [`${gameDate.year[0]} ${resArr[0] === 0 ? '元' : settingString[resArr[0]  - 1]}年`, `${settingString[resArr[1]]}月`, `${settingStringPrefix[resArr[2]]}`];
	},
	getSeason(gameDate, month) {
		const seasonType = ~~(month / 3);
		const seasonArr: any[] = [seasonType as number, gameDate.season[seasonType] as string];
		return seasonArr;
	},
	getWeather(gameDate, month: number) {
		const seasonIndex = ~~(month / 3);
		const power = month % 3;
		const weatherTypes = gameDate.weather; // 0: 雨 / 落花瓣， 1：晴 -> 阳光由弱变强， 2： 落叶 3： 小雪 -> 大雪
		return [weatherTypes[seasonIndex], power];
	}
};

export {
	debounce,
	math,
	events,
	TransformImage,
	Throtte,
	TransformAncientDate
}
