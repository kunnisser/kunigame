/*
 * @Author: kunnisser 
 * @Date: 2019-08-31 15:01:05 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-10-27 00:40:41
 */

/** 
 * 场景切换资源加载
*/

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import KnGraphics from 'ts@/lib/gameobjects/kn_graphics';
import Game from 'ts@/lib/core';
import { AnimatedSprite } from 'pixi.js';

class Preloader extends KnScene {
	public loadingTypes: Map<string, Function>;
	public ticker: PIXI.Ticker;
	public loadingGp: PIXI.Container;
	public autoDisplay: Boolean;
	public anmi: AnimatedSprite;
	public loadingText: PIXI.Text;
	public loadingbar: KnGraphics;
	defaultGui: string;
	bg: PIXI.Sprite;
	drawStage: KnGraphics;
	constructor(game: Game, key: string, boot: boolean) {
		super(game, key, boot);
		this.game = game;
		this.resouces = {
			'bg001': './assets/images/bg001.jpg',
			'run': './assets/data/loadingrun.json'
		};
	}

	boot(target: KnScene, isFirstLoad?: Boolean) {
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
		this.bg = this.game.add.image('bg001', this);
		this.bg.width = this.game.config.width;
		this.bg.height = this.game.config.height;
		this.bg.anchor.set(0.5);
		this.drawStage = this.game.add.graphics();
		this.generateSprite();
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
		const distance = percent / 100 - 0.5;
		this.anmi.x = this.loadingbar.width * distance;
		this.loadingText.text = `${percent} %`;
	}

	// 动画加载
	generateSprite() {
		const frames = [];
		for (let i = 1, l = 4; i < l; i++) {
			const val = i < 5 ? `0${i}` : i;
			frames.push(this.game.add.texture(`loadingrun_${val}.png`));
		}
		this.anmi = this.game.add.animation(frames, 0.24);
		this.anmi.scale.set(0.25);
		this.anmi.anchor.set(0.5);
		this.anmi.play();
		this.addChild(this.anmi);
		const startX = -this.game.config.half_w + this.anmi.width;
		this.anmi.x = startX;
		this.anmi.y = 100;

		// 绘制加载条
		this.loadingGp = this.game.add.group('sprite_loading', this);
		this.loadingbar = this.drawStage.generateRect(0xd10311, [0, 0, this.game.config.half_w + this.anmi.width, 8, 4], !0);
		this.loadingbar.y = this.anmi.y + this.anmi.height * 0.5 - 14;
		this.loadingGp.addChild(this.loadingbar);

		// 绘制加载文字
		this.loadingText = this.game.add.text('0 %', {
			fontFamily: 'GrilledCheeseBTNToasted',
			fontSize: '12px',
			fill: 0xffffff
		}, [0.5, 0.5]);
		this.loadingText.y = this.loadingbar.y;
		this.loadingGp.addChild(this.loadingText);
	}

}

export default Preloader;