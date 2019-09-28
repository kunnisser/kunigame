/*
 * @Author: kunnisser 
 * @Date: 2019-08-31 15:01:05 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-09-28 22:49:00
 */

/** 
 * 场景切换资源加载
*/

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import KnLoader from 'ts@/lib/loader/kn_loader';
import KnGraphics from 'ts@/lib/gameobjects/kn_graphics';
import Game from 'ts@/lib/core';

const DISTANCE: number = 200;

class Preloader extends KnScene {
	public loadingTypes: Map<string, Function>;
	public ticker: PIXI.Ticker;
	public loadingGp: PIXI.Container;
	public autoDisplay: Boolean;
	defaultGui: string;
	bg: PIXI.Sprite;
	drawStage: KnGraphics;
	constructor(game: Game, key: string, boot: boolean) {
		super(game, key, boot);
		this.game = game;
		this.ticker = null;
	}

	boot() {
		const tmpText = this.game.add.text('loading...', { fontFamily: 'GrilledCheeseBTNToasted', fontSize: '12px' }, [0.5, 0.5]);
		this.addChild(tmpText);
		this.removeChild(tmpText);
		KnLoader.preloader.add('./assets/data/preloader.json');			
		// 资源准备完成，执行后续代码
		KnLoader.preloader.load(() => {
			this.create();
		});
	}

	create() {
		this.position.set(this.game.config.half_w, this.game.config.half_h);
		this.bg = this.game.add.image('Preloader_Background0000', this);
		this.bg.width = this.game.config.width;
		this.bg.height = this.game.config.height;
		this.bg.anchor.set(0.5);
    this.drawStage = this.game.add.graphics();
    this.generateBar();
  }
  
  // 进行游戏资源场景加载
  preloader () {
    this.game.add.loader
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
		const cb = (delta: number) => {
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

		this.update(cb);
	}

	update(cb: Function) {

		// 创建刷新器
		this.ticker = this.game.add.ticker();
		this.ticker.add((delta) => {
			this.game.stats.begin();
			cb(delta);
			this.game.app.renderer.render(this.game.world);
			this.game.stats.end();
		});
		this.ticker.start();
	}

	reset() {
		if (this.ticker) {
			this.ticker.stop();
			this.ticker = null;
		}
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

export default Preloader;