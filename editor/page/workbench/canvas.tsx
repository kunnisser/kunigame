/*
 * @Author: kunnisser
 * @Date: 2021-01-25 17:10:45
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-06 16:56:34
 * @FilePath: /kunigame/editor/page/workbench/canvas.tsx
 * @Description: ---- 画布编辑 ----
 */
import React, { useEffect } from "react";
import Game from "ts@/kuni/lib/core";
import GameInitial from "ts@/hive/nnsd/main";
import { useDispatch } from "react-redux";
import {
  GET_GAME,
  GET_SCENE_LIST
} from "editor@/common/gameStore/scene/action";

const StageEditor = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const view: any = document.getElementById("stage");
    const game: Game = GameInitial(view); // 初始化游戏场景列表

    // 获取所有游戏场景
    dispatch({
      type: GET_SCENE_LIST,
      payload: game.sceneManager.scenes
    });

    // 传递游戏实例
    dispatch({
      type: GET_GAME,
      payload: game
    });
  }, []);
  return <div id="stage"></div>;
};

export default StageEditor;
