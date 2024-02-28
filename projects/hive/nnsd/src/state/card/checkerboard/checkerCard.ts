/*
 * @Author: kunnisser
 * @Date: 2024-02-02 13:53:45
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-28 23:30:40
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\checkerboard\checkerCard.ts
 * @Description: ---- 卡牌外壳 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import CheckerLayout from './checkerLayout';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import CardContent from '../cardcontent/content';
import { CardContentMap } from '../cardcontent/combine';
import Don from '../cardcontent/role/player';
import { InteractionEvent, Point } from 'pixi.js';
import { generateCardTween, moveCardTween } from '../tween';
import Card from '../scene';

class CheckerCardWrap extends KnGroup {
  game: Game;
  wrap: KnSprite;
  container: KnGroup;
  parent: CheckerLayout;
  content: CardContent;
  constructor(game: Game, parent: CheckerLayout, type?: string) {
    super(game, 'cardWrap', parent);
    this.parent = parent;
    this.game = game;
    this.initialWrap();
    this.setContent(type);
    this.interaction();
  }

  initialWrap() {
    this.wrap = this.game.add.image('cardWrap', 'cardWrap', this, [0.5, 0.5]);
    this.container = this.game.add.group('cardContainer', this);
  }

  // 根据卡片类型 设置卡片内容元素
  setContent(type?: string, indices?: Array<number>) {
    if (type) {
      this.container.removeChildren();
      this.content = new CardContentMap[type](this.game, this.container, this);
      indices && (this.content.indices = indices);
    }
  }

  // todo 卡牌交互
  interaction() {
    this.wrap.interactive = true;
    this.wrap.on('pointerdown', (event: InteractionEvent) => {
      const playerCardWrap = this.wrap;

      // 判断是否为玩家卡牌
      if (this.isPlayerCard()) {
        const content = this.content as Don;
        content.currentGlobal = event.data.global.clone();
        // 当前玩家扮演的卡牌交互层
        // 绑定玩家的拖动事件
        // playerCardWrap.on('pointermove', (event: InteractionEvent) => {
        //   content.onMove && content.onMove(this, event);
        // });
        // 抬起手势取消拖动
        playerCardWrap.once('pointerup', () => {
          playerCardWrap.off('pointerupoutside');
        });
        playerCardWrap.once('pointerupoutside', (upEvent: InteractionEvent) => {
          playerCardWrap.off('pointerup');
          const direct: string | undefined = this.computedPlayerDirection(
            content.currentGlobal,
            upEvent.data.global
          );
          // 执行移动
          direct && this.parent.updateCheckerBoard(this, direct);
        });
      }

      // 通用点击事件
      playerCardWrap.once('pointerup', () => {
        playerCardWrap.off('pointerupoutside');
        this.content.onClick();
      });
      playerCardWrap.once('pointerupoutside', () => {
        playerCardWrap.off('pointerup');
      });
    });
  }

  // 判断是否为玩家卡牌
  isPlayerCard() {
    return this.content.attribute === 'player';
  }

  // 判断玩家卡牌的移动方向
  computedPlayerDirection(currentPointer: Point, moveTarget: Point) {
    const directLogicMap = {
      up:
        Math.abs(moveTarget.y - currentPointer.y) >
          Math.abs(moveTarget.x - currentPointer.x) &&
        moveTarget.y - currentPointer.y < 0,
      down:
        Math.abs(moveTarget.y - currentPointer.y) >
          Math.abs(moveTarget.x - currentPointer.x) &&
        moveTarget.y - currentPointer.y > 0,
      left:
        Math.abs(moveTarget.x - currentPointer.x) >
          Math.abs(moveTarget.y - currentPointer.y) &&
        moveTarget.x - currentPointer.x < 0,
      right:
        Math.abs(moveTarget.x - currentPointer.x) >
          Math.abs(moveTarget.y - currentPointer.y) &&
        moveTarget.x - currentPointer.x > 0,
    };
    return Object.keys(directLogicMap).find((key) => directLogicMap[key]);
  }

  // 卡牌互动逻辑
  cardMoveLogic(
    targetCard: CheckerCardWrap,
    followCard: CheckerCardWrap,
    direct: string
  ) {
    // 主卡牌击败目标卡牌逻辑
    this.content.defeat(targetCard, direct);

    const player = this.content as Don;
    player.checkPlayerHealth();
    if (!player.isAlive) {
      console.log('game over');
      const scene = this.game.currentScene as Card;
      scene.gameOverGui.showPanel();
      return;
    }
    const currentIndices = [...this.content.indices];
    const targetIndices = [...targetCard.content.indices];
    const followIndices = [...followCard.content.indices];

    // 更新卡牌的坐标信息
    this.content.indices = targetIndices;
    followCard.content.indices = currentIndices;
    targetCard.content.indices = followIndices;

    /* 执行卡牌动画 */
    // 处理目标卡牌
    targetCard.scale.set(0);
    targetCard.visible = false;

    // 移动玩家卡牌
    moveCardTween(
      this.parent.tween,
      this,
      {
        x:
          targetIndices[0] * (this.wrap.width + this.parent.cardSpace) +
          this.game.config.half_w,
        y:
          targetIndices[1] * (this.wrap.height + this.parent.cardSpace) +
          this.game.config.half_h,
      },
      () => {
        // 被处理的卡牌重置
        targetCard.position.set(
          followIndices[0] * (this.wrap.width + this.parent.cardSpace) +
            this.game.config.half_w,
          followIndices[1] * (this.wrap.height + this.parent.cardSpace) +
            this.game.config.half_h
        );

        targetCard.setContent(
          this.parent.weightRandomGenerator.random(),
          followIndices
        );
        targetCard.visible = true;
        generateCardTween(this.parent.tween, targetCard);
      }
    );

    // 跟随卡牌移动
    moveCardTween(this.parent.tween, followCard, {
      x:
        currentIndices[0] * (this.wrap.width + this.parent.cardSpace) +
        this.game.config.half_w,
      y:
        currentIndices[1] * (this.wrap.height + this.parent.cardSpace) +
        this.game.config.half_h,
    });

  }
}

export default CheckerCardWrap;
