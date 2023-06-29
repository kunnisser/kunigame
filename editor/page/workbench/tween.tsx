/*
 * @Author: kunnisser
 * @Date: 2023-06-29 14:57:08
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-29 15:12:29
 * @FilePath: /kunigame/editor/page/workbench/tween.tsx
 * @Description: ---- tween动画工作台 ----
 */
import { CombineReducer } from "editor@/common/store";
import React, { useEffect } from "react";
import { useSelector, useStore } from "react-redux";
const TweenEditor = () => {
  // const store = useStore();
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  useEffect(() => {
    if (currentScene) {
      console.log(currentScene);
    }
  }, [currentScene]);
  return <>123</>;
};

export default TweenEditor;
