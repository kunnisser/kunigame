import KnScene from '@/lib/gameobjects/kn_scene';
import KnLoader from '@/lib/loader/kn_loader';

class Loading extends KnScene{
	constructor (game, key, boot) {
		super(game, key, boot);
		this.game = game;
		this.boot();
		this.preloader();
		this.create();
		this.update();
		this.dev();
	}

	dev () {
		const dat = {
			'加载类型': '进度条加载'
		}
		this.game.gui.add(dat, '加载类型', ['进度条加载', '圆环加载', '动画加载']);
		this.game.stats.showPanel(0);
	}

	boot () {
		KnLoader.preloader.add('./assets/data/preloader.json');
	}

	preloader () {
		KnLoader.preloader.load(() => {
			const bg = this.game.add.image('Preloader_Background0000');
			bg.width = this.game.config.width;
			bg.height = this.game.config.height;
		});
	}

	create () {}

	update () {
		this.ticker = this.game.add.ticker();
		this.ticker.add((delta) => {
			this.game.stats.begin();
			this.game.app.renderer.render(this.game.world);
			this.game.stats.end();
		});
		this.ticker.start();
	}
}

export default Loading;