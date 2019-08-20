import Game from './lib/core.js';
import Loading from 'ts@/src/state/loading';

const game = new Game({
	width: 750,
	ratio: 2
});

game.sceneManager.addScene('loading', Loading, !0);