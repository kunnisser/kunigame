/*
 * @Author: kunnisser
 * @Date: 2023-08-02 17:24:15
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-08-03 10:59:12
 * @FilePath: /kunigame/projects/hive/nnsd/preview.ts
 * @Description: ----  ----
 */

import Game from "ts@/kuni/lib/core";
import StateHive from "./src/state/hive";
import Config from "./schema/game.json";
import Preloader from "ts@/kuni/lib/loader/kn_preloader";

const view: any = document.getElementById("stage"); // 初始化游戏场景列表
const dpr = window.devicePixelRatio;
console.log(view.clientWidth, dpr);
const game = new Game({
  width: view.clientWidth * dpr, // Config.width,
  ratio: view.clientWidth / view.clientHeight, // Config.ratio,
  antialias: Config.antialias,
  transparent: Config.transparent,
  view,
  isPureCanvas: true
});
const GameHive = StateHive(game);
game.entryHive = GameHive["Ast"];
const previewLoader = game.sceneManager.addScene("global_preloader", Preloader);
game.sceneManager.changeScene(null, previewLoader);
