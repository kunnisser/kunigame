import KnScene from "ts@/lib/gameobjects/kn_scene";
import Game from "ts@/lib/core";
import KnModal from "ts@/lib/gameui/kn_modal";
import KnScrollMenu from "ts@/lib/gameui/kn_scrollMenu";
import { TransformImage } from 'ts@/lib/utils/common';
import KnAvatar from "ts@/lib/gameui/kn_avatar";
import KnMenuBar from "ts@/lib/gameui/kn_menubar";

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
      'rankData': './assets/data/rankData.json',
      'panelBg': './assets/images/panelbg.png',
      'panelTitle': './assets/images/paneltitle.png',
      'close': './assets/images/close.png',
      'profile': './assets/images/avator.jpg',
      'weapon_able': './assets/images/weapon_able.png',
      'menu01': './assets/images/menu01.png',
      'menu02': './assets/images/menu02.png',
      'menu03': './assets/images/menu03.png',
      'menu04': './assets/images/menu04.png',
      'menu05': './assets/images/menu05.png',
      'menutip': './assets/images/tip.png',
      'avatar': './assets/images/user.jpeg',
      'ui_00': './assets/images/ui_00.png',
      'ui_01': './assets/images/ui_01.png',
      'ui_02': './assets/images/ui_02.png',
      'ui_03': './assets/images/ui_03.png',
      'ui_04': './assets/images/ui_04.png',
      'ui_05': './assets/images/ui_05.png',
      'ui_06': './assets/images/ui_06.png',
      'ui_07': './assets/images/ui_07.png',
      'ui_08': './assets/images/ui_08.png',
      'ui_09': './assets/images/ui_09.png',
    };
  }

  boot() {
    this.game.ticker.start();
    this.addBackground();
    this.addAvatar();
    this.addScrollMenu();
    this.addFootbar();
    this.addTopbar();
    this.addModal();

    // 若要使用message功能，请先激活
    this.bootMessage();
  }

  addBackground() {
    const bg = this.game.add.image('uiBg', this);
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
  }

  addScrollMenu() {
    const options = [
      {
        key: 'menu01',
        tipkey: 'menutip',
        name: '富甲天下',
        callback: () => {
          this.game.sceneManager.changeScene(this, this.game.sceneManager.scenes[8]);
        }
      },
      {
        key: 'menu02',
        name: '先知',
      },
      {
        key: 'menu03',
        name: '段正淳',
      },
      {
        key: 'menu04',
        name: '排行榜',
      },
      {
        key: 'menu05',
        name: '我服了你了行吧',
      }
    ];
    const scrollMenu = new KnScrollMenu(this.game, this, options);
    const bgRect = this.game.add.graphics().generateRect(0xffffff, [0, 0, this.game.config.width, this.game.config.height - 100], !0);
    const menuBg = TransformImage.transformToSprite(this.game, bgRect, scrollMenu);
    menuBg.alpha = 0;
    menuBg.anchor.set(0.5);
    scrollMenu.initial(menuBg);
  }

  addRankBtn() {
    const btn = this.game.add.button('rankBtn', null, this, [0.5, 0.5]);
    btn.scale.set(0.2);
    btn.position.set(this.game.config.half_w - btn.width, this.game.config.half_h);
    btn.next = () => {
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
    const tmpImg = this.game.add.image('profile', modal.content);
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

  addAvatar() {
    const avatar = new KnAvatar(this.game, this, 'avatar', 0xfff000);
    avatar.setPosition(avatar.avatar_w + 4, avatar.avatar_h + 4);
  }

  addFootbar() {
    const footbar = new KnMenuBar(this.game, this, [
      {
        name: '副本',
        icon: 'ui_01',
        handler: () => {
          this.tip.showMessage('如果觉得不错，请☆本项目');
        }
      },
      {
        name: '任务',
        icon: 'ui_04',
        handler: () => this.tip.showMessage('敬请期待')
      },
      {
        name: '背包',
        icon: 'ui_07',
        handler: null
      },
      {
        name: '奖励',
        icon: 'ui_03',
        handler: null
      },
      {
        name: '黑市',
        icon: 'ui_06',
        handler: null
      },
      {
        name: '更多',
        icon: 'ui_02',
        handler: null
      },
    ], 0.4);
    footbar.scale.set(0.5);
    footbar.setPosition(this.game.config.half_w, this.game.config.height - footbar.height * 0.5);
  }

  addTopbar() {
    const topbar = new KnMenuBar(this.game, this, [
      {
        name: '活动',
        icon: 'ui_00',
      },
      {
        name: '抽奖',
        icon: 'ui_05',
        handler: null
      },
      {
        name: '排行榜',
        icon: 'ui_08',
        handler: () => this.rank.showPanel()
      },
      {
        name: '公告',
        icon: 'ui_09',
        handler: null
      },
    ], 0.1);
    topbar.scale.set(0.5);
    topbar.setPosition(this.game.config.width - topbar.width * 0.5, topbar.height * 0.5);
  }
}

export default UIDemo;