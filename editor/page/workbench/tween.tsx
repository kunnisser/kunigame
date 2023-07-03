/*
 * @Author: kunnisser
 * @Date: 2023-06-29 14:57:08
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-03 14:05:57
 * @FilePath: /kunigame/editor/page/workbench/tween.tsx
 * @Description: ---- tween动画工作台 ----
 */
import { CombineReducer } from "editor@/common/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Game from "ts@/kuni/lib/core";
import * as _ from "lodash";
import { setTweenGameItem } from "editor@/common/gameStore/scene/action";
let previewGame: any = null;
let tweenCotainer: any = null;
const TweenEditor = () => {
  const dispatch = useDispatch();
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const currentGameItem = useSelector(
    (store: CombineReducer) => store.sceneReducer.gameItem
  );

  const cancelActionStack = useSelector(
    (store: CombineReducer) => store.sceneReducer.cancelActionStack
  );

  const game = useSelector((store: CombineReducer) => store.sceneReducer.game);

  useEffect(() => {
    const previewTweenDom: any = document.getElementById("previewTween");
    if (!previewGame) {
      const dpr = window.devicePixelRatio;

      previewGame = new Game({
        width: previewTweenDom.clientWidth * dpr * 2,
        ratio: previewTweenDom.clientWidth / previewTweenDom.clientHeight,
        dpr,
        antialias: true,
        transparent: true,
        view: previewTweenDom,
        isPureCanvas: true,
        editorWidth: game.config.editorWidth,
        editorHeight: game.config.editorHeight
      });
      previewTweenDom.appendChild(previewGame.app.view);
      tweenCotainer = previewGame.add.group("tweenGroup", previewGame.world);
      tweenCotainer.position.set(previewGame.editX, previewGame.editY);
    } else {
      previewGame.stage.removeChildren();
    }
  }, []);

  const generateTween = (targets) => {
    dispatch(setTweenGameItem(targets));
  };

  useEffect(() => {
    if (currentScene && tweenCotainer) {
      if (currentGameItem) {
        const cloneGameItems: any = _.cloneDeep(currentGameItem);
        tweenCotainer.removeChildren();
        tweenCotainer.addChild(...cloneGameItems);
        generateTween(cloneGameItems);
      } else {
        tweenCotainer.removeChildren();
      }
    }
  }, [currentScene, currentGameItem, cancelActionStack]);
  return (
    <>
      <div id="previewTween"></div>
    </>
  );
};

export default TweenEditor;
