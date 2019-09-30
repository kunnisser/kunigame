import Game from "../core";
import { Sprite } from "pixi.js";

class KnTransition{
	public game: Game;
	public maskSprite: Sprite;
	public overlay: Sprite;
	constructor (game) {
		this.game = game;
		this.generateOverlay();
		this.addMask();
	}

	addMask () {
		const mask = this.game.add.graphics();
		mask.beginFill(0x000000, 1);
		mask.drawStar(this.game.config.half_w, this.game.config.half_h, 5, 100);
		mask.endFill();
		this.maskSprite = this.game.add.image(this.game.app.renderer.generateTexture(mask, 1, window.devicePixelRatio), this.game.world);
		this.maskReset();		
	}

	generateOverlay () {
		const blackRect = this.game.add.graphics().generateRect(0x000000, [0, 0, 1 ,1]);
		this.overlay = this.game.add.image(this.game.app.renderer.generateTexture(blackRect, 1, window.devicePixelRatio), this.game.world);
		this.overlayReset();
	}

	overlayReset () {
		this.overlay.visible = !0;
		this.overlay.alpha = 1;
	}

	maskReset() {
		this.maskSprite.visible = !1;
		this.maskSprite.scale.set(1);
		this.game.world.mask = null;
	}

	tranScene() {
		const leaveTween: any = this.game.add.tweenline({
			onComplete: () => {
				// this.maskReset();
				// this.overlayReset();
			}
		});
		console.log(leaveTween);
		this.overlay.visible = !0;
		leaveTween.to(this.overlay, 10, {
			x: 400,
			ease: leaveTween.linear.easeNone
		}).call(() => {
			this.maskSprite.visible = !0;
			this.game.world.mask = this.maskSprite;
			console.log('step1');
		});
		// leaveTween.to(this.maskSprite, 2, {
		// 	width: this.game.config.width,
		// 	ease: leaveTween.linear.easeNone
		// });
	}
}

export default KnTransition;