/*
 * @Author: kunnisser
 * @Date: 2023-08-02 17:24:15
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-08-02 23:51:25
 * @FilePath: \kunigame\projects\hive\nnsd\preview.ts
 * @Description: ----  ----
 */

import Game from 'ts@/kuni/lib/core';
import StateHive from './src/state/hive';
import Config from './schema/game.json';

const view: any = document.getElementById('stage'); // 初始化游戏场景列表
const dpr = window.devicePixelRatio;
console.log(view.clientWidth, dpr);
const game = new Game({
  width: view.clientWidth * dpr, // Config.width,
  ratio: view.clientWidth / view.clientHeight, // Config.ratio,
  antialias: Config.antialias,
  transparent: Config.transparent,
  view,
  isPureCanvas: true,
});
const GameHive = StateHive(game);
game.entryHive = GameHive['Ast'];
game.sceneManager.dispatchEditScene(GameHive['Ast']);
