import KnScene from "ts@/lib/gameobjects/kn_scene";
import Game from "ts@/lib/core";
import KnGroup from "ts@/lib/gameobjects/kn_group";

class KuaFu extends KnScene {
  public game: Game;
  public tween: any;
  public container: KnGroup;
  constructor(game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.resouces = {
    }
  }

  boot() {
    this.tween = this.game.add.tween();
    this.addBackground();
    this.addContainer();
  }

  addBackground() {
    const bg = this.game.add.graphics().generateRect(0x839cc8, [0, 0, this.game.config.width, this.game.config.height]);
    this.addChild(bg);
  }

  addContainer() {
    this.container = this.game.add.group('kuafu', this);
    const containerBg = this.game.add.graphics().generateRect(0x000000, [this.game.config.half_w, this.game.config.half_h, this.game.config.height * 0.65, this.game.config.height], !0);
    this.container.addChild(containerBg);
  }

  reset() {
    if (this.children.length > 1) {

      // 清除group子对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default KuaFu;