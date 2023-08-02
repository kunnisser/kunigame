/*
 * @Author: kunnisser
 * @Date: 2023-08-02 17:24:15
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-08-02 17:25:53
 * @FilePath: /kunigame/projects/hive/nnsd/preview.ts
 * @Description: ----  ----
 */

import Game from "ts@/kuni/lib/core";
import GameInitial from "./main";

const view: any = document.getElementById("stage"); // 初始化游戏场景列表
const game: Game = GameInitial(view);
console.log(game);
