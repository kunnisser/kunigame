/* 场景基础类 */

import { Container } from 'pixi.js';

class KnScene extends Container {
	public game: any;
	public id: string;
	isBoot: boolean;
	constructor(game: object, key: string, boot: boolean) {
		super();
		this.game = game;
		this.id = key;
		this.isBoot = boot;
		this.initial();
	}

	// 初始化场景实例定义
	initial() {
		const world = this.game.world;
		this.width = world.width;
		this.height = world.height;
		world.addChild(this);
		if (this.isBoot) {
			this.enter();
		}
	}

	// 进入场景
	enter() {
		this.visible = !0;
		this['initialWorld'] && this['initialWorld']();
	}

	// 离开场景
	exit() {
		this.visible = !1;
	}

	// 删除场景
	remove() {
		this.game.world.removeChild(this);
	}
}

export default KnScene;