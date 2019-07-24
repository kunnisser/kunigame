import KnScene from '@/lib/gameobjects/kn_scene';
import KnLoader from '@/lib/loader/kn_loader';

class Loading extends KnScene{
	constructor (game, key, boot) {
		super(game, key, boot);
		this.game = game;
		this.loadingTypes = new Map([
			['bar', this.generateBar],
			['circle', this.generateCircle],
			['sprite', this.generateSprite]
		]);
		this.boot();
		this.preloader();
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
			this.create();
		});
	}

	create () {
		this.bg = this.game.add.image('Preloader_Background0000', this);
		this.bg.width = this.game.config.width;
		this.bg.height = this.game.config.height;
		this.loadingTypes.get('bar').call(this);
	}

	generateBar () {
		const outBar = this.game.add.image('Preloader_Back0000', this, [0.5, 0.5]);
		outBar.scale.set(0.6);
		outBar.position.set(this.game.config.half_w, this.game.config.half_h);

		const innerBar = this.game.add.image('Preloader_Front0000', this, [0.5, 0.5]);
		innerBar.scale.set(0.6);
		innerBar.angle = -90;
		innerBar.position.set(this.game.config.half_w, this.game.config.half_h);
	}

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