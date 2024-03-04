/*
 * @Author: kunnisser
 * @Date: 2024-03-04 16:32:47
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-04 16:36:32
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/gui/pack.ts
 * @Description: ---- 创建背包界面 ----
 */

import Game from "ts@/kuni/lib/core";
import Card from "../scene";
import { TransformImage, rem } from "ts@/kuni/lib/utils/common";
import KnScrollMenu from "ts@/kuni/lib/gameui/kn_scrollMenu";

export const cardPack = (game: Game, card: Card ) => { 
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
  const scrollMenu = new KnScrollMenu(game, card, options, !0, 1.6);
  const bgRect = game.add
    .graphics()
    .generateRect(0xd10311, [0, 0, game.config.width, rem(300)], !0);
  const menuBg = TransformImage.transformToSprite(
    game,
    bgRect,
    scrollMenu
  );
  menuBg.alpha = 0;
  menuBg.anchor.set(0.5);
  scrollMenu.position.set(
    game.config.half_w,
    game.config.height - menuBg.height * 0.5
  );
  scrollMenu.initial(menuBg);
} 