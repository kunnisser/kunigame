/* 场景管理 */

class KnSceneManager {
	public game: object;
	public scenes: Array<PIXI.Container>
	constructor (game: object) {
		this.game = game;
		this.scenes = [];
	}

	// 用户自定义添加场景对象
	addScene (id: string, boot: boolean) {
		this.scenes.push(new KnScene(this.game, id, boot));
	}

	changeScene (from: KnScene, to: KnScene) {
		from.exit();
		to.enter();
	}

}

export default KnSceneManager;