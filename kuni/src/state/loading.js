import KnScene from '@/lib/gameobjects/kn_scene';
import KnLoader from '@/lib/loader/kn_loader';

const DISTANCE = 200;

class Loading extends KnScene{
	constructor (game, key, boot) {
		super(game, key, boot);
		this.game = game;
		this.loadingTypes = new Map([
			['progress', this.generateBar],
			['circle', this.generateCircle],
			['sprite', this.generateSprite]
		]);
		this.ticker = null;
		this.duration = DISTANCE;
		this.boot();
		this.preloader();
		this.dev();
	}

	dev () {
		const dat = {
			'加载类型': '进度条加载'
		}
		const gui = this.game.gui.add(dat, '加载类型', ['progress', 'circle', 'sprite']);
		this.game.stats.showPanel(0);
		gui.onChange((v) => {
			this.reset();
			this.loadingTypes.get(v).call(this);
		});
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
		this.position.set(this.game.config.half_w, this.game.config.half_h);
		this.bg = this.game.add.image('Preloader_Background0000', this);
		this.bg.width = this.game.config.width;
		this.bg.height = this.game.config.height;
		this.bg.anchor.set(0.5);
		this.loadingTypes.get('progress').call(this);
	}

	// 进度条加载
	generateBar () {		
		const outBar = this.game.add.image('Preloader_Back0000', this, [0.5, 0.5]);
		outBar.scale.set(0.4);
		const innerBar = this.game.add.image('Preloader_Front0000', this, [0.5, 0.5]);
		innerBar.scale.set(0.4); 
		innerBar.angle = -90;
		this.maskClip = this.game.add.graphics.generateRect(0x000000, [0, 0, innerBar.height + 2, innerBar.width], !0);
		this.maskClip.y = this.maskClip.height;
		this.addChild(this.maskClip);
		innerBar.mask = this.maskClip;

		// 这里定义帧刷新事件
		const cb = (delta) => {
			this.duration -= delta;
			if (this.duration <= 0) {
				this.duration = DISTANCE;
				this.maskClip.y = this.maskClip.height;
			}
			this.maskClip.y = (this.duration / DISTANCE) * this.maskClip.height;
		};

		this.update(cb);
	}

	// 圆环加载
	generateCircle () {
		const text = this.game.add.text('123', {fontSize: 32, fill: 0xffffff}, [0.5, 0.5]);
		this.addChild(text);
	}

	update (cb) {

		// 创建刷新器
		this.ticker = this.game.add.ticker();
		this.ticker.add((delta) => {
			this.game.stats.begin();
			cb(delta);
			this.game.app.renderer.render(this.game.world);
			this.game.stats.end();
		});
		this.ticker.start();
	}

	reset () {
		if (this.ticker) {
			this.ticker.stop();
			this.ticker = null;
		}
		if (this.children.length > 1) {
			this.removeChildren(1, this.children.length);
		}
	}
}

export default Loading;