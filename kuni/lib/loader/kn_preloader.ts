/*
 * @Author: kunnisser 
 * @Date: 2019-08-31 15:01:05 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-10-01 18:42:33
 */

/** 
 * 场景切换资源加载
*/

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import KnGraphics from 'ts@/lib/gameobjects/kn_graphics';
import Game from 'ts@/lib/core';

class Preloader extends KnScene {
	public loadingTypes: Map<string, Function>;
	public ticker: PIXI.Ticker;
	public loadingGp: PIXI.Container;
	public autoDisplay: Boolean;
	public maskClip: KnGraphics;
	public loadingText: PIXI.Text;
	defaultGui: string;
	bg: PIXI.Sprite;
	drawStage: KnGraphics;
	constructor(game: Game, key: string, boot: boolean) {
		super(game, key, boot);
		this.game = game;
		this.resouces = { 'preloader': './assets/data/preloader.json' };
	}

	boot(target: KnScene) {
		this.create();
		if (target.resouces) {
			this.loadScene(target.resouces).on('progress', this.loadingHandler).load((loader) => {

				// 资源加载完成，进入目标场景
				target.isCached = true;
				target.loader = loader;
				this.game.sceneManager.changeScene(this, target);
			});
		} else {
			this.game.sceneManager.changeScene(this, target);
		}
	}

	create() {
		const tmpText = this.game.add.text('loading...', { fontFamily: 'GrilledCheeseBTNToasted', fontSize: '12px' }, [0.5, 0.5]);
		this.addChild(tmpText);
		this.removeChild(tmpText);
		this.position.set(this.game.config.half_w, this.game.config.half_h);
		this.bg = this.game.add.image('Preloader_Background0000', this);
		this.bg.width = this.game.config.width;
		this.bg.height = this.game.config.height;
		this.bg.anchor.set(0.5);
		this.drawStage = this.game.add.graphics();
		this.generateBar();
	}

	// 进行游戏资源场景加载
	loadScene(resouces: Object) {
		const keys = Object.keys(resouces);
		const loader = this.game.loader;
		for (let key of keys) {
			loader.add(key, resouces[key]);
		}
		return loader;
	}

	// progress更新
	loadingHandler = (e) => {
		const percent = e.progress.toFixed(0);
		this.loadingText.text = `${percent} %`;
		this.maskClip.y = (percent / 100) * this.maskClip.height;
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
		this.maskClip = maskClip;

		// 绘制加载文字
		this.loadingText = this.game.add.text('0 %', {
			fontFamily: 'GrilledCheeseBTNToasted',
			fontSize: '14px',
			fill: 0x2c92e0
		}, [0.5, 0.5]);
		this.loadingText.y = innerBar.y + 10;
		this.addChild(this.loadingText);
	}

}

export default Preloader;