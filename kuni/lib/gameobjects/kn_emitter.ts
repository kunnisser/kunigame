/*
 * @Author: kunnisser 
 * @Date: 2019-08-17 23:46:59 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-08-18 16:02:56
 */

/* 粒子发射器类 */

import {ParticleContainer, utils, Sprite} from 'pixi.js';

class KnEmitter extends ParticleContainer {
	public particles: Array<Sprite>;
	public constructor (quality: number, key: string) {
		super();
		this.particles= [];
		let args:IArguments = arguments;
		args
		this.create(quality, key);
	}

	public create (quality: number, key: string) {
		const texture = utils.TextureCache[key];
		for (let i = 0; i < quality; i++) {
			let sprite = new Sprite(texture);
			this.visible = !1;
			this.particles.push(sprite);
			this.addChild(sprite);
		}
	}

	public shoot (num: number, leftBound: number, rightBound: number, y: number) {
		console.log(num);
	}
}

export default KnEmitter;
