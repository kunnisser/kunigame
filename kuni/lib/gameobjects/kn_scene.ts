/* 场景基础类 */

import { Container } from 'pixi.js';

class KnScene extends Container {
	public game: any;
	public id: string;
	public isBoot: boolean;
	public resouces: object;
	public isCached: boolean;
	public loader: PIXI.Loader;
	public dat?: any;
	constructor(game: object, key: string, boot?: boolean) {
		super();
		this.game = game;
		this.id = key;
		this.isBoot = boot;
		this.isCached = !1;
		this.initial();
	}

	// 初始化场景实例定义
	initial() {
		const world = this.game.world;
		this.width = world.width;
		this.height = world.height;
		world.addChild(this);
	}

	// 进入场景
	enter(target?: KnScene) {
		this.visible = !0;
		this.boot(target);
	}

	// 离开场景
	exit() {
		this.visible = !1;
	}

	// 构建场景
	create() {}

	// 激活
	boot(target?: KnScene) { }

	// 刷新场景
	update(delta: number, options?: object) { }

	// 删除场景
	remove() {
		this.game.world.removeChild(this);
	}
}

export default KnScene;