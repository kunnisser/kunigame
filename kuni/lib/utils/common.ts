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

const events: IEvents = {
  reset () {
    events['valve'] && (events['valve'] = null);
  },
  addOnce (next: Function) {
    if (!events['valve']) {
      events['valve'] = true;
      return next();
    }
  }
}

const math: IMath = {
	rdirect () {
		return Math.random() * 100 < 50 ? 1 : -1;
	}
}

export {
	debounce,
	math,
  events
}
