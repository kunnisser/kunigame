/*
 * @Author: kunnisser
 * @Date: 2024-02-01 17:13:42
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-17 23:11:18
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\scene.ts
 * @Description: ---- 卡牌 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import CheckerLayout from './checkerboard/checkerLayout';
import ScoreBar from './gui/score';

class Card extends KnScene {
  game: Game;
  layout: CheckerLayout;
  scoreBar: ScoreBar;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      bg: 'assets/images/bg.png',
      cardWrap: 'assets/images/cardBg.png',
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
      treat: 'assets/images/treat.png',
      skills: 'assets/atlas/skills.json',
    };
  }

  boot() {}

  create() {
    const gameBg = this.game.add.background('bg', 'bg');
    this.layout = new CheckerLayout(this.game);
    this.scoreBar = new ScoreBar(this.game, this);
    this.addChild(gameBg, this.layout, this.scoreBar);
  }

  update() {}

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Card;
