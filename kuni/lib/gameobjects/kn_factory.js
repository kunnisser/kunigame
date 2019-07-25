/**
* KnFactory 是一个快速构建大量公用游戏对象的类
* 其创建的对象会自动添加到对应的Manager, World或者是自定义组中
* @class KnFactory
* @constructor
* @param {Core} game - 当前运行的游戏实例的引用	
*/

import KnSceneManager from '@/lib/gameobjects/kn_scene_manager';
import KnGroup from '@/lib/gameobjects/kn_group';
import KnGraphics from '@/lib/gameobjects/kn_graphics';
import {Sprite, Texture, utils, Ticker} from 'pixi.js';

class KnFactory {
	constructor (game) {
		this.game = game;

		// 添加graphics实例
		this.graphics = new KnGraphics(game);
	}

	group (key, parent) {
		return new KnGroup(this.game, key, parent);
	}

	image = (key, parent, align) => {
		const texture = utils.TextureCache[key];
		const sprite = new Sprite(texture);
		align && sprite.anchor.set(...align);
		parent || (parent = this.game.world);
		return parent.addChild(sprite), sprite;
	}

	ticker = () => {
		const ticker = new Ticker();
		ticker.autoStart = false;
		ticker.stop();
		return ticker;
	}

}

export default KnFactory;