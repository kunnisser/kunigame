/*
 * @Author: kunnisser
 * @Date: 2024-02-02 13:53:45
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-04 23:16:30
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

class CheckerCardWrap extends KnGroup {
  game: Game;
  wrap: KnSprite;
  parent: CheckerLayout;
  content: CardContent;
  type: string | void; // 卡片类型
  constructor(game: Game, parent: CheckerLayout, type?: string) {
    super(game, 'cardWrap', parent);
    this.parent = parent;
    this.game = game;
    this.type = type;
    this.initialWrap();
    this.setContent();
    this.interaction();
  }

  initialWrap() {
    this.wrap = this.game.add.image('cardWrap', 'cardWrap', this, [0.5, 0.5]);

    // 根据layout的尺寸来设置卡牌外壳的宽高尺寸
    this.wrap.width = this.parent.latticeWidth;
    this.wrap.height = this.parent.latticeHeight;
  }

  // 根据卡片类型 设置卡片内容元素
  setContent() {
    if (this.type) {
      this.content = new CardContentMap[this.type](this.game, this);
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
          const direct: string | void = this.computedPlayerDirection(
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

  // 卡牌销毁
  cardDestroy(cardIndex: number) {
    this.visible = false;
  }
}

export default CheckerCardWrap;
