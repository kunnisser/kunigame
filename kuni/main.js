import Game from './lib/core.js';
import Login from '@/src/state/login';
import KnLoader from '@/lib/loader/kn_loader';

const game = new Game({
	width: 1200,
	height: 800
});

game.sceneManager.addScene('login', Login, !0);
KnLoader.preloader.add('gameBg', './assets/images/bg.jpg');
KnLoader.preloader.load(() => {
	console.log('loaded');
});