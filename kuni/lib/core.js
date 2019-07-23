import * as dat from 'dat.gui';
import KnFactory from '@/lib/gameobjects/kn_factory.js';
import KnLoader from '@/lib/loader/kn_loader';
import KnSceneManager from '@/lib/gameobjects/kn_scene_manager';
import {Application} from 'pixi.js';

export default class Game {
	constructor (config) {

		this.app = new Application({
			width: config.width,
			height: config.height,
		});

		const view = document.getElementById('view');
		view.appendChild(this.app.view);
		this.view = view;

		// 注册gui调试实例
		this.gui = new dat.GUI();

		// 添加生成游戏对象的快捷方式
		this.add = new KnFactory(this);

		// 添加加载器实例
		this.loader = new KnLoader(this);

		// 初始化画布
		this.world = this.app.stage;

		// 添加场景管理实例
		this.sceneManager = new KnSceneManager(this);

		// 初始化渲染器
		this.app.renderer.render(this.world);
	}
}