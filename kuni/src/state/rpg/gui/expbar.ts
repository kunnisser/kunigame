import KnGroup from "ts@/lib/gameobjects/kn_group"
import { Sprite, Text } from "pixi.js";

class ExpBar extends KnGroup{
  public innerbar: Sprite;
  public exp: Text;
  public expLimit: Text;
  constructor(parent, gamer) {
    super(parent.game, 'expbar', parent);
    this.initial(gamer, parent);
  }

  initial(gamer, parent) {
    const maxExp = gamer.level * 20;
    const game = parent.game;
    const icon = game.add.image('exp_icon', this, [0.5, 1]);
    icon.scale.set(0.75);
    const outbar = game.add.image('exp_outbar', this,[0, 0.5]);
    outbar.scale.x = 2;
    outbar.x -= outbar.width * 0.5
    outbar.y -= icon.height * 0.5;
    icon.x = outbar.x - icon.width * 0.5; 
    this.innerbar = game.add.image('exp_innerbar', this, [0, 0.5]);
    this.innerbar.position.set(outbar.x + 44, outbar.y);
    const whole = 2;
    const expWidth = gamer.exp / maxExp * whole;
    this.innerbar.scale.x = expWidth;

    const textStyle = {
      fontSize: 16,
      fill: 0xffffff,
      fontWeight: 'bold' 
    };
    this.exp = game.add.text(gamer.exp, textStyle, [1, 0.5]);
    this.expLimit = game.add.text(`/ ${maxExp}`, textStyle, [0, 0.5]);
    this.exp.x = this.x - this.exp.width * 0.5;
    this.exp.y = this.innerbar.y;
    this.expLimit.y = this.innerbar.y;
    this.addChild(this.exp);
    this.addChild(this.expLimit);
    this.position.set(parent.game.config.half_w, parent.game.config.height);
  }
}

export default ExpBar;