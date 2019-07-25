import {Text} from 'pixi.js';
class KnText extends Text{
	constructor (game) {
		super(arguments[1], arguments[2]);
		this.game = game;
		this.anchor.set(...arguments[3]);
	}
}

export default KnText;