/*
 * @Author: kunnisser
 * @Date: 2023-09-24 21:44:29
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-24 22:39:35
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\welcome\ui\level.ts
 * @Description: ---- 等级条 ----
 */

import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import Welcome from '../scene';
import Game from 'ts@/kuni/lib/core';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';

class LevelBar extends KnGroup {
  game: Game;
  outBar: KnSprite;
  innerBar: KnSprite;
  maskBar: KnSprite;
  level: number;
  levelInfo: import('e:/code/kunigame/projects/kuni/lib/gameobjects/kn_text').default;
  constructor(game: Game, parent: Welcome) {
    super(game, 'levelBar', parent);
    this.generator();
    this.game = game;
  }

  generator() {
    this.outBar = this.game.add.image(
      'outBar',
      'levelOutbar',
      this,
      [0.5, 0.5]
    );
    this.innerBar = this.game.add.image(
      'innerBar',
      'levelInnerbar',
      this,
      [0, 0.5]
    );
    this.innerBar.x -= this.innerBar.width * 0.5;
    this.maskBar = this.game.add.image(
      'maskBar',
      'levelMaskBar',
      this,
      [0, 0.5]
    );
    this.maskBar.x = -this.maskBar.width * 0.5;
    this.maskBar.x += 400;
    this.innerBar.mask = this.maskBar;
    this.level = 1;
    this.levelInfo = this.game.add.text(
      'levelInfo',
      'Lv.' + this.level,
      {
        fontSize: 40,
        fontWeight: 'bold',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 20,
      },
      [0.5, 0.5]
    );
    this.addChild(this.levelInfo);
    this.position.set(this.game.config.half_w, this.outBar.height);
  }
}

export default LevelBar;
