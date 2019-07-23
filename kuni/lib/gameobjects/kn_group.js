import {Container} from 'pixi.js';
class KnGroup extends Container {
	constructor (game, key, parent) {
		super();
		this.game = game;
		this.groupId = key;
		parent.addChild(this);
		this.x = 0;
		this.y = 0;
	}

	setPosition (x, y) {
		this.x = x;
		this.y = y;
	}

	// @align - true 统一锚点居中
	add (childs, align) {
		const handler = align ? (obj) => {
			obj.anchor.set(0.5);
			this.addChild(chd);
		} : (obj) => {
			this.addChild(chd);
		}
		for (let chd of childs) {
			handler(chd);
		}
	}
}

export default KnGroup;