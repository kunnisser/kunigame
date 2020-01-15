import KnGroup from "../gameobjects/kn_group";
import Game from "../core";
import { Container } from 'pixi.js';
import KnScene from "../gameobjects/kn_scene";
import KnText from "../gameobjects/kn_text";

interface IMODAL_OPTIONS {
  modalBg: String,
  titleBg: String,
  close: String,
  ismobile: Boolean,
  panels: Array<{
    title: string,
    build: Function
  }>
}

class KnTradeModal extends KnGroup {
  public game: Game;
  public tween: any;
  public parent: KnGroup | KnScene;
  public content: Container;
  public options: IMODAL_OPTIONS;
  public titleText: KnText;
  constructor(game: Game, parent: KnGroup | KnScene, options: IMODAL_OPTIONS) {
    super(game, 'kn_trader', parent);
    this.generateBaseModal();
    this.game = game;
    this.parent = parent;
    this.options = options;
    this.tween = this.game.add.tween();
    this.generateBaseModal();
  }

  // 打开面板
  showPanel() {
    this.visible = !0;
    this.children[1].alpha = 0;
    this.tween.instance.to(this.children[1], 0.15, {
      alpha: 1,
      ease: this.tween.bounce.easeOut,
    });
  }

  // 关闭面板
  closePanel() {
    this.children[1].alpha = 1;
    this.tween.instance.to(this.children[1], 0.15, {
      alpha: 0,
      ease: this.tween.back.easeIn,
      onComplete: () => {
        this.visible = !1;
      }
    });
  }

  // 售卖面板
  createSellPaneler() {

  }

  generateBaseModal() {
    this.visible = !1;
    this.position.set(this.parent.width * 0.5, this.parent.height * 0.5);

    // 定义背景遮罩
    const floorBg = this.game.add.graphics().generateRect(0x000000, [0, 0, this.parent.width, this.parent.height], true);
    floorBg.alpha = 0.48;
    floorBg.interactive = !0;
    floorBg.on('pointerdown', () => {
      if (panelModal.scale.x === 1) {
        this.closePanel();
      }
    });
    this.addChild(floorBg);
    // 定义弹出框的主体容器
    const panelModal = this.game.add.group('tradePanelModal', this);

    // 定义背景
    const bg = this.game.add.image(this.options.modalBg, panelModal, [0.5, 0.5]);
    bg.scale.set(0.26, 0.36);
    bg.interactive = !0;


    // 定义标题框
    const title = this.game.add.image(this.options.titleBg, panelModal, [0.5, 0.5]);
    title.y = -bg.height * 0.5 + title.height;

    // 定义关闭按钮
    const close = this.game.add.button(this.options.close, null, panelModal, [0.5, 0.5]);
    close.position.set(bg.width * 0.38, -bg.height * 0.38);
    close.scale.set(0.6);
    close.next = () => {
      this.closePanel();
    };

    // 移动端适配
    if (this.options.ismobile) {
      bg.width = this.width;
      bg.height = this.height;
      title.y = (title.height - bg.height) * 0.5 + 10;
      close.position.set((close.width - bg.width) * 0.5 + 10, title.y);
    }

    // 定义标题文字
    this.titleText = this.game.add.text(this.options.panels[0].title, {
      fontSize: title.height * 0.2,
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 6,
      fontWeight: 'bold'
    }, [0.5, 0.5]);
    this.titleText.position.set(title.x, title.y);
    panelModal.addChild(this.titleText);

    // 定义内容容器
    const modalWrap = this.game.add.group('tradeContentWrap', panelModal);

    // 定义内容列表
    this.content = this.game.add.group('tradeModalContent', modalWrap);
  }
}

export default KnTradeModal;