import Game from 'ts@/lib/core';
import Home from 'ts@/src/state/home';
import Loading from 'ts@/src/state/loading';
import MapDemo from 'ts@/src/state/mapdemo';
import { GuiScene } from 'ts@/lib/utils/gui';
import KnTranstion from 'ts@/lib/gameui/kn_transtion';

const game = new Game({
	width: 750,
	ratio: 2
});

const home = game.sceneManager.addScene('home', Home);
const loading = game.sceneManager.addScene('loading', Loading);
const map = game.sceneManager.addScene('mapdemo', MapDemo);

game.sceneManager.changeScene(null, game.preloader);

// 定义全局场景切换
game.overlay = new KnTranstion(game);

const dat = new GuiScene();
const gui = game.gui;
const folder = gui.addFolder('场景');
let currentScene = null;

// 场景切换
const loadingTypes = new Map([
	['home', () => game.sceneManager.changeScene(currentScene, home)],
	['loading', () => game.sceneManager.changeScene(currentScene, loading)],
	['mapdemo', () => game.sceneManager.changeScene(currentScene, map)]
]);const selector = folder.add(dat, '场景选择', ['home', 'loading', 'mapdemo']);
selector.onChange((v: string) => {
	game.overlay.tranScene();
	// currentScene = game.currentScene;
	// loadingTypes.get(v)();
});