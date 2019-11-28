import KnScene from "ts@/lib/gameobjects/kn_scene";
import Game from "ts@/lib/core";
import KnGroup from "ts@/lib/gameobjects/kn_group";
import KnTiling from "ts@/lib/gameui/kn_tiling";

class KuaFu extends KnScene {
  public game: Game;
  public tween: any;
  public container: KnGroup;
  public world: KnGroup;
  public bg: KnTiling;
  public farbg: KnTiling;
  public nearbg: KnTiling;

  constructor(game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.resouces = {
      'kuafu_bg': './assets/images/kuafu/kuafu_bg.png',
      'kuafu_near_bg': './assets/images/kuafu/kuafu_near_bg.png',
      'kuafu_far_bg': './assets/images/kuafu/kuafu_far_bg.png',
    }
    this.game.ticker.start();
  }

  boot() {
    this.tween = this.game.add.tween();
    this.addBackground();
    this.addContainer();
    this.addGameBg();
  }

  addBackground() {
    const bg = this.game.add.graphics().generateRect(0x839cc8, [0, 0, this.game.config.width, this.game.config.height]);
    this.addChild(bg);
  }

  addContainer() {
    this.container = this.game.add.group('kuafu', this);
    const containerBg = this.game.add.graphics().generateRect(0x000000, [0, 0, this.game.config.height * 0.64, this.game.config.height], !1);
    this.container.addChild(containerBg);
    this.container.position.set(this.game.config.half_w - this.game.config.height * 0.32 , 0);
    this.world = this.game.add.group('kuafu_world', this.container);
    this.world.position.set(0, 0);
  }

  addGameBg() {
    const bgHeight = 256;
    const bgScale = bgHeight / 256;

    // 远景
    this.farbg = this.game.add.tiling('kuafu_far_bg', this.container.width, bgHeight, this.world);
    this.farbg.y = this.game.config.half_h - bgHeight * 0.5;
    this.farbg.tileScale.set(bgScale);

    // 道路
    this.bg = this.game.add.tiling('kuafu_bg', this.container.width, bgHeight, this.world);
    this.bg.y = this.farbg.y;
    this.bg.tileScale.set(bgScale);
  
    // 近景
    this.nearbg = this.game.add.tiling('kuafu_near_bg', this.container.width, bgHeight, this.world);
    this.nearbg.y = this.farbg.y;
    this.nearbg.tileScale.set(bgScale);

  }

  update() {
    if (this.bg) {
      this.farbg.moveX(-0.5);
      this.bg.moveX(-1.5);
      this.nearbg.moveX(-2.5);
    }
  }

  reset() {
    if (this.children.length > 1) {

      // 清除group子对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default KuaFu;