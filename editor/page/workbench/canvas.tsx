/*
 * @Author: kunnisser
 * @Date: 2021-01-25 17:10:45
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-25 17:12:16
 * @FilePath: /kunigame/editor/page/workbench/canvas.tsx
 * @Description: ---- 画布编辑 ----
 */

import React, { useEffect } from 'react';
import GameInitial from 'ts@/kuni/main';
const StageEditor = () => {
  useEffect(() => {
    const view: any = document.getElementById('stage');
    GameInitial(view);
  });
  return <div id="stage"></div>;
}

export default StageEditor;
