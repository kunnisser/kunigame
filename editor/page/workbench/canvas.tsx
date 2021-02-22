/*
 * @Author: kunnisser
 * @Date: 2021-01-25 17:10:45
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-22 13:27:01
 * @FilePath: /kunigame/editor/page/workbench/canvas.tsx
 * @Description: ---- 画布编辑 ----
 */

import React, { useEffect } from 'react';
import Game from 'ts@/kuni/lib/core';
import GameInitial from 'ts@/kuni/main';
import { useDispatch } from 'react-redux';
import { GET_SCENE_LIST } from 'editor@/common/gameStore/scene/action';
const StageEditor = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const view: any = document.getElementById('stage');
    const game: Game = GameInitial(view);

    dispatch({
      type: GET_SCENE_LIST,
      payload: game.sceneManager.scenes
    });
  }, []);
  return <div id="stage"></div>;
}

export default StageEditor;
