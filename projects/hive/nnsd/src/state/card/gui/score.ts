/*
 * @Author: kunnisser
 * @Date: 2024-02-14 13:58:23
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-14 17:35:51
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/gui/score.ts
 * @Description: ---- 计分栏 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnBitMapText from 'ts@/kuni/lib/gameobjects/kn_bitmap_text';
import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import { KnTween } from 'ts@/kuni/lib/gameobjects/kn_tween';
import { textUpdateTween } from '../tween';

class ScoreBar extends KnGroup {
  game: Game;
  score: number;
  scoreText: KnBitMapText;
  tween: KnTween;
  constructor(game: Game, parent: KnScene) {
    super(game, 'scoreBar', parent);
    this.game = game;
    this.score = 0;
    this.tween = this.game.add.tween();
    this.initial();
  }

  initial() {
    this.scoreText = this.game.add.bitmapText(
      'score',
      this.score + '',
      {
        fontName: 'font_a',
        fontSize: 100,
      },
      [0.5, 0.5]
    );
    this.addChild(this.scoreText);
    this.position.set(this.game.config.half_w, 100);
  }

  updateScore(score: number) {
    this.score = score;
    this.scoreText.text = score + '';
    textUpdateTween(this.tween, this.scoreText);
  }
}

export default ScoreBar;
