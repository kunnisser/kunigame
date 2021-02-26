import Game from 'ts@/kuni/lib/core';
import StateHive from './src/state/hive';

const GameInitial = (view) => {
	console.log(Game);
	const game = new Game({
		width: 1920,
		ratio: 2,
		antialias: true,
		transparent: true,
		view
	});
	// 定义全局Mask
	const GameHive = StateHive(game);

	game.entryHive = GameHive['Welcome'];
	game.sceneManager.changeScene(null, GameHive['global_preloader']);
	return game;
};

export default GameInitial;