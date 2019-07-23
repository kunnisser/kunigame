import {Loader} from 'pixi.js';
class KnLoader extends Loader{

	constructor (game) {
		super();
		this.game = game;
	}

	static preloader = Loader.shared;

	// 加载当前资源
	load (resouces) {
		let load = this.loader;
		this.filling(load, resouces);
	}

	// 队列载入
	filling (load) {
		for (let res of resouces) {
			load = load.add(res.key, res.url);
		}
	}

}

export default KnLoader;