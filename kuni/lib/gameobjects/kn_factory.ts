/**
* KnFactory 是一个快速构建大量公用游戏对象的类
* 其创建的对象会自动添加到对应的Manager, World或者是自定义组中
* @class KnFactory
* @constructor
* @param {Core} game - 当前运行的游戏实例的引用	
*/

import KnGroup from 'ts@/lib/gameobjects/kn_group';
import KnGraphics from 'ts@/lib/gameobjects/kn_graphics';
import KnText from 'ts@/lib/gameobjects/kn_text';
import KnEmitter from 'ts@/lib/gameobjects/kn_emitter';
import Game from 'ts@/lib/core';
import {Sprite, Texture, AnimatedSprite, utils, Ticker} from 'pixi.js';

class KnFactory {
	public game: Game;
	public graphics: KnGraphics;
	constructor (game: Game) {
		this.game = game;

		// 添加graphics实例
		this.graphics = new KnGraphics(game);
	}

	group (key: string, parent: PIXI.Container) {
		return new KnGroup(this.game, key, parent);
	}

	image = (key: string, parent: PIXI.Container, align: Array<number>) => {
		const texture = utils.TextureCache[key];
		const sprite = new Sprite(texture);
		align && sprite.anchor.set(...align);
		parent || (parent = this.game.world);
		return parent.addChild(sprite), sprite;
	}

	texture (key) {
		return Texture.from(key);
	}

	animation (frames: Array<PIXI.Texture>, speed: number) {
		const anim = new AnimatedSprite(frames);
		anim.animationSpeed = speed || 0.5;
		return anim;
	}

	emitter (quality: number, key: string) {
		return new KnEmitter(...arguments as unknown as [number, string]);
	}

	ticker = () => {
		const ticker = new Ticker();
		ticker.autoStart = false;
		ticker.stop();
		return ticker;
	}

	text (content: string, style: object, anchor: boolean) {
		const text = new KnText(this.game, ...arguments as unknown as [string, object, boolean]);
		return text;
	}

}

export default KnFactory;