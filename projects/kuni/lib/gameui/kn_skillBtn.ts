import KnGroup from "../gameobjects/kn_group";
import { Sprite } from "pixi.js";
import Game from "../core";
import { TransformImage } from "../utils/common";

class KnSkButton extends KnGroup{
  public skillBtn: Sprite;
  public game: Game;
  public originScale: number;
  public tween: any;
  public masks: any;
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
    this.skillBtn['skillAble'] = true;
    this.skillBtn['clickAble'] = true;

    // 设置技能栏数字
    this.setKeyNumber(config.index);
  }

  setKeyNumber(index: number) {
    const style = {
      fontSize: 18,
      fontWeight: 'bold',
      fill: 0xffffff
    };
    const num = this.game.add.text(index + '', style, [0, 1]);
    this.addChild(num);
    num.x = -this.skillBtn.width * 0.5;
    num.y = this.skillBtn.height * 0.5;
  }

  bindAction(config) {
    this.tween = this.game.add.tween();

    // 设置技能mask
    let mask: any = this.game.add.graphics();
    mask.generateRect(0x000000, [0, 0, this.skillBtn.width + 2, this.skillBtn.height + 2, 6], false, 0.7);
    mask = TransformImage.transformToSprite(this.game, mask, this);
    mask.anchor.set(0.5, 1);
    mask.y += mask.height * 0.5;
    mask.visible = false;
    this.masks = mask;
    
    this.skillBtn.interactive = true;

    this.skillBtn.on('pointerdown', () => {
      this.dispatchSkill(config);
    });
  }

  dispatchSkill(config) {
    if (!this.skillBtn['skillAble'] || !this.skillBtn['clickAble']) {
      return;
    }

    // 执行Action
    const gamer = config.action(() => {

      // 技能CD
      gamer && this.maskAnimate(this.tween, this.masks, config, gamer);
    });

    if (gamer) {
      this.skillBtn['clickAble'] = false;

      // 点击效果
      this.tween.instance.to(this.skillBtn.scale, 1, {
        x: this.originScale + 0.1,
        y: this.originScale + 0.1,
        ease: this.tween.bounce.easeOut,
        repeat: 1,
        yoyo: true,
        onComplete: () => {
          this.skillBtn.scale.set(this.originScale);
          this.skillBtn['clickAble'] = true;
        }
      });
    }
  }

  // cd动画
  maskAnimate (tween, mask, config, gamer) {
    config.type || (mask.visible = true);
    this.skillBtn['skillAble'] = false;
    tween.instance.to(mask.scale, config.cd, {
      y: 0,
      onComplete: () => {
        mask.visible = false;
        this.skillBtn['skillAble'] = true;
        this.skillBtn.blendMode = PIXI.BLEND_MODES.ADD_NPM;
        tween.instance.to(mask.scale, 0.25, {
          x: 1,
          y: 1,
          ease: tween.bounce.easeOut,
          onComplete: () => {
            this.skillBtn.blendMode = PIXI.BLEND_MODES.NORMAL;
          }
        });
      }
    });
  }
}

export default KnSkButton;