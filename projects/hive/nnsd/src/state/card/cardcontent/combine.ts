/*
 * @Author: kunnisser
 * @Date: 2024-02-02 17:26:23
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-14 21:26:21
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/cardcontent/combine.ts
 * @Description: ---- 卡牌内容集合 ----
 */

import Mobs from './mobs';
import Fruit from './resource/fruit';
import Don from './role/player';

export const CardContentMap = {
  don: Don,
  mobs: Mobs,
  fruit: Fruit,
};
