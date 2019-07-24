import * as dat from 'dat.gui';

class GUI extends dat.GUI {
	constructor () {
		super();
	}

	loading (text) {
		this.add(text, 'message', ['test', 'chrome', 'firefox']);
	}
}

export default GUI;