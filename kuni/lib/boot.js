import Game from './core';
import State from './state';

export default function boot () {
	PIXI.Game = Game;
	PIXI.State = State;
	window.KN = PIXI;
}