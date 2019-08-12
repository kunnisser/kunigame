/* 粒子发射器类 */

import {ParticleContainer, utils, Sprite} from 'pixi.js';
class KnEmitter extends ParticleContainer {
	constructor (quality, key) {
		super();
		this.create(...arguments);
		this.particles = [];
	}

	create (quality, key) {
		const texture = utils.TextureCache[key];
		for (let i = 0; i < quality; i++) {
			let sprite = new Sprite(texture);
			this.visible = !1;
			this.particles.push(sprite);
			this.addChild(sprite);
		}
	}

	shoot (num, leftBound, rightBound, y) {
		console.log(num);
	}
}

export default KnEmitter;
