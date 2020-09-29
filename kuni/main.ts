import Game from 'ts@/lib/core';
import { GuiScene } from 'ts@/lib/utils/gui';
import StateHive from './src/state/hive';

const game = new Game({
	width: 1920,
	ratio: 2
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

game.entryHive = GameHive['loading'];
game.sceneManager.changeScene(null, GameHive['global_preloader']);