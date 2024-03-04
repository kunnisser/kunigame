/*
 * @Author: kunnisser
 * @Date: 2024-02-25 22:30:29
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-04 16:23:08
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/gui/end.ts
 * @Description: ---- 游戏结束 ----
 */

import Card from "../scene";
import Game from "ts@/kuni/lib/core";
import KnModal from "ts@/kuni/lib/gameui/kn_modal";
import { IModalOptions } from 'ts@/kuni/lib/gameui/kn_modal';
import { rem } from "ts@/kuni/lib/utils/common";
import { KnButton } from "ts@/kuni/lib/gameobjects/kn_factory";
import { InteractionEvent } from "pixi.js";

class GameOverGui {
  scene: Card;
  game: Game;
  restartButton: KnButton;
  modal: KnModal;
  constructor(game: Game, parent: Card) {
    this.game = game;
    this.scene = parent;
    this.initGenerator();
  }

  initGenerator() { 
    const options: IModalOptions = {
      modalBg: 'panelBg',
      titleBg: 'panelTitle',
      close: null,
      maskCloseAble: false,
      opacity: 0.9,
      panels: [
        {
          title: '游戏失败',
          build: this.addInfo,
        },
      ],
    };
    this.modal = new KnModal(this.game, this.scene, options);
  }

  addInfo = (modal) => {
    this.restartButton = this.game.add.button(
      'restart',
      'restart',
      null,
      modal.content,
      [0.5, 0.5]
    );
    this.restartButton.position.set(
      modal.overlay.width * 0.5,
      modal.overlay.height * 0.5
    );
    this.restartButton.next = this.restart;
    const score = this.game.add.image('', 'score', modal.content);
    score.y = modal.overlay.height * 0.81;
    const scoreTitle = this.game.add.section(
      '历史最高',
      '100',
      rem(30),
      modal.content,
      {
        padding: [rem(40), rem(10)],
        bg: 0xe5b240,
        border: rem(20),
        space: rem(20),
      }
    );
    scoreTitle.position.set(
      score.width + rem(30),
      score.y + (score.height - scoreTitle.height) * 0.5
    );
  };

  restart = (e: InteractionEvent) => {
    this.game.hive["Card"].reset().create();
  };
}

export default GameOverGui;
