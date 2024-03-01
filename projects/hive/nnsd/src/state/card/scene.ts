/*
 * @Author: kunnisser
 * @Date: 2024-02-01 17:13:42
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-01 15:01:21
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/scene.ts
 * @Description: ---- 卡牌 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import CheckerLayout from './checkerboard/checkerLayout';
import ScoreBar from './gui/score';
import LevelBar from './gui/level';
// import GameOverGui from './gui/end';
import KnScrollMenu from 'ts@/kuni/lib/gameui/kn_scrollMenu';
import { TransformImage, rem } from 'ts@/kuni/lib/utils/common';
import KnModal, { IModalOptions } from 'ts@/kuni/lib/gameui/kn_modal';

class Card extends KnScene {
  game: Game;
  layout: CheckerLayout;
  scoreBar: ScoreBar;
  level: LevelBar;
  gameOverGui: KnModal;
  restart: any;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      bg: 'assets/images/bg.png',
      cardWrap: 'assets/images/cardWrap.png',
      playerCardWrap: 'assets/images/playerCardWrap.png',
      health: 'assets/images/health.png',
      healthPlus: 'assets/images/healthPlus.png',
      orange: 'assets/images/orange.png',
      texSke: 'assets/atlas/role_ske.json',
      texData: 'assets/atlas/role_tex.json',
      tex: 'assets/atlas/role_tex.png',
      skullBoneSke: 'assets/atlas/skull_ske.json',
      skullBoneData: 'assets/atlas/skull_tex.json',
      skullBone: 'assets/atlas/skull_tex.png',
      druidBoneSke: 'assets/atlas/deluyi_ske.json',
      druidBoneData: 'assets/atlas/deluyi_tex.json',
      druidBone: 'assets/atlas/deluyi_tex.png',
      font_a: 'assets/fonts/font_a.fnt',
      font_b: 'assets/fonts/font_b.fnt',
      cureFont: 'assets/fonts/cureFont.fnt',
      treat: 'assets/images/treat.png',
      skills: 'assets/atlas/skills.json',
      levelOutbar: 'assets/images/levelOutbar.png',
      levelInnerbar: 'assets/images/levelInnerbar.png',
      levelMaskBar: 'assets/images/levelMaskBar.png',
      restart: 'assets/images/restart.png',
      menu: 'assets/images/waterPlanet.png',
      panelTitle: 'assets/images/modalTitle.png',
      panelBg: 'assets/images/panelBg.png',
      score: 'assets/images/score.png',
      close: 'assets/images/close.png',
    };
  }

  boot() {}

  create() {
    const gameBg = this.game.add.background('bg', 'bg');
    this.layout = new CheckerLayout(this.game);
    this.scoreBar = new ScoreBar(this.game, this);
    this.addChild(gameBg, this.layout, this.scoreBar);
    this.layout.y -= 50;
    this.level = new LevelBar(this.game, this);
    this.createMenu();
    this.createGameOverScene();
  }

  createGameOverScene = () => {
    const options: IModalOptions = {
      modalBg: 'panelBg',
      titleBg: 'panelTitle',
      close: 'close',
      maskCloseAble: false,
      opacity: 0.9,
      panels: [
        {
          title: '游戏失败',
          build: this.addInfo,
        },
      ],
    };
    this.gameOverGui = new KnModal(this.game, this, options);
  };

  addInfo = (modal) => {
    this.restart = this.game.add.button(
      'restart',
      'restart',
      null,
      modal.content,
      [0.5, 0.5]
    );
    this.restart.position.set(
      modal.overlay.width * 0.5,
      modal.overlay.height * 0.5
    );
    this.restart.next = this.start;
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
    // const size = 24;
    // const attack = this.game.add.section("攻击力", "50-120", size, modal.content, {
    //   padding: 6,
    //   bg: 0x00a6cc
    // });
  };

  start = () => {
    this.game.hive["Card"].reset().create();
    // this.game.currentScene.create();
  };

  createMenu() {
    const options = [
      {
        key: 'menu',
        name: '富甲天下',
        // callback: () => {
        //   this.modal.showPanel()
        // }
      },
      {
        key: 'menu',
        name: '先知',
      },
      {
        key: 'menu',
        name: '段正淳',
        callback: () => {
          console.log('段段小鸡鸡');
        },
      },
      {
        key: 'menu',
        name: '排行榜',
      },
      {
        key: 'menu',
        name: '我服',
      },
      {
        key: 'menu',
        name: '排行榜1',
      },
      {
        key: 'menu',
        name: '我服1',
      },
    ];
    const scrollMenu = new KnScrollMenu(this.game, this, options, !0, 1.6);
    const bgRect = this.game.add
      .graphics()
      .generateRect(0xd10311, [0, 0, this.game.config.width, rem(300)], !0);
    const menuBg = TransformImage.transformToSprite(
      this.game,
      bgRect,
      scrollMenu
    );
    menuBg.alpha = 0;
    menuBg.anchor.set(0.5);
    scrollMenu.position.set(
      this.game.config.half_w,
      this.game.config.height - menuBg.height * 0.5
    );
    scrollMenu.initial(menuBg);
  }

  update() {}

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(0, this.children.length);
    }
    return this;
  }
}

export default Card;
