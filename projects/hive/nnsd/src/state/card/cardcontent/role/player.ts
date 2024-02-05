/*
 * @Author: kunnisser
 * @Date: 2024-02-02 15:41:11
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-05 23:01:13
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\cardcontent\role\player.ts
 * @Description: ---- 玩家角色1 ----
 */
import CheckerCardWrap from '../../checkerboard/checkerCard';
import Game from 'ts@/kuni/lib/core';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import CardContent from '../content';
import { Point } from 'pixi.js';
class Don extends CardContent {
  game: Game;
  sprite: KnSprite;
  parent: CheckerCardWrap;
  currentGlobal: Point;
  constructor(game: Game, parent: CheckerCardWrap) {
    super(game, parent);
    this.game = game;
    this.parent = parent;
    this.attribute = 'player';
    this.race = 'human';
    this.initial();
  }

  initial() {
    // const role = this.setRole('tex', 'role');
    // role.scale.set(0.25);
    // role.y += role.getBounds().height * 0.25;
    // role.animation.play('idle');
    // role.animation.timeScale = 2;
    this.currentGlobal = new Point(0, 0);
  }

  onClick() {}

  onMove(target: CheckerCardWrap, event: any) {}
}

export default Don;
