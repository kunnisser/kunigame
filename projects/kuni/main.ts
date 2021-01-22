import Game from 'ts@/kuni/lib/core';
import { GuiScene } from 'ts@/kuni/lib/utils/gui';
import StateHive from './src/state/hive';

const GameInitial = (view) => {
	const game = new Game({
		width: 1920,
		ratio: 2,
		view
	});
	// 定义全局Mask
	const GameHive = StateHive(game);
	const dat = new GuiScene();
	const gui = game.gui;
	const folder = gui.addFolder('场景');

	// 场景切换
	const AllStateKeys = Object.keys(GameHive);
	AllStateKeys.shift();
	const selector = folder.add(dat, '场景选择', AllStateKeys);
	selector.onChange((v: string) => {
		game.sceneManager.changeScene(game.currentScene, GameHive[v]);
	});

	game.entryHive = GameHive['Triangulation'];
	game.sceneManager.changeScene(null, GameHive['global_preloader']);
};

export default GameInitial;