/* 场景基础类 */

import {Container} from 'pixi.js';
class KnScene extends Container{
	constructor (game, key, boot) {
		super();
		this.game = game;
		this.id = key;
		this.isBoot = boot;
		this.initial();
	}

	// 初始化场景实例定义
	initial () {
		const world = this.game.world;
		this.width = world.width;
		this.height = world.height;
		world.addChild(this);
		if (this.isBoot) {
			this.enter(this);
		}
	}

	// 进入场景
	enter (scene) {
		scene.visible = !0;
	}

	// 离开场景
	exit (scene) {
		scene.visible = !1;
	}

	// 删除场景
	remove (scene) {
		this.game.world.removeChild(scene);
	}
}

export default KnScene;