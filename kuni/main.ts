import Game from 'ts@/lib/core';
import Home from 'ts@/src/state/home';
import Loading from 'ts@/src/state/loading';
import MapDemo from 'ts@/src/state/rpg/mapdemo';
import { GuiScene } from 'ts@/lib/utils/gui';
import KnTranstion from 'ts@/lib/gameui/kn_transtion';
import CursorDemo from 'ts@/src/state/cursorDemo';
import Environment from 'ts@/src/state/environment';

const game = new Game({
	width: 750,
	ratio: 2
});

const home = game.sceneManager.addScene('home', Home);
const loading = game.sceneManager.addScene('loading', Loading);
const map = game.sceneManager.addScene('mapdemo', MapDemo);
const cursor = game.sceneManager.addScene('cursordemo', CursorDemo);
const env = game.sceneManager.addScene('envdemo', Environment);

const dat = new GuiScene();
const gui = game.gui;
const folder = gui.addFolder('场景');
let currentScene = null;

// 场景切换
const loadingTypes = new Map([
	['home', () => game.sceneManager.changeScene(currentScene, home)],
	['loading', () => game.sceneManager.changeScene(currentScene, loading)],
	['mapdemo', () => game.sceneManager.changeScene(currentScene, map)],
	['cursordemo', () => game.sceneManager.changeScene(currentScene, cursor)],
	['environment', () => game.sceneManager.changeScene(currentScene, env)],
]);

const selector = folder.add(dat, '场景选择', ['home', 'loading', 'mapdemo', 'cursordemo', 'environment']);
selector.onChange((v: string) => {
	currentScene = game.currentScene;
	loadingTypes.get(v)();
});

// 定义全局Mask
game.overlay = new KnTranstion(game);
game.sceneManager.changeScene(null, game.preloader);