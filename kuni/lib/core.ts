import dat from 'dat.gui';
import * as Stats from 'stats-js';
import KnFactory from 'ts@/lib/gameobjects/kn_factory';
import KnLoader from 'ts@/lib/loader/kn_loader';
import KnSceneManager from 'ts@/lib/gameobjects/kn_scene_manager';
import { Application, settings, SCALE_MODES } from 'pixi.js';
import { debounce, math } from 'ts@/lib/utils/common';
import KnScene from './gameobjects/kn_scene';
import KnPreloader from 'ts@/lib/loader/kn_preloader';
import KnTranstion from 'ts@/lib/gameui/kn_transtion';
import KnCursor from './gameui/kn_cursor';

interface EnterProps {
	width: number,
	height?: number,
	ratio: number
}

export default class Game {
	public gui: any;
	public stats: any;
	public view?: HTMLElement | null;
	public dpr: number;
	public preloader: KnScene;
	public ticker: PIXI.Ticker;
	public math: IMath;
	public camera: {
		width?: number,
		height?: number,
		half_w?: number,
		half_h?: number
	};
	public config: {
		width: number;
		height: number;
		half_w: number;
		half_h: number;
	}
	public world: PIXI.Container;
	public sceneManager: KnSceneManager;
	public app: Application;
	public loader: KnLoader;
	public add: KnFactory;
	public currentScene: KnScene; // 当前场景
	public overlay: KnTranstion; // 转场遮罩
	public cursor: KnCursor; // 游戏光标
	constructor(config: EnterProps) {
		const view = document.getElementById('view');
		this.view = view;
		this.dpr = window.devicePixelRatio;
		this.camera = {};
		// 设置游戏画布基本尺寸
		this.config = {
			width: config.width,
			height: config.width / config.ratio,
			half_w: config.width * 0.5,
			half_h: config.width / config.ratio * 0.5
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

		// 载入相关math方法
		this.math = math;

		// 适配幕布
		this.resizeStage(view, config);

		// 添加场景管理实例
		this.sceneManager = new KnSceneManager(this);

		// 添加生成游戏对象的快捷方式
		this.add = new KnFactory(this);

		// 初始化渲染器
		this.app.renderer.render(this.world);

		// 初始化光标
		this.cursor = new KnCursor(this, this.world);

		// 页面尺寸改变
		window.onresize = () => {

			// 防抖函数
			debounce.handler(() => {
				this.resizeStage(view, config);
			});
		}

		// 定义全局场景loading
		this.preloader = this.sceneManager.addScene('global_preloader', KnPreloader);
		this.refresh();

		// performance & runtime
		this.stats.showPanel(0);
	}

	// 重置画布尺寸
	resizeStage(view: Element, config: EnterProps) {
		const RATIO = config.ratio;
		let SCREEN_WIDTH: number | string = window.getComputedStyle(view).width;
		let SCREEN_HEIGHT: number | string = window.getComputedStyle(view).height;
		SCREEN_WIDTH = +SCREEN_WIDTH.substr(0, SCREEN_WIDTH.length - 2);
		SCREEN_HEIGHT = +SCREEN_HEIGHT.substr(0, SCREEN_HEIGHT.length - 2);
		const Cur_Ratio: number = SCREEN_WIDTH / SCREEN_HEIGHT;
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

		// 镜头尺寸设置
		this.camera.width = size.width;
		this.camera.height = size.height;
		this.camera.half_w = size.width * 0.5;
		this.camera.half_h = size.height * 0.5;
	}

	refresh () {
		// 创建刷新器
		this.ticker = this.add.ticker();
		this.ticker.add((delta) => {
			this.stats.begin();
			for (let scene of this.sceneManager.scenes) {
				scene.visible && scene.update(delta);
			}
			this.app.renderer.render(this.world);
			this.stats.end();
		});
		this.ticker.start();
	}
}