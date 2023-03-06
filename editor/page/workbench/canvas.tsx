/*
 * @Author: kunnisser
 * @Date: 2021-01-25 17:10:45
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-06 13:47:25
 * @FilePath: /kunigame/editor/page/workbench/canvas.tsx
 * @Description: ---- 画布编辑 ----
 */
import React, { useEffect } from "react";
import Game from "ts@/kuni/lib/core";
import GameInitial from "ts@/hive/nnsd/main";
import { useDispatch } from "react-redux";
import { getGame, getSceneList } from "editor@/common/gameStore/scene/action";
export const EditGameName = "nnsd";

const StageEditor = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const view: any = document.getElementById("stage");

    // 初始化游戏场景列表
    const game: Game = GameInitial(view);
    game.redux = {
      dispatch
    };

    // 获取所有游戏场景
    // 保存游戏所有场景列表
    dispatch(getSceneList(game.sceneManager.scenes));

    // 储存游戏实例
    dispatch(getGame(game));
  }, []);
  return <div id="stage"></div>;
};

export default StageEditor;
