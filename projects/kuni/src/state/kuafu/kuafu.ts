import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnTiling from "ts@/kuni/lib/gameui/kn_tiling";
import KnModal from "ts@/kuni/lib/gameui/kn_modal";
import { TransformImage } from "ts@/kuni/lib/utils/common";
import KnScrollMenu from "ts@/kuni/lib/gameui/kn_scrollMenu";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";
import GameUiInfo from "./ui/info";
import PriceGenerator from "./business/price";

class KuaFu extends KnScene {
  public game: Game;
  public tween: any;
  public container: KnGroup;
  public bg: KnTiling;
  public farbg: KnTiling;
  public nearbg: KnTiling;
  public cityMenu: KnModal; // 城池菜单
  public cityTipText: KnText; // 城池提示文字对象
  public cityDetail: KnModal; // 城池内部
  public gui: KnGroup; // 游戏信息UI
  public goods: any; // 游戏商品总类

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resouces = {
      "kuafu_bg": "/projects/kuni/assets/kuafu/kuafu_bg.png",
      "kuafu_near_bg": "/projects/kuni/assets/kuafu/kuafu_near_bg.png",
      "kuafu_far_bg": "/projects/kuni/assets/kuafu/kuafu_far_bg.png",
      "kuafu_modal": "/projects/kuni/assets/kuafu/modal.jpg",
      "hometown": "/projects/kuni/assets/kuafu/hometown.png",
      "cityTitle": "/projects/kuni/assets/kuafu/cityTitle.png",
      "goback": "/projects/kuni/assets/kuafu/goback.png",
      "goods": "/projects/kuni/assets/kuafu/data/goods.json",
      "citys": "/projects/kuni/assets/kuafu/data/citys.json",
      "buildings": "/projects/kuni/assets/kuafu/data/buildings.json",
      "date": "/projects/kuni/assets/kuafu/data/date.json",
      "textarea": "/projects/kuni/assets/kuafu/textarea.png",
      "farm": "/projects/kuni/assets/kuafu/farm.png",
      "grocery": "/projects/kuni/assets/kuafu/grocery.png",
      "ore": "/projects/kuni/assets/kuafu/ore.png",
      "pasture": "/projects/kuni/assets/kuafu/pasture.png"
    };
  }

  boot() {
    this.initialData();
  }

  create() {
    this.tween = this.game.add.tween();
    this.addBackground();
    this.addGameBg();
    this.addCityModal();
    this.addGui();
  }

  initialData() {
    this.goods = this.loader.resources.goods.data;
  }

  addBackground() {
    const bg = this.game.add
      .graphics()
      .generateRect(0x839cc8, [
        0,
        0,
        this.game.config.width,
        this.game.config.height
      ]);
    this.addChild(bg);
  }

  addGameBg() {
    const bgHeight = Math.round(this.height * 0.75);
    const bgScale = bgHeight / 256;

    // 远景
    this.farbg = this.game.add.tiling(
      "kuafu_far_bg",
      this.width,
      bgHeight,
      this
    );
    this.farbg.y = Math.round(this.game.config.half_h - bgHeight * 0.5);
    this.farbg.tileScale.set(bgScale);

    // 道路
    this.bg = this.game.add.tiling("kuafu_bg", this.width, bgHeight, this);
    this.bg.y = this.farbg.y;
    this.bg.tileScale.set(bgScale);

    // 近景
    this.nearbg = this.game.add.tiling(
      "kuafu_near_bg",
      this.width,
      bgHeight,
      this
    );
    this.nearbg.y = this.farbg.y;
    this.nearbg.tileScale.set(bgScale);
  }

  // 添加城池MODAL
  addCityModal() {
    const cityOptions = {
      type: "scroll",
      modalBg: "kuafu_modal",
      titleBg: "cityTitle",
      close: "goback",
      ismobile: true,
      panels: [
        {
          title: "家乡选择",
          build: this.addContent
        }
      ]
    };
    this.cityMenu = new KnModal(this.game, this, cityOptions);
    this.cityMenu.showPanel();

    const cityDetialOptions = {
      type: "scroll",
      modalBg: "kuafu_modal",
      titleBg: "cityTitle",
      close: "goback",
      ismobile: true,
      panels: [
        {
          title: "城市",
          build: this.addDetail
        }
      ]
    };
    this.cityDetail = new KnModal(this.game, this, cityDetialOptions);
  }

  addContent = (modal) => {
    this.addCityMenu(modal);
  };

  addDetail = (modal) => {
    this.addCityDetail(modal);
  };

  // 城池菜单
  addCityMenu(modal) {
    const cityData = this.loader.resources.citys.data.citys;
    let options: Array<any> = [];
    for (let cd of cityData.list) {
      options.push(
        Object.assign(cd, {
          callback: () => {
            this.cityDetail.showPanel();
          }
        })
      );
    }

    const scrollMenu = new KnScrollMenu(
      this.game,
      modal.children[1],
      options,
      !1,
      1.2,
      (index) => {
        this.updateCityTip(index, options);
      }
    );
    const bgRect = this.game.add
      .graphics()
      .generateRect(0x000000, [
        0,
        0,
        modal.children[1].width,
        modal.children[1].height - modal.titleText.height * 8
      ]);
    const menuBg = TransformImage.transformToSprite(
      this.game,
      bgRect,
      scrollMenu
    );
    menuBg.alpha = 0;
    menuBg.anchor.set(0.5);
    scrollMenu.initial(menuBg);

    const cityTip = this.game.add.group("cityTip", modal.children[1]);
    cityTip.y = scrollMenu.menusGp.height;
    const cityTipBg = this.game.add.image("textarea", cityTip, [0.5, 0.5]);
    cityTipBg.scale.y = 2;
    scrollMenu.menusGp.y -= cityTipBg.height * 0.5;
    this.cityTipText = this.game.add.text(
      "",
      options[0].tip,
      {
        fontSize: 24,
        fill: "#999999",
        stroke: 0xffffff,
        strokeThickness: 12,
        wordWrap: !0,
        wordWrapWidth: cityTipBg.width * 1.8
      },
      [0.5, 0.5]
    );
    cityTip.addChild(this.cityTipText);
  }

  // 城池内部详情
  addCityDetail(modal) {
    let keys = Object.keys(this.loader.resources.buildings.data);
    let buildings: Array<any> = Object.values(
      this.loader.resources.buildings.data
    );
    buildings.forEach((builder, index) => {
      builder["key"] = keys[index];
      builder["callback"] = () => {
        this.generatePriceModal(builder);
      };
    });
    const scrollMenu = new KnScrollMenu(
      this.game,
      modal.children[1],
      buildings,
      !1,
      1.2
    );
    const bgRect = this.game.add
      .graphics()
      .generateRect(0x000000, [
        0,
        0,
        modal.children[1].width,
        modal.children[1].height - modal.titleText.height * 8
      ]);
    const menuBg = TransformImage.transformToSprite(
      this.game,
      bgRect,
      scrollMenu
    );
    menuBg.alpha = 0;
    menuBg.anchor.set(0.5);
    scrollMenu.initial(menuBg);
  }

  // 构建交易平台
  generatePriceModal(builder) {
    for (let good of builder.goods) {
      console.log(this.goods[good]);
      const curPrice = PriceGenerator[builder.key](this.goods[good]);
      console.log(curPrice);
    }
  }

  addGui() {
    this.gui = new GameUiInfo(this.game, this);
  }

  // 更新城池介绍
  updateCityTip(index: number, options) {
    this.cityTipText.text = options[index].tip;
  }

  update() {
    if (this.farbg) {
      this.farbg.moveX(-1);
      this.bg.moveX(-2);
      this.nearbg.moveX(-3);
      this.gui.update();
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
