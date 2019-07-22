import * as dat from 'dat.gui';

class GUI extends dat {
	constructor () {
		super();
		this.initial();
	}

	initial () {
		this.add(text, 'message', ['test', 'chrome', 'firefox']);
		this.add(text, 'speed', {
			stop： 0，
			slow: 10,
			fast: 50
		});
	}
}