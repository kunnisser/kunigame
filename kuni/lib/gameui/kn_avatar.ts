import KnGroup from "../gameobjects/kn_group";
import Game from "../core";
import { Container } from "pixi.js";

class KnAvatar extends KnGroup {
  public game: Game;
  public avatar_w: number;
  public avatar_h: number;
  public inner_scale: 0.8;
  constructor(game: Game, parent: Container, key: string, bgColor: number) {
    super(game, 'profileAvatar', parent);
    this.game = game;
    this.avatar_w = 20;
    this.avatar_h = 20;
    this.inner_scale = 0.8;
    this.generateAvatar(key, bgColor);
    // this.generateHealthBar(bgColor);
  }

  generateAvatar = (key: string, bgColor: number) => {
    const bg = this.game.add.graphics().generateCircle(bgColor, [0, 0, this.avatar_w]);
    const mask = this.game.add.graphics().generateCircle(0xffffff, [
      0, 0,
      this.avatar_w * this.inner_scale]);
    this.addChild(bg);
    this.addChild(mask);
    const avatarIcon = this.game.add.image(key, this, [0.5, 0.5]);
    avatarIcon.width = this.avatar_w * 2;
    avatarIcon.height = this.avatar_h * 2;
    avatarIcon.mask = mask;
  }

  generateHealthBar(bgColor) {
    const healthBg = this.game.add.graphics().generateRect(bgColor, [0, 0, this.avatar_w * 2, this.avatar_h * 0.5], !0);
    healthBg.x = this.avatar_w * 1.5;
    healthBg.y = -this.avatar_h * 0.25;
    const powerBg = this.game.add.graphics().generateRect(bgColor, [0, 0, this.avatar_w * 2, this.avatar_h * 0.2], !0);
    powerBg.x = this.avatar_w * 1.5;
    powerBg.y = this.avatar_h * 0.1;
    this.addChild(healthBg);
    this.addChild(powerBg);
  }
}

export default KnAvatar;