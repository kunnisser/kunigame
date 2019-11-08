import KnGroup from "../gameobjects/kn_group";
import { Container, Graphics } from "pixi.js";
import Game from "../core";
import KnScene from "../gameobjects/kn_scene";
import { events } from "../utils/common";

class KnModal extends KnGroup {
  public game: Game;
  public tween: any;
  public parent: KnScene;
  constructor(game, parent) {
    super(game, 'knmodal', parent);
    this.game = game;
    this.parent = parent;
    this.generateModal();
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
  closePanel() {
    const tween: any = this.game.add.tween();
    this.children[1].scale.set(1);
    tween.instance.to(this.children[1].scale, 0.25, {
      x: 0,
      y: 0,
      ease: tween.back.easeIn,
      onComplete: () => {
        this.visible = !1;
      }
    });
  }

  /** 弹层容器结构
   * panel
   * * floorBg - 全屏遮罩
   * * panelModal- 弹层部分
   * ** bg|title|closebtn|titleText - 弹层信息
   * ** rankWrap -内容层
   * *** ranklist - 列表内容
   * *** mask - 滑动蒙版
  */
  generateModal() {
    this.visible = !1;
    this.position.set(this.game.config.half_w, this.game.config.half_h);

    // 定义背景遮罩
    const floorBg = this.game.add.graphics().generateRect(0x000000, [0, 0, this.game.config.width, this.game.config.height], true);
    floorBg.alpha = 0.48;
    floorBg.interactive = !0;
    floorBg.on('pointerdown', () => {
      if (panelModal.scale.x === 1) {
        this.closePanel();
      }
    });
    this.addChild(floorBg);

    // 定义弹出框的主体容器
    const panelModal = this.game.add.group('panelModal', this);

    // 定义背景
    const bg = this.game.add.image('panelBg', panelModal, [0.5, 0.5]);
    bg.scale.set(0.26, 0.36);
    bg.interactive = !0;

    // 定义标题框
    const title = this.game.add.image('panelTitle', panelModal, [0.5, 0.5]);
    title.y = -bg.height * 0.5 + title.height;

    // 定义关闭按钮
    const close = this.game.add.button('close', null, panelModal, [0.5, 0.5]);
    close.position.set(bg.width * 0.38, -bg.height * 0.38);
    close.scale.set(0.6);
    close.next = () => {
      this.closePanel();
    };

    // 定义标题文字
    const titleText = this.game.add.text('好友排行', {
      fontSize: title.height * 0.2,
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 1,
      fontWeight: 'bold'
    }, [0.5, 0.5]);
    titleText.position.set(title.x, title.y);
    panelModal.addChild(titleText);

    // 定义排行容器
    const rankWrap = this.game.add.group('rankwrap', panelModal);

    // 定义mask
    const maskWidth = bg.width * 0.7;
    const mask = this.game.add.graphics().generateRect(0x0485de, [0, 0, maskWidth, bg.height * 0.5, 10]);
    rankWrap.position.set(-mask.width * 0.5, -mask.height * 0.5);
    rankWrap.addChild(mask);

    // 定义排行列表
    const ranklist = this.game.add.group('ranklist', rankWrap);

    rankWrap.mask = mask;

    const rankData = this.parent.loader.resources.rankData.data.ranklist;
    rankData.forEach((rd, index) => {
      this.generateRankItem(rd, index, ranklist, maskWidth);
    });

    this.bindContainerScroll(mask, ranklist);
  }


  // 构建排行条目
  generateRankItem(data: any, index: number, parent: Container, maskWidth: number) {
    const rankItem = this.game.add.group('rankItem', parent);
    const item_y = index * 34;
    const itemBg = this.game.add.graphics().generateRect(0xb89254, [0, item_y, maskWidth, 30, 10]);
    const name = this.game.add.text(data.name, {
      fontSize: 10,
      fill: '#ffffff'
    }, [0, 0.5]);
    const rankIndex = this.game.add.text(index + 1 + '.', {
      fontSize: 10,
      fill: '#ffffff'
    }, [0, 0.5]);
    const rankValue = this.game.add.text('小鱼干: ' + data.star, {
      fontSize: 6,
      fill: '#ffffff'
    }, [0, 0.5]);
    rankIndex.position.set(10, item_y + itemBg.height * 0.5);
    name.position.set(rankIndex.width + 20, item_y + itemBg.height * 0.5);
    rankValue.position.set(name.x + name.width + 20, item_y + itemBg.height * 0.5);
    rankItem.addChild(itemBg, name, rankIndex, rankValue);
  }

  // 绑定容器滚动
  bindContainerScroll(mask: Graphics, container: Container) {

    // 弹动动画
    const bounce: any = this.game.add.tween();
    let [canMove, startPointer, bounceDeep] = [!1, this.game.add.pointer(), 30];
    let [limitMin_Y, limitMax_Y] = [0, -Math.ceil(container.height - mask.height)];
    const smoothVal = 0.64;
    let [bounceStatus, bouncing] = [null, !1];
    const bounceMap = {
      'up': limitMin_Y,
      'down': limitMax_Y
    }
    const bounceAction = () => {
      // 回弹
      bounceStatus && bounce.instance.to(container, 0.4, {
        y: bounceMap[bounceStatus],
        ease: bounce.cubic.easeOut,
        onStart: () => {
          bouncing = !0;
        },
        onComplete: () => {
          bouncing = !1;
        }
      });
    };

    mask.interactive = !0;

    // 设置惯性
    let inertial: any = {
      start: 0,
      startTime: 0, // 按下的时刻
      endTime: 0, // 抬起手指的时刻
      moveTime: 0, // 停止滑动的时刻
      dumping: !1, // 末尾甩动
      quicken: !1, // 是否计算距离加速
      strength: 0 // 滑动力度
    };
    mask.on('pointerdown', (e) => {
      canMove = !0;
      startPointer.y = e.data.global.y;
      inertial.start = startPointer.y;
      inertial.startTime = new Date().getTime();
    });

    // 滚动边界检测
    const boundaryCheck = () => {
      if (container.y > limitMin_Y) {
        bounceStatus = 'up';
        inertial.dumping = !1;
        container.y >= limitMin_Y + bounceDeep && (container.y = limitMin_Y + bounceDeep, canMove = !1);
      } else if (container.y < limitMax_Y) {
        bounceStatus = 'down';
        inertial.dumping = !1;
        container.y <= limitMax_Y - bounceDeep && (container.y = limitMax_Y - bounceDeep, canMove = !1);
      } else {
        bounceStatus = null;
      }
    }
    
    mask.on('pointerup', (e) => {
      canMove = !1;
      inertial.endTime = new Date().getTime();
      inertial.dumping = inertial.endTime - inertial.moveTime < 50;

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
          inertialDistance = 7 / 8 * inertialDistance;
            container.y += inertialDistance;
        } else {

          // 单次事件
          events.addOnce(() => {
            bounceAction();
          })
        }
      }
      bounceAction();
    });

    mask.on('pointerupoutside', () => {
      canMove = !1;
      bounceAction();
    });

    mask.on('pointermove', (e) => {
      if (canMove && !bouncing) {
        boundaryCheck();
        let offsetY = (e.data.global.y - startPointer.y) / smoothVal;
        startPointer.y = e.data.global.y;
        container.y = container.y + offsetY;
        inertial.moveTime = new Date().getTime();
      }
    });
  }
}

export default KnModal;