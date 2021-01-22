/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:21:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-22 17:29:30
 * @FilePath: /kunigame/editor/page/wireboard.tsx
 * @Description: ---- 酷尼游戏控制台 ----
 */

import React, { useEffect } from 'react';
import GameInitial from 'ts@/kuni/main';
const WireBoard = () => {
  useEffect(() => {
    const view: any = document.getElementById('stage');
    GameInitial(view);
  });
  return <div>
    哈哈
    {/* <div id="stage"></div> */}
  </div>;
}

export default WireBoard;