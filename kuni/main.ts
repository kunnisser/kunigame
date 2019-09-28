import Game from 'ts@/lib/core';
import Home from 'ts@/src/state/home';
import Loading from 'ts@/src/state/loading';
import MapDemo from 'ts@/src/state/mapdemo';

const game = new Game({
	width: 750,
	ratio: 2
});

game.sceneManager.addScene('home', Home);
game.sceneManager.addScene('loading', Loading);
game.sceneManager.addScene('mapdemo', MapDemo);
