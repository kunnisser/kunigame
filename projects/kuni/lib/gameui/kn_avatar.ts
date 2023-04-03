import KnGroup from "../gameobjects/kn_group";
import Game from "../core";
import { Sprite, Text } from "pixi.js";

class KnAvatar extends KnGroup {
  public game: Game;
  public avatar_w: number;
  public avatar_h: number;
  public inner_scale: 0.8;
  public hpbar: Sprite;
  public mpbar: Sprite;
  public hp: number;
  public mp: number;
  public status: Array<number>;
  public hpText: Text;
  constructor(game: Game, parent: any, key: string, bgColor: number) {
    super(game, "profileAvatar", parent);
    this.game = game;
    this.avatar_w = 40;
    this.avatar_h = 40;
    this.inner_scale = 0.8;
    this.generateAvatar(key, bgColor);
    this.generateHealthBar(bgColor);
    this.generateText(parent.gamer.hp);
  }

  generateAvatar = (key: string, bgColor: number) => {
    const bg = this.game.add
      .graphics()
      .generateCircle(bgColor, [0, 0, this.avatar_w]);
    const mask = this.game.add
      .graphics()
      .generateCircle(0xffffff, [0, 0, this.avatar_w * this.inner_scale]);
    this.addChild(bg);
    this.addChild(mask);
    const avatarIcon = this.game.add.image("", key, this, [0.5, 0.5]);
    avatarIcon.width = this.avatar_w * 2;
    avatarIcon.height = this.avatar_h * 2;
    avatarIcon.mask = mask;
  };

  generateHealthBar(bgColor) {
    const healthBg = this.game.add
      .graphics()
      .generateRect(
        bgColor,
        [0, 0, this.avatar_w * 6, this.avatar_h * 0.6, 8],
        !1
      );
    healthBg.x = this.avatar_w - 8;
    healthBg.y = -this.avatar_h * 0.5;
    const powerBg = this.game.add
      .graphics()
      .generateRect(
        bgColor,
        [0, 0, this.avatar_w * 5, this.avatar_h * 0.4, 8],
        !1
      );
    powerBg.x = healthBg.x;
    powerBg.y = this.avatar_h * 0.1 + 2;
    this.addChild(healthBg);
    this.addChild(powerBg);

    this.hpbar = this.game.add.image("", "rpg_health_bar", this, [0, 0.5]);
    this.hpbar.width = 0.96 * healthBg.width;
    this.hpbar.height = healthBg.height * 0.8;
    this.hpbar.position.set(
      healthBg.x + healthBg.width * 0.02,
      healthBg.y + this.avatar_h * 0.3
    );

    this.mpbar = this.game.add.image("", "rpg_magic_bar", this, [0, 0.5]);
    this.mpbar.width = 0.96 * powerBg.width;
    this.mpbar.position.set(
      powerBg.x + powerBg.width * 0.02,
      powerBg.y + this.avatar_h * 0.2
    );
  }

  generateText(hp) {
    const textStyle = {
      fontSize: 16,
      fontWeight: "bold",
      fill: 0x666666
    };
    this.hpText = this.game.add.text("", hp, textStyle, [0.5, 0.5]);
    this.addChild(this.hpText);
    this.hpText.position.set(
      this.hpbar.x + this.hpbar.width * 0.5,
      this.hpbar.y
    );
  }
}

export default KnAvatar;
