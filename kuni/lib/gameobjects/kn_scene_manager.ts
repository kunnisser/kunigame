/* 场景管理 */
import Game from 'ts@/lib/core';
import KnScene from 'ts@/lib/gameobjects/kn_scene';
class KnSceneManager {
	public game: Game;
	public scenes: Array<KnScene>
	constructor (game: Game) {
		this.game = game;
		this.scenes = [];
	}

	// 用户自定义添加场景对象
	addScene (id: string, Stage: any, boot?: boolean) {
		const stage = new Stage(this.game, id, boot);
		this.scenes.push(stage);
		return stage;
	}

	changeScene (from: KnScene | null, to: KnScene) {
		if (from) {
			// 去除特殊的dat.gui
			from.dat && this.game.gui.remove(from.dat);
			this.game.overlay.leaveScene(() => {
				from.exit();
				this.dispatchScene(to);
				this.game.currentScene = to;
			});
		} else {
			this.dispatchScene(to);
			this.game.currentScene = to;
		}
	}

	dispatchScene (to: KnScene) {
		
		/** 1.目标场景已缓存 
		 *  2. 若为加载器场景无需重复进入加载器
		 *  3. 目标场景未缓存进入加载器
		 * */ 
		if (to.isCached || !to.resouces) {
			console.log(to.id, '已缓存');
			to.enter();
		} else if (to.id === 'global_preloader'){
			let globalLoader = this.game.loader;
			
			// 全局loading界面的资源加载
			for (let key of Object.keys(to.resouces)) {
				globalLoader = globalLoader.add(key, to.resouces[key]);
			}
			globalLoader.load(() => {
				console.log('首次home加载');
				const homeScene = this.game.sceneManager.scenes[1];
				to.enter(homeScene, !0);
			})
		} else {
			// 首次进入场景且场景有资源需要加载，则会自动进入preloader场景
			console.log('首次进入', to.id);
			this.game.preloader.enter(to);
		}
	}

}

export default KnSceneManager;