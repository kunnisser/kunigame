/*
 * @Author: kunnisser
 * @Date: 2023-06-29 14:57:08
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-30 17:34:29
 * @FilePath: /kunigame/editor/page/workbench/tween.tsx
 * @Description: ---- tween动画工作台 ----
 */
import { CombineReducer } from "editor@/common/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Game from "ts@/kuni/lib/core";
import * as _ from "lodash";
let previewGame: any = null;
let tweenCotainer: any = null;
const TweenEditor = () => {
  // const store = useStore();
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

  const generateTween = (target) => {
    const tween = previewGame.add.tween();
    tween.instance.to(target, 1, {
      angle: 96,
      ease: tween.linear.easeNone,
      repeat: -1,
      yoyo: true
    });
  };

  useEffect(() => {
    if (currentScene && tweenCotainer) {
      if (currentGameItem && currentGameItem.length === 1) {
        const cloneGameItem: any = _.cloneDeep(currentGameItem[0]);
        tweenCotainer.removeChildren();
        tweenCotainer.addChild(cloneGameItem);
        generateTween(cloneGameItem);
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
