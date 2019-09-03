/*
 * @Author: kunnisser 
 * @Date: 2019-08-17 23:46:59 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-09-01 02:36:42
 */

/* 粒子发射器类 */

import {ParticleContainer, utils, Sprite} from 'pixi.js';

class KnEmitter extends ParticleContainer {
	public key: string;
	public constructor (quality: number, key: string) {
		super();
		this.key = key;
		this.create(quality, key);
	}

	public create (quality: number = 10, key: string) {
		const texture = utils.TextureCache[key];
		for (let i = 0; i < quality; i++) {
			let sprite: Sprite = new Sprite(texture);
			sprite.visible = !1;
			sprite.anchor.set(0.5);
			this.addChild(sprite); 
			if (quality === 1) {
				return sprite;
			}
		}
		return null;
	}

	public getParticle () {
		let bootParticle: any = null;
		bootParticle = this.children.find((particle) => {
			return particle.visible === !1;
		});
		return bootParticle || this.create(1, this.key);
	}

	// 单粒子发射
	public shoot () {
		let shootParticle: Sprite = this.getParticle();
		shootParticle.visible = !0;
		return shootParticle;
	}

	// 多粒子发射
	public shootMulite (num: number = 1, leftBound: number = 0, rightBound: number = 0, y: number = 0) {
		console.log(num);
		let bootParticles = [];
		for (let i = 0; i < num; i ++) {
			bootParticles[i] = this.children.find((particle) => {
				return particle.visible = !0;
			});
		}
	}
}

export default KnEmitter;
