import {Text} from 'pixi.js';
import Game from 'ts@/lib/core';

class KnText extends Text{
	game: Game;
	constructor (game: Game, content: string, style: object, anchor: Array<number>) {
		super(content, style);
		this.game = game;
		this.anchor.set(...anchor);
	}
}

export default KnText;