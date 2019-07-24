const debounce = {
	tick: null,
	handler: (next) => {
		if (debounce.tick) {
			clearTimeout(debounce.tick);
		}
		debounce.tick = setTimeout(() => {
			next();
		}, 200);
	}
};

export {
	debounce
}
