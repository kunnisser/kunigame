import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';

export default class Game {
	constructor (config) {
		this.app = new PIXI.Application({
			width: config.width,
			height: config.height,
		});

		const view = document.getElementById('view');
		view.appendChild(this.app.view);

		// 注册gui调试实例
		this.gui = new dat.GUI();
	}
}