import KnGroup from "../gameobjects/kn_group";
import { Container } from "pixi.js";
import Game from "../core";
import KnText from "../gameobjects/kn_text";

class KnMessage extends KnGroup{
  public message: KnText;
  public game: Game;
  public tween: any;
  public lock: boolean;
  constructor(game: Game, parent: Container) {
    super(game, 'knmessage', parent);
    this.game = game;
    this.initial();
    this.tween = this.game.add.tween();
    this.lock = !1;
  }

  initial() {
    const messageStyle = {
      fontSize: 18,
      fill: '#ffffff',
      fontWeight: 'bold'
    }
    this.message = this.game.add.text('', messageStyle, [0.5, 0.5]);

    const rectBg = this.game.add.graphics();
    this.addChild(rectBg);
    this.addChild(this.message);
    this.visible = !1;
  }

  showMessage(message: string) {
    if (this.lock) {
      return;
    }
    this.lock = !0;
    this.message.text = message;
    const rect: any = this.children[0];
    rect.clear();
    rect.setBorder({
      width: 2,
      color: 0xffffff,
      alpha: 0.8
    });
    this.children[0]['generateRect'](0x000000, [0, 0, this.message.width + 60, this.message.height + 10, this.message.height * 0.5], true, 0.4);
    this.visible = !0;
    this.alpha = 0;
    this.scale.set(1);
    this.y += 50;
    this.tween.instance.to(this.scale, 0.1, {
      x: 0.9,
      y: 1.15,
      yoyo: true,
      repeat: 1,
      ease: this.tween.back['easeInOut']
    });
    this.tween.instance.to(this, 0.1, {
      y: this.game.config.half_h,
      alpha: 1,
      ease: this.tween.cubic['easeOut'],
      onComplete: () => {
        this.scale.set(1);
        this.tween.instance.to(this, 1, {
          alpha: 1,
          ease: this.tween.cubic['easeOut'],
          onComplete: () => {
            this.lock = !1;
            this.hideMessage();
          }
        });
      }
    });
  }

  hideMessage() {
    this.visible = !1;
  }
}

export default KnMessage;