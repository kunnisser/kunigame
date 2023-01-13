/*
 * @Author: kunnisser
 * @Date: 2021-01-25 17:10:45
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-01-13 17:17:03
 * @FilePath: /kunigame/editor/page/workbench/canvas.tsx
 * @Description: ---- 画布编辑 ----
 */
import React, { useEffect } from "react";
import Game from "ts@/kuni/lib/core";
import GameInitial from "ts@/kuni/main";
import { useDispatch } from "react-redux";
import {
  GET_SCENE_LIST,
  SET_CURRENT_SCENE
} from "editor@/common/gameStore/scene/action";

const StageEditor = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const view: any = document.getElementById("stage");
    const game: Game = GameInitial(view); // 初始化游戏场景列表

    dispatch({
      type: GET_SCENE_LIST,
      payload: game.sceneManager.scenes
    }); // 获取当前游戏场景

    dispatch({
      type: SET_CURRENT_SCENE,
      payload: game.entryHive
    });
  }, []);
  return <div id="stage"></div>;
};

export default StageEditor;
