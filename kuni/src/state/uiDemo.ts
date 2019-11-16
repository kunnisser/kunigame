import KnScene from "ts@/lib/gameobjects/kn_scene";
import Game from "ts@/lib/core";
import KnModal from "ts@/lib/gameui/kn_modal";
import KnScrollMenu from "ts@/lib/gameui/kn_scrollMenu";

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
      'close': './assets/images/close.png',
      'avator': './assets/images/avator.jpg',
      'weapon_able': './assets/images/weapon_able.png',
      'cardBtn': './assets/images/cardBtn.png',
      'settingBtn': './assets/images/settingBtn.png',
      'lightBtn': './assets/images/sk_dkbear.png'
    };
  }

  boot() {
    this.game.ticker.start();
    this.addBackground();
    // this.addRankBtn();
    // this.addCardBtn();
    this.addScrollMenu();
    this.addModal();
  }

  addBackground() {
    const bg = this.game.add.image('uiBg', this);
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
  }

  addScrollMenu() {
    const options = [
      {
        key: 'cardBtn',
        name: '卡片'
      },
      {
        key: 'settingBtn',
        name: '设置'
      },
      {
        key: 'lightBtn',
        name: '光效'
      },
    ];
    new KnScrollMenu(this.game, this, options);
  }

  addRankBtn() {
    const btn = this.game.add.button('rankBtn', null, this, [0.5, 0.5]);
    btn.scale.set(0.2);
    btn.position.set(this.game.config.half_w - btn.width, this.game.config.half_h);
    btn.next = () => {
      this.rank.showPanel();
    }
  }

  addModal() {
    const options = {
      type: 'scroll',
      modalBg: 'panelBg',
      titleBg: 'panelTitle',
      close: 'close',
      panels: [
        {
          title: '好友排行',
          build: this.addRank
        },
        {
          title: '本周美女',
          build: this.addFriends
        },
        {
          title: '武器信息',
          build: this.addInfo
        }
      ]
    };
    this.rank = new KnModal(this.game, this, options);
  }

  // 添加排行内容
  addRank = (modal: KnModal) => {
    const rankData = this.loader.resources.rankData.data.ranklist;
    rankData.forEach((rd, index) => {
      this.generateRankItem(rd, index, modal);
    });
  }

  addFriends = (modal) => {
    const tmpImg = this.game.add.image('avator', modal.content);
    tmpImg.width = modal.contentWidth;
  }

  addInfo = (modal) => {
    const thumb = this.game.add.image('weapon_able', modal.content);
    const thumbTitle = this.game.add.section('奥布莱恩之剑', '', 10, modal.content, {
      padding: 10,
      bg: 0xe5b240
    });
    thumb.height = thumbTitle.height;
    thumb.width = thumb.height;
    thumbTitle.position.set(thumb.width + 10, (thumb.height - thumbTitle.height) * 0.5);
    const attack = this.game.add.section('攻击力', '50-120', 8, modal.content, {
      padding: 6,
      bg: 0x00a6cc
    });
    attack.position.set(thumb.width + 10, thumbTitle.height + 4);
    const defence = this.game.add.section('防御', '300', 8, modal.content, {
      padding: 6,
      bg: 0x00a6cc
    });
    defence.position.set(thumb.width + 10, attack.y + attack.height + 4);
    const crit = this.game.add.section('暴击', '14', 8, modal.content, {
      padding: 6,
      bg: 0x00a6cc
    });
    crit.position.set(thumb.width + 10, defence.y + defence.height + 4);
  }

  // 构建排行条目
  generateRankItem(data: any, index: number, modal: KnModal) {
    const rankItem = this.game.add.group('rankItem', modal.content);
    const item_y = index * 34;
    const itemBg = this.game.add.graphics().generateRect(0xb89254, [0, item_y, modal.contentWidth, 30, 10]);
    const name = this.game.add.text(data.name, {
      fontSize: 12,
      fill: '#ffffff'
    }, [0, 0.5]);
    const rankIndex = this.game.add.text(index + 1 + '.', {
      fontSize: 12,
      fill: '#ffffff'
    }, [0, 0.5]);
    const rankValue = this.game.add.text('小鱼干: ' + data.star, {
      fontSize: 8,
      fill: '#ffffff'
    }, [1, 0.5]);
    rankIndex.position.set(10, item_y + itemBg.height * 0.5);
    name.position.set(rankIndex.width + 20, item_y + itemBg.height * 0.5);
    rankValue.position.set(itemBg.width - 10, item_y + itemBg.height * 0.5);
    rankItem.addChild(itemBg, name, rankIndex, rankValue);
  }
  

  addCardBtn() {
    const btn = this.game.add.button('cardBtn', null, this, [0.5, 0.5]);
    btn.scale.set(0.2);
    btn.position.set(this.game.config.half_w + btn.width, this.game.config.half_h);
    btn.next = () => {
    }
  }
}

export default UIDemo;