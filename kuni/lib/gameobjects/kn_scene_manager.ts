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
	addScene (id: string, Stage: any, boot: boolean) {
		const stage = new Stage(this.game, id, boot);
		this.scenes.push(stage);
	}

	changeScene (from: KnScene, to: KnScene) {
		from.exit();
		to.enter();
	}

}

export default KnSceneManager;