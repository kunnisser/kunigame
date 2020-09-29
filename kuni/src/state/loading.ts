/*
 * @Author: kunnisser 
 * @Date: 2019-08-31 15:01:05 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-11-09 22:55:58
 */

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import Game from 'ts@/lib/core';
import KnEmitter from 'ts@/lib/gameobjects/kn_emitter';

const DISTANCE: number = 200;

class Loading extends KnScene {
	public loadingTypes: Map<string, Function>;
	public ticker: PIXI.Ticker;
	public loadingGp: PIXI.Container;
	defaultGui: string;
	bg: PIXI.Sprite;
	tween: any;
	maskView: any;
	particleView: any;
	spriteView: any;
	constructor(game: Game, key: string) {
		super(game, key);
		this.game = game;
		this.resouces = {
			'preloader': './assets/data/preloader.json',
			'blue': './assets/images/blue.png',
		};
		this.tween = this.game.add.tween();
	}

	devInit(v) {
		this.loadingTypes.forEach((type: any, key: string) => {
			if (v === key) {
				type.visible = !0
				this.update = type.update;
			} else {
				type.visible = !1;
			}
		});
	}

	dev() {
		if (this.game.gui.__controllers[0] && this.game.gui.__controllers[0].property === '加载类型') {
			return;
		}
		this.loadingTypes = new Map([
			['mask', this.maskView],
			['particle', this.particleView],
			['sprite', this.spriteView],
		]);

		this.defaultGui = 'mask';
		const dat = {
			'加载类型': this.defaultGui
		};
		this.dat = this.game.gui.add(dat, '加载类型', ['mask', 'particle', 'sprite']);
		this.dat.onChange((v: string) => {
			this.reset();
			this.devInit(v);
		});
		this.devInit(this.defaultGui);
	}

	boot() {
		const tmpText = this.game.add.text('loading...', { fontFamily: 'GrilledCheeseBTNToasted', fontSize: 12 }, [0.5, 0.5]);
		this.addChild(tmpText);
		this.removeChild(tmpText);
		this.dev();
	}

	create() {
		this.position.set(this.game.config.half_w, this.game.config.half_h);
		this.bg = this.game.add.image('Preloader_Background0000', this);
		this.bg.width = this.game.config.width;
		this.bg.height = this.game.config.height;
		this.bg.anchor.set(0.5);
		this.generateBar();
		this.generateCircle();
		this.generateSprite();
		console.log(this);
	}

	// 进度条加载
	generateBar() {
		this.maskView = this.game.add.group('loadMask', this);
		this.maskView.visible = !1;
		const outBar = this.game.add.image('Preloader_Back0000', this.maskView, [0.5, 0.5]);
		outBar.scale.set(0.4);
		const innerBar = this.game.add.image('Preloader_Front0000', this.maskView, [0.5, 0.5]);
		innerBar.scale.set(0.4);
		innerBar.angle = -90;
		const drawStage = this.game.add.graphics();
		const maskClip = drawStage.generateRect(0x000000, [0, 0, innerBar.height + 2, innerBar.width], !0);
		maskClip.y = maskClip.height;
		this.maskView.addChild(maskClip);
		innerBar.mask = maskClip;

		// 绘制加载文字
		const loadingText = this.game.add.text('0 %', {
			fontFamily: 'GrilledCheeseBTNToasted',
			fontSize: 14,
			fill: 0x2c92e0
		}, [0.5, 0.5]);
		loadingText.y = innerBar.y + 10;
		this.maskView.addChild(loadingText);
		let percent = 0;
		let duration = DISTANCE;

		// 这里定义帧刷新事件
		this.maskView.update = (delta: number) => {
			duration -= delta;
			if (duration <= 0) {
				duration = DISTANCE;
				maskClip.y = maskClip.height;
			}
			percent = (DISTANCE - duration) * 100 / DISTANCE
			percent = +percent.toFixed(0);
			loadingText.text = `${percent} %`;
			maskClip.y = (duration / DISTANCE) * maskClip.height;
		};
	}

	// 粒子加载
	generateCircle() {
		this.particleView = this.game.add.group('loadParticle', this);
		this.particleView.visible = !1;

		const emitter = this.game.add.emitter(this.game, 40, 'blue');
		this.particleView.addChild(emitter);
		emitter.position.set(0, 0);
		this.particleView.update = () => {
			emitter.throtting -= 2;
			if (emitter.throtting < 0) {
				const particle = emitter.shoot();
				particle.x = this.game.math.redirect() * Math.random() * 600;
				particle.y = 0;
				this.tween.instance.to(particle, 1, {
					x: particle.x,
					y: this.game.math.redirect() * Math.random() * 100,
					angle: 100 + this.game.math.redirect() * Math.random() * 300,
					alpha: 0,
					ease: this.tween.linear.easeNone
				});
				emitter.throtting = KnEmitter.throtting;
			}
		};
	}

	// 动画加载
	generateSprite() {
		this.spriteView = this.game.add.group('loadSprite', this);
		this.spriteView.visible = !1;

		const frames = [];
		for (let i = 1, l = 4; i < l; i++) {
			const val = i < 5 ? `0${i}` : i;
			frames.push(this.game.add.texture(`loadingrun_${val}.png`));
		}
		const anmi = this.game.add.animation(frames, 0.24);
		anmi.scale.set(0.35);
		anmi.anchor.set(0.5);
		anmi.play();
		this.spriteView.addChild(anmi);

		// 绘制加载条
		this.loadingGp = this.game.add.group('sprite_loading', this.spriteView);
		const drawStage = this.game.add.graphics();
		const loadingbar = drawStage.generateRect(0x337ab7, [0, 0, this.game.config.half_w + anmi.width, 10, 5], !0);
		loadingbar.y = anmi.height * 0.5 - 20;
		this.loadingGp.addChild(loadingbar);
		const startX = -loadingbar.width * .5 + anmi.width;
		anmi.x = startX;
		// 绘制加载文字
		const loadingText = this.game.add.text('0 %', {
			fontFamily: 'GrilledCheeseBTNToasted',
			fontSize: 18,
			fill: 0xffffff
		}, [0.5, 0.5]);
		loadingText.y = loadingbar.y + 40;
		this.loadingGp.addChild(loadingText);

		// 这里定义帧刷新事件
		let JOURNEY = 900;
		let duration = JOURNEY;
		let percent = 0;

		this.spriteView.update = (delta) => {
			duration -= delta;
			if (duration <= 0) {
				duration = JOURNEY;
				anmi.x = startX;
			}
			anmi.x += 1;
			percent = (JOURNEY - duration) / JOURNEY * 100;
			percent = +percent.toFixed(0);

			loadingText.text = `${percent} %`;
		};
	}

	reset() {
	}
}

export default Loading;