/*
 * @Author: kunnisser 
 * @Date: 2019-08-31 15:01:05 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-10-01 23:20:42
 */

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import Game from 'ts@/lib/core';

const DISTANCE: number = 200;

class Loading extends KnScene {
	public loadingTypes: Map<string, Function>;
	public ticker: PIXI.Ticker;
	public loadingGp: PIXI.Container;
	defaultGui: string;
	bg: PIXI.Sprite;
	constructor(game: Game, key: string, boot: boolean) {
		super(game, key, boot);
		this.game = game;
		this.loadingTypes = new Map([
			['mask', this.generateBar],
			['particle', this.generateCircle],
			['sprite', this.generateSprite],
		]);
		this.resouces = {
			'preloader': './assets/data/preloader.json',
			'blue': './assets/images/blue.png'
		  };
	}

	dev() {
		if (this.game.gui.__controllers[0] && this.game.gui.__controllers[0].property === '加载类型') {
			return;
		}

		this.defaultGui = 'mask';
		const dat = {
			'加载类型': this.defaultGui
		};
		this.dat = this.game.gui.add(dat, '加载类型', ['mask', 'particle', 'sprite']);
		this.dat.onChange((v: string) => {
			this.reset();
			this.loadingTypes.get(v).call(this);
		});
		this.loadingTypes.get(this.defaultGui).call(this);
	}

	boot() {
		const tmpText = this.game.add.text('loading...', { fontFamily: 'GrilledCheeseBTNToasted', fontSize: '12px' }, [0.5, 0.5]);
		this.addChild(tmpText);
		this.removeChild(tmpText);
		this.create();
		this.dev();
	}

	create() {
		this.position.set(this.game.config.half_w, this.game.config.half_h);
		this.bg = this.game.add.image('Preloader_Background0000', this);
		this.bg.width = this.game.config.width;
		this.bg.height = this.game.config.height;
		this.bg.anchor.set(0.5);
		this.drawStage = this.game.add.graphics();
	}

	// 进度条加载
	generateBar() {
		const outBar = this.game.add.image('Preloader_Back0000', this, [0.5, 0.5]);
		outBar.scale.set(0.4);
		const innerBar = this.game.add.image('Preloader_Front0000', this, [0.5, 0.5]);
		innerBar.scale.set(0.4);
		innerBar.angle = -90;
		const maskClip = this.drawStage.generateRect(0x000000, [0, 0, innerBar.height + 2, innerBar.width], !0);
		maskClip.y = maskClip.height;
		this.addChild(maskClip);
		innerBar.mask = maskClip;

		// 绘制加载文字
		const loadingText = this.game.add.text('0 %', {
			fontFamily: 'GrilledCheeseBTNToasted',
			fontSize: '14px',
			fill: 0x2c92e0
		}, [0.5, 0.5]);
		loadingText.y = innerBar.y + 10;
		this.addChild(loadingText);
		let percent = 0;
		let duration = DISTANCE;

		// 这里定义帧刷新事件
		this.update = (delta: number) => {
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
		const emitter = this.game.add.emitter(10, 'blue');
		this.addChild(emitter);
		emitter.shoot();
	}

	// 动画加载
	generateSprite() {
		const frames = [];
		for (let i = 1, l = 4; i < l; i++) {
			const val = i < 5 ? `0${i}` : i;
			frames.push(this.game.add.texture(`loadingrun_${val}.png`));
		}
		const anmi = this.game.add.animation(frames, 0.24);
		anmi.scale.set(0.35);
		anmi.anchor.set(0.5);
		anmi.play();
		this.addChild(anmi);
		const startX = -this.game.config.half_w + anmi.width;
		anmi.x = startX;

		// 绘制加载条
		this.loadingGp = this.game.add.group('sprite_loading', this);
		const loadingbar = this.drawStage.generateRect(0x337ab7, [0, 0, this.game.config.half_w + anmi.width, 10, 5], !0);
		loadingbar.y = anmi.height * 0.5 - 20;
		this.loadingGp.addChild(loadingbar);

		// 绘制加载文字
		const loadingText = this.game.add.text('0 %', {
			fontFamily: 'GrilledCheeseBTNToasted',
			fontSize: '18px',
			fill: 0xffffff
		}, [0.5, 0.5]);
		loadingText.y = loadingbar.y + 40;
		this.loadingGp.addChild(loadingText);

		// 这里定义帧刷新事件
		let duration = 480;
		let percent = 0;

		this.update = (delta) => {
			duration -= delta;
			if (duration <= 0) {
				duration = 480;
				anmi.x = startX;
			}
			anmi.x += 1;
			percent = (480 - duration) / 4.8;
			percent = +percent.toFixed(0);
			loadingText.text = `${percent} %`;
		};
	}

	reset() {
		if (this.children.length > 1) {

			// 清除grahpics 画布
			this.drawStage.clear();

			// 清空对象MASK
			this.children[2] && (this.children[2].mask = null);

			// 清除group子对象
			this.removeChildren(1, this.children.length);
		}
	}
}

export default Loading;