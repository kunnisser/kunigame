import * as dat from 'dat.gui';
import Stats from 'stats-js';
import KnFactory from '@/lib/gameobjects/kn_factory.js';
import KnLoader from '@/lib/loader/kn_loader';
import KnSceneManager from '@/lib/gameobjects/kn_scene_manager';
import {Application, settings, SCALE_MODES} from 'pixi.js';
import {debounce} from '@/lib/utils/common';

export default class Game {
	constructor (config) {
		const view = document.getElementById('view');
		this.view = view;
		this.dpr = window.devicePixelRatio;

		// 设置游戏画布基本尺寸
		this.config = {
			width: config.width,
			height: parseInt(config.width / config.ratio)
		}

		this.app = new Application({
			width: this.config.width,
			height: this.config.height,
			antialias: !0,
			transparent: !0,
			resolution: this.dpr
		});

		view.appendChild(this.app.view);

		// 注册gui调试实例
		this.gui = new dat.GUI();

		// 注册渲染性能调试
		this.stats = new Stats();
		this.view.appendChild(this.stats.dom);

		// 添加加载器实例
		this.loader = new KnLoader(this);

		// 初始化画布
		this.world = this.app.stage;

		// 适配幕布
		this.resizeStage(view, config);

		// 添加场景管理实例
		this.sceneManager = new KnSceneManager(this);

		// 添加生成游戏对象的快捷方式
		this.add = new KnFactory(this);

		// 初始化渲染器
		this.app.renderer.render(this.world);

		// 页面尺寸改变
		window.onresize = () => {

			// 防抖函数
			debounce.handler(() => {
				this.resizeStage(view, config);
			});
		}
	}

	resizeStage (view, config) {
		const RATIO = config.ratio;
		let SCREEN_WIDTH = window.getComputedStyle(view).width;
		let SCREEN_HEIGHT = window.getComputedStyle(view).height;
		SCREEN_WIDTH = SCREEN_WIDTH.substr(0, SCREEN_WIDTH.length - 2);
		SCREEN_HEIGHT = SCREEN_HEIGHT.substr(0, SCREEN_HEIGHT.length - 2);
		const Cur_Ratio = SCREEN_WIDTH / SCREEN_HEIGHT;
		let size = null;
		if (Cur_Ratio > RATIO) {
			size = {
				width: SCREEN_HEIGHT * RATIO,
				height: +SCREEN_HEIGHT
			}
		} else {
			size = {
				width: +SCREEN_WIDTH,
				height: SCREEN_WIDTH / RATIO
			}
		}

		this.app.view.style.width = size.width + 'px';
		this.app.view.style.height = size.height + 'px';

		// 屏幕适配
		this.app.renderer.autoResize = true;
		this.app.renderer.resize(size.width, size.height);
        settings.SCALE_MODE = SCALE_MODES.NEAREST;

        // 游戏容器适配
		this.world.scale.set(size.width / config.width);
	}
}