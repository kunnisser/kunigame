/*
 * @Author: kunnisser 
 * @Date: 2019-08-17 23:46:59 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-10-20 17:17:22
 */

/* 粒子发射器类 */

import { ParticleContainer, utils, Sprite } from 'pixi.js';
import Game from '../core';
const ParticleConfig: any = {
	scale: true,
	position: true,
	visible: true,
	rotation: true,
	uvs: true,
	alpha: true,
};
class KnEmitter extends ParticleContainer {
	public key: string;
	public game: Game;
	public throtting: number; // 发射频率
	public tween: any; // 动画对象
	static throtting = 4; // 频率常量
	public shooting = !1; // 默认粒子发射状态关闭
	public constructor(game: Game, quality: number, key: string) {
		super(quality, ParticleConfig);
		this.game = game;
		this.key = key;
		this.throtting = KnEmitter.throtting;
		this.create(quality, key);
	}

	public create(quality: number = 10, key: string) {
		const texture = utils.TextureCache[key];
		for (let i = 0; i < quality; i++) {
			let sprite: Sprite = new Sprite(texture);
			sprite.alpha = 0;
			sprite.anchor.set(0.5);
			sprite.scale.set(0.5);

			// 添加到组中
			this.addChild(sprite);
			if (quality === 1) {
				return sprite;
			}
		}
		return null;
	}

	public getParticle() {
		let bootParticle: any = null;
		bootParticle = this.children.find((particle) => {
			return particle.alpha === 0;
		});
		return bootParticle || this.create(1, this.key);
	}

	// 单粒子发射 (发射器移动)
	public shoot() {
		let shootParticle: Sprite = this.getParticle();
		shootParticle.alpha = 1;
		shootParticle.angle = 0;
		return shootParticle;
	}

	// 多粒子发射 (发射器静止)
	public shootMulite(num: number = 1) {
		let bootParticles = [];
		for (let i = 0; i < num; i++) {
			const shootParticle = this.getParticle();
			shootParticle.alpha = 1;
			shootParticle.angle = 0;
			bootParticles.push(shootParticle);
		}
		return bootParticles;
	}
}

export default KnEmitter;
