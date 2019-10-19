const debounce = {
	tick: null,
	handler: (next: Function) => {
		if (debounce.tick) {
			clearTimeout(debounce.tick);
		}
		debounce.tick = setTimeout(() => {
			next();
		}, 200);
	}
};

const math: IMath = {
	rdirect () {
		return Math.random() * 100 < 50 ? 1 : -1;
	}
}

export {
	debounce,
	math
}
