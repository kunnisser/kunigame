/*
 * @Author: kunnisser
 * @Date: 2024-02-01 17:13:42
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-17 23:00:41
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\scene.ts
 * @Description: ---- 卡牌 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import CheckerLayout from './checkerboard/checkerLayout';
import ScoreBar from './gui/score';
import LevelBar from './gui/level';
import { cardPack } from "./gui/pack";
import GameOverGui from './gui/end';

class Card extends KnScene {
  game: Game;
  layout: CheckerLayout;
  scoreBar: ScoreBar;
  level: LevelBar;
  gameOverGui: GameOverGui;
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
      mob: 'assets/images/mob.png',
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
      attack: 'assets/images/attack.png',
      dragon: 'assets/images/dragon.png',
      exp: "assets/images/exp.png",
      star: "assets/images/star.png",
      skillItem: "assets/images/skillItem.png"
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
    cardPack(this.game, this);
    this.createGameOverScene();
  }

  createGameOverScene = () => {
    this.gameOverGui = new GameOverGui(this.game, this);
  };

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
