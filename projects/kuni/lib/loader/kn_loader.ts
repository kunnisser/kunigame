import { Loader } from 'pixi.js';
import Game from 'ts@/kuni/lib/core';

class KnLoader extends Loader {
	public game: Game;
	loader: any;
	constructor(game: Game) {
		super();
		this.game = game;
	}

	static preloader = Loader.shared;

	// 加载当前资源
	loaded(resouces: Array<PIXI.Texture>) {
		let loadObj = this.loader;
		this.filling(loadObj, resouces);
	}

	// 队列载入
	filling(loadObj: PIXI.Loader, resouces: any) {
		let curLoad = loadObj;
		for (let res of resouces) {
			curLoad = curLoad.add(res.key, res.url);
		}
	}

}

export default KnLoader;