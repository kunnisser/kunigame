import {Container} from 'pixi.js';

class KnGroup extends Container {
	public game: object;
	public groupId: string;
	constructor (game: object, key: string, parent: any) {
		super();
		this.game = game;
		this.groupId = key;
		parent.addChild(this);
		this.x = 0;
		this.y = 0;
	}

	setPosition (x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	// @align - true 统一锚点居中
	add (childs: Array<PIXI.Sprite>, align: boolean) {
		const handler = align ? (chd: PIXI.Sprite) => {
			chd.anchor.set(0.5);
			this.addChild(chd);
		} : (chd: PIXI.Sprite) => {
			this.addChild(chd);
		}
		for (let chd of childs) {
			handler(chd);
		}
	}
}

export default KnGroup;