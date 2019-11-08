import KnScene from "ts@/lib/gameobjects/kn_scene";
import Game from "ts@/lib/core";
import KnModal from "ts@/lib/gameui/kn_modal";

class UIDemo extends KnScene {
  public game: Game;
  public shootType: number;
  public tween: any;
  public rank: KnModal;
  constructor(game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.shootType = 1;
    this.resouces = {
      'uiBg': './assets/images/uibg.png',
      'rankBtn': './assets/images/rankBtn.png',
      'rankData': './assets/data/rankData.json',
      'panelBg': './assets/images/panelbg.png',
      'panelTitle': './assets/images/paneltitle.png',
      'close': './assets/images/close.png'
    };
  }

  boot() {
    this.game.ticker.start();
    this.addBackground();
    this.addRankBtn();
    this.addRank();
  }

  addBackground() {
    const bg = this.game.add.image('uiBg', this);
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
  }

  addRankBtn() {
    const btn = this.game.add.button('rankBtn', null, this, [0.5, 0.5]);
    btn.scale.set(0.2);
    btn.position.set(200, 200);
    btn.next = () => {
      this.rank.showPanel();
    }
  }

  addRank() {
    this.rank = new KnModal(this.game, this);
  }
}

export default UIDemo;