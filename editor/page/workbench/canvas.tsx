/*
 * @Author: kunnisser
 * @Date: 2021-01-25 17:10:45
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-20 16:14:30
 * @FilePath: /kunigame/editor/page/workbench/canvas.tsx
 * @Description: ---- 画布编辑 ----
 */
import React, { useEffect } from "react";
import Game from "ts@/kuni/lib/core";
import GameInitial from "ts@/hive/nnsd/main";
import { useDispatch, useStore } from "react-redux";
import { getGame, getSceneList } from "editor@/common/gameStore/scene/action";
import { message } from "antd";
import { addAssetsScene } from "editor@/api/request/scene";
export const EditGameName = "nnsd";

const StageEditor = (props: any) => {
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
      const { dragTarget, currentScene } = store.getState().sceneReducer;
      console.log(currentScene.resources, dragTarget.key);
      if (currentScene.resources[dragTarget.key]) {
        message.warning("资源已存在");
      } else {
        console.log(dragTarget);
        addAssetsScene(
          Object.assign(
            { projectName: EditGameName, sceneName: currentScene.id },
            dragTarget
          )
        );
      }
    });
  }, []);

  const dropOver = (e) => {
    e.preventDefault();
  };

  return <div id="stage" onDragOver={dropOver}></div>;
};

export default StageEditor;
