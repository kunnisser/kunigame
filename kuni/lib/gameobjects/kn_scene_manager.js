/* 场景管理 */

class KnSceneManager {
	constructor (game) {
		this.game = game;
		this.scenes = [];
	}

	// 用户自定义添加场景对象
	addScene (id, sceneClass, boot) {
		this.scenes.push = new sceneClass(this.game, id, boot);
	}

	changeScene (from, to) {
		from.exit();
		to.enter();
	}

}

export default KnSceneManager;