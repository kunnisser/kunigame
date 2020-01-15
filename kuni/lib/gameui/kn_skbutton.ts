import KnGroup from "../gameobjects/kn_group";
import { Sprite } from "pixi.js";
import Game from "../core";
import { TransformImage } from "../utils/common";

class KnSkButton extends KnGroup{
  public skillBtn: Sprite;
  public game: Game;
  public originScale: number;
  constructor(game, parent, key, config) {
    super(game, key, parent);
    this.game = game;
    this.initial(key, config);
    this.bindAction(config);
  }

  initial(key, config) {
    const skBg = this.game.add.image('rpg_sk_bg', this, [0.5, 0.5]);
    skBg.scale.set(0.8);
    this.skillBtn = this.game.add.image(key, this, [0.5, 0.5]);
    this.originScale = skBg.width / 110;
    this.skillBtn.scale.set(this.originScale);
    this.skillBtn['clickable'] = true;
  }

  bindAction(config) {
    const tween: any = this.game.add.tween();

    // 设置技能mask
    let mask: any = this.game.add.graphics();
    mask.generateRect(0x000000, [0, 0, this.skillBtn.width, this.skillBtn.height, 6], false, 0.7);
    mask = TransformImage.transformToSprite(this.game, mask, this);
    mask.anchor.set(0.5, 1);
    mask.y += mask.height * 0.5;
    mask.visible = false;
    
    this.skillBtn.interactive = true;
    this.skillBtn.on('pointerdown', () => {
      if (!this.skillBtn['clickable']) {
        return;
      }
      // 执行Action
      const gamer = config.action();

      tween.instance.to(this.skillBtn.scale, 0.1, {
        x: this.originScale + 0.1,
        y: this.originScale + 0.1,
        ease: tween.bounce.easeOut,
        repeat: 1,
        yoyo: true,
        onComplete: () => {
          this.skillBtn.scale.set(this.originScale);

          // 技能CD
          this.maskAnimate(tween, mask, config, gamer);
        }
      });
      this.skillBtn['clickable'] = false;
    });
  }

  maskAnimate (tween, mask, config, gamer) {
    config.type || (mask.visible = true);
    tween.instance.to(mask.scale, config.cd, {
      y: 0,
      onComplete: () => {
        mask.visible = false;
        mask.scale.set(1);
        gamer.acting = false;
        gamer.role.animation.play('stay');
        this.skillBtn['clickable'] = true;
      }
    });
  }
}

export default KnSkButton;