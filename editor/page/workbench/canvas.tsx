/*
 * @Author: kunnisser
 * @Date: 2021-01-25 17:10:45
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-14 17:26:33
 * @FilePath: /kunigame/editor/page/workbench/canvas.tsx
 * @Description: ---- 画布编辑 ----
 */
import React, { useEffect } from "react";
import Game from "ts@/kuni/lib/core";
import GameInitial from "ts@/hive/nnsd/main";
import { useDispatch, useStore } from "react-redux";
import { getGame, getSceneList } from "editor@/common/gameStore/scene/action";
export const EditGameName = "nnsd";

const StageEditor = (props) => {
  const dispatch = useDispatch();
  const store = useStore();
  useEffect(() => {
    const view: any = document.getElementById("stage"); // 初始化游戏场景列表

    const game: Game = GameInitial(view);
    game.redux = {
      dispatch,
      store
    }; // 获取所有游戏场景
    // 保存游戏所有场景列表

    dispatch(getSceneList(game.sceneManager.scenes)); // 储存游戏实例
    dispatch(getGame(game));

    view.addEventListener("drop", (e) => {
      e.preventDefault();
      console.log(123);
    });
  }, []);

  const dropOver = (e) => {
    e.preventDefault();
  };
  return <div draggable id="stage" onDragOver={dropOver}></div>;
};

export default StageEditor;
