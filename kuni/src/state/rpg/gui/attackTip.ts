import KnGroup from "ts@/lib/gameobjects/kn_group";
import KnText from "ts@/lib/gameobjects/kn_text";
import Game from "ts@/lib/core";

class AttackTip extends KnGroup{
  public hurtText: KnText;
  public game: Game;
  public tween: any;
  public hurtVal: number;
  public parent: any;
  constructor(name, parent) {
    super(parent.game, name, parent);
    this.initial();
    this.game = parent.game;
    this.parent = parent;
    this.tween = this.game.add.tween();
  }

  initial() {
    const hurtStyle = {
      fontSize: 50,
      fontWeight: 'bold',
      fill: '#ffffff',
      stroke: 0xd10311,
      strokeThickness: 20
    }
    this.hurtText = this.game.add.text('', hurtStyle, [0.5, 0.5]);
    this.hurtText.y -= this.parent.height;
    this.hurtText.visible = false;
    this.addChild(this.hurtText);
  }

  pop() {
    const parent = this.parent;
    if (parent.hp <= 0) {
      return;
    }
    const staticY = this.hurtText.y;
    this.hurtText.visible = !0;
    this.hurtText.text = this.hurtVal + '';
    parent.hp -= this.hurtVal;    

    this.tween.instance.to(this.hurtText, 0.5, {
      y: staticY - 100,
      ease: this.tween.cubic.easeOut,
      onComplete: () => {
        this.hurtText.y = staticY;
        this.hurtText.visible = !1;
      }    
    });

    parent.hp = parent.hp < 0 ? 0 : parent.hp;

    const restWidth = parent.staticHpWidth * parent.hp / parent.maxHp;

    this.tween.instance.to(parent.hpbar, 0.4, {
      width: restWidth,
      ease: this.tween.bounce.easeOut,
      onComplete: () => {
        console.log(parent.hp);
        if (parent.hp === 0) {
          parent.bekilled();
        }
      }
    });
  }
}

export default AttackTip;