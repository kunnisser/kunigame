import KnGroup from '../gameobjects/kn_group';
import { Container, Graphics } from 'pixi.js';
import Game from '../core';
import KnScene from '../gameobjects/kn_scene';
import { events } from '../utils/common';
import KnText from '../gameobjects/kn_text';

export interface IModalOptions {
  modalBg: String;
  titleBg: String;
  close: String | null;
  opacity?: number; // 遮罩不透明度
  maskCloseAble?: boolean; // 运行点击遮罩关闭
  ismobile?: Boolean;
  panels: Array<{
    title: string;
    build: Function;
  }>;
}

class KnModal extends KnGroup {
  public game: Game;
  public tween: any;
  public parent: KnGroup | KnScene;
  public content: Container;
  public options: IModalOptions;
  public contentWidth: number;
  public overlay: Graphics;
  public titleText: KnText;
  public limitMin_Y: number; // 滚动上边界
  public limitMax_Y: number; // 滚动下边界
  public bounceMap: any; // 回弹点信息
  constructor(game: Game, parent: KnScene | KnGroup, options: any) {
    super(game, 'knmodal', parent);
    this.game = game;
    this.parent = parent;
    this.options = options;
    this.tween = this.game.add.tween();
    this.generateModal();
    this.initial();
  }

  // 打开面板
  showPanel() {
    const tween: any = this.game.add.tween();
    this.visible = !0;
    this.children[1].scale.set(0);
    tween.instance.to(this.children[1].scale, 0.25, {
      x: 1,
      y: 1,
      ease: tween.bounce.easeOut,
    });
  }

  // 关闭面板
  closePanel(cb?: any) {
    const tween: any = this.game.add.tween();
    this.children[1].scale.set(1);
    tween.instance.to(this.children[1].scale, 0.25, {
      x: 0,
      y: 0,
      ease: tween.back.easeIn,
      onComplete: () => {
        this.visible = !1;
        cb && cb();
      },
    });
  }

  /** 弹层容器结构
   * panel
   * ** floorBg - 全屏遮罩
   * ** panelModal - 弹层部分
   * ** bg|title|closebtn|titleText - 弹层信息
   * ** rankWrap - 内容层
   * *** ranklist - 列表内容
   * *** mask - 滑动蒙版
   */
  generateModal() {
    this.visible = !1;
    this.position.set(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5
    );

    // 定义背景遮罩
    const floorBg = this.game.add
      .graphics()
      .generateRect(
        0x000000,
        [0, 0, this.parent.width, this.parent.height],
        true
      );
    floorBg.alpha = this.options.opacity || 1;
    floorBg.interactive = true;
    floorBg.on('pointerdown', () => {
      if (this.options.maskCloseAble && panelModal.scale.x === 1) {
        this.closePanel();
      }
    });
    this.addChild(floorBg);

    // 定义弹出框的主体容器
    const panelModal = this.game.add.group('panelModal', this);

    // 定义背景
    const bg = this.game.add.image(
      '',
      this.options.modalBg,
      panelModal,
      [0.5, 0.5]
    );
    bg.interactive = !0;

    // 定义标题框
    const title = this.game.add.image(
      '',
      this.options.titleBg,
      panelModal,
      [0.5, 0.5]
    );
    title.y = -bg.height * 0.5;

    // 定义标题文字
    this.titleText = this.game.add.text(
      '',
      this.options.panels[0].title,
      {
        fontSize: title.height * 0.3,
        fill: 0xffffff,
        stroke: 0x000000,
        strokeThickness: 20,
        fontWeight: 'bold',
      },
      [0.5, 0.5]
    );
    this.titleText.position.set(title.x, title.y - title.height * 0.05);
    panelModal.addChild(this.titleText);

    // 定义内容容器
    const modalWrap = this.game.add.group('contentWrap', panelModal);

    // 定义mask
    const maskWidth = bg.width * 0.7;
    this.overlay = this.game.add
      .graphics()
      .generateRect(0x0485de, [0, 0, maskWidth, bg.height, 10]);
    modalWrap.position.set(
      -this.overlay.width * 0.5,
      -this.overlay.height * 0.5
    );
    modalWrap.addChild(this.overlay);

    // 定义内容列表
    this.content = this.game.add.group('modalContent', modalWrap);
    modalWrap.mask = this.overlay;
    this.contentWidth = maskWidth;

    // 定义navtab按钮
    const navNum = this.options.panels.length;
    const margin = 4;
    if (navNum > 1) {
      const navtab = this.game.add.group('modalNavTab', panelModal);
      navtab['currentIndex'] = 0;
      this.options.panels.forEach((panel, index: number) => {
        const btnRect = this.game.add.button(
          'navtab' + index,
          0xd10311,
          null,
          navtab,
          [0.5, 0.5]
        );
        btnRect.width = (panelModal.width * 0.6) / navNum - margin;
        btnRect.height = 30;
        const btnText = this.game.add.text(
          '',
          panel.title,
          {
            fontSize: btnRect.width * 0.18,
            fill: 0xffffff,
          },
          [0.5, 0.5]
        );
        btnRect.x = (index - 0.5 * navNum + 0.5) * (btnRect.width + margin);
        btnText.x = btnRect.x;
        navtab.y = this.overlay.y + this.overlay.height * 0.5 + btnRect.height;
        navtab.addChild(btnText);
        btnRect.next = () => {
          // 这里视业务逻辑是否要做判断
          if (navtab['currentIndex'] != index) {
            this.switchPanel(index);
            navtab['currentIndex'] = index;
          }
        };
      });
    }

    // 定义关闭按钮
    if (this.options.close) {
      const close = this.game.add.button(
        'close',
        this.options.close,
        null,
        panelModal,
        [0.5, 0.5]
      );
      close.position.set(bg.width * 0.38, -bg.height * 0.38);
      close.next = () => {
        this.closePanel();
      };
    }

    // 移动端适配
    if (this.options.ismobile) {
      bg.width = this.width;
      bg.height = this.height;
      title.y = (title.height - bg.height) * 0.5 + 10;
    }
  }

  // panel切换后的内容重置
  initial(index?: number) {
    const indexType = Object.prototype.toString.call(index);
    const isInitial = indexType === '[object Undefined]';
    const currentIndex: any = isInitial ? 0 : index;
    this.options.panels[currentIndex].build &&
      this.options.panels[currentIndex].build(this);
    this.bindContainerScroll(isInitial);
  }

  // panel切换
  switchPanel(index: number) {
    const toggleTween = this.tween.instance.to(this.content, 0.2, {
      alpha: 0,
      paused: true,
      ease: this.tween.cubic.easeIn,
      onComplete: () => {
        this.content.removeChildren(0, this.content.children.length);
        this.titleText.text = this.options.panels[index].title;
        this.initial(index);
        this.tween.instance.to(this.content, 0.2, {
          alpha: 1,
          ease: this.tween.cubic.easeOut,
        });
      },
    });
    toggleTween.play();
  }

  // 绑定容器滚动
  bindContainerScroll(isInitial: boolean = !1) {
    this.content.y = 0;

    // 内容不超出则不进行滚动效果设置
    if (this.content.height - this.overlay.height <= 0) {
      this.overlay.interactive = !1;
      return;
    }

    this.overlay.interactive = !0;

    // 弹动动画
    const bounce: any = this.game.add.tween();
    let [canMove, startPointer, bounceDeep] = [!1, this.game.add.pointer(), 30];
    this.limitMin_Y = 0;
    this.limitMax_Y = -Math.ceil(this.content.height - this.overlay.height);
    const smoothVal = 0.64;
    let bounceStatus: any = null;
    let bouncing = !1;
    this.bounceMap = {
      up: this.limitMin_Y,
      down: this.limitMax_Y,
    };
    const bounceAction = () => {
      // 回弹
      bounceStatus &&
        bounce.instance.to(this.content, 0.4, {
          y: this.bounceMap[bounceStatus],
          ease: bounce.cubic.easeOut,
          onStart: () => {
            bouncing = !0;
          },
          onComplete: () => {
            bouncing = !1;
          },
        });
    };

    // 设置惯性
    let inertial: any = {
      start: 0,
      startTime: 0, // 按下的时刻
      endTime: 0, // 抬起手指的时刻
      moveTime: 0, // 停止滑动的时刻
      dumping: !1, // 末尾甩动
      quicken: !1, // 是否计算距离加速
      strength: 0, // 滑动力度
    };

    // 只在初始化时绑定事件
    isInitial &&
      this.overlay.on('pointerdown', (e) => {
        canMove = !0;
        startPointer.y = e.data.global.y;
        inertial.start = startPointer.y;
        inertial.startTime = new Date().getTime();
      });

    // 滚动边界检测
    const boundaryCheck = () => {
      if (this.content.y > this.limitMin_Y) {
        bounceStatus = 'up';
        inertial.dumping = !1;
        this.content.y >= this.limitMin_Y + bounceDeep &&
          ((this.content.y = this.limitMin_Y + bounceDeep), (canMove = !1));
      } else if (this.content.y < this.limitMax_Y) {
        bounceStatus = 'down';
        inertial.dumping = !1;
        this.content.y <= this.limitMax_Y - bounceDeep &&
          ((this.content.y = this.limitMax_Y - bounceDeep), (canMove = !1));
      } else {
        bounceStatus = null;
      }
    };

    isInitial &&
      this.overlay.on('pointerup', (e) => {
        canMove = !1;
        inertial.endTime = new Date().getTime();
        inertial.dumping = inertial.endTime - inertial.moveTime < 20;

        // 如需求根据滑动长度决定惯性的速度，开放下列注释
        // inertial.quicken = inertial.moveTime - inertial.startTime < 100;
        inertial.strength = e.data.global.y - inertial.start;

        // 惯性距离
        let inertialDistance = inertial.strength > 0 ? 30 : -30;

        // 初始化事件状态
        events.reset();
        this.parent.update = () => {
          if (inertial.dumping) {
            boundaryCheck();
            inertialDistance = (7 / 8) * inertialDistance;
            this.content.y += inertialDistance;
          } else {
            // 单次事件
            events.addOnce(() => {
              bounceAction();
            });
          }
        };
        bounceAction();
      });

    isInitial &&
      this.overlay.on('pointerupoutside', () => {
        canMove = !1;
        bounceAction();
      });

    isInitial &&
      this.overlay.on('pointermove', (e) => {
        if (canMove && !bouncing) {
          boundaryCheck();
          let offsetY = (e.data.global.y - startPointer.y) / smoothVal;
          startPointer.y = e.data.global.y;
          this.content.y = this.content.y + offsetY;
          inertial.moveTime = new Date().getTime();
        }
      });
  }
}

export default KnModal;
