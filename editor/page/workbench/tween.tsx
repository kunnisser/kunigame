/*
 * @Author: kunnisser
 * @Date: 2023-06-29 14:57:08
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-07 17:16:25
 * @FilePath: /kunigame/editor/page/workbench/tween.tsx
 * @Description: ---- tween动画工作台 ----
 */
import { CombineReducer } from "editor@/common/store";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Game from "ts@/kuni/lib/core";
import * as _ from "lodash";
import {
  setDefaultTween,
  setTweenGameItem
} from "editor@/common/gameStore/scene/action";
import { debounce } from "ts@/kuni/lib/utils/common";
let previewGame: any = null;
let tweenCotainer: any = null;
let tweenItem: any = null;
const TweenEditor = (props: any) => {
  const ref = useRef({
    tween: null,
    defaultTween: null,
    scaleTween: null
  } as any);
  const dispatch = useDispatch();
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const currentGameItem = useSelector(
    (store: CombineReducer) => store.sceneReducer.gameItem
  );

  const game = useSelector((store: CombineReducer) => store.sceneReducer.game);
  const vars = useSelector(
    (store: CombineReducer) => store.sceneReducer.tweenGameItems
  );

  const { type } = props;

  const defaultTweenVars = {
    x: 0,
    y: 0,
    alpha: 1,
    angle: 0,
    loop: false,
    repeat: 0,
    delay: 0,
    duration: 1,
    yoyo: false,
    ease: "linear",
    inout: "easeNone",
    progress: 0
  };

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
      ref.current.tween = previewGame.add.tween();
      // 初始渲染设置默认值
      dispatch(setTweenGameItem(defaultTweenVars));
    } else {
      previewGame.stage.removeChildren();
    }
  }, []);

  const generateTween = (targets) => {
    const tween = ref.current.tween;
    ref.current.defaultTween && ref.current.defaultTween.pause().kill();
    const [originTarget] = _.cloneDeep(targets);
    const {
      duration,
      x,
      y,
      loop,
      yoyo,
      alpha,
      repeat,
      angle,
      ease,
      inout,
      delay
    } = vars || defaultTweenVars;
    console.log(vars);
    console.log(tween, ease);
    console.log(tween[ease]);
    // 初始对象属性
    const originVars = {
      x: originTarget.x,
      y: originTarget.y,
      alpha: originTarget.alpha,
      angle: originTarget.angle
    };
    ref.current.defaultTween = tween.instance.to(targets, duration, {
      startAt: originVars,
      x: "+=" + x,
      y: "+=" + y,
      angle: "+=" + angle,
      alpha: alpha || originTarget.alpha,
      paused: true,
      delay,
      yoyo,
      repeat,
      ease: tween[ease][inout],
      onComplete: () => {
        loop &&
          ref.current.defaultTween &&
          ref.current.defaultTween.seek(0).restart(true);
      }
    });
    dispatch(setDefaultTween(ref.current.defaultTween));
  };

  useEffect(() => {
    debounce.handler(() => {
      console.log(vars);
      generateTween([tweenItem]);
    }, 500);
  }, [vars]);

  useEffect(() => {
    if (currentScene && tweenCotainer) {
      if (currentGameItem) {
        const [cloneGameItem]: any = _.cloneDeep(currentGameItem);
        cloneGameItem.interactive = false;
        tweenCotainer.removeChildren();
        tweenCotainer.addChild(cloneGameItem);
        tweenItem = cloneGameItem;
        generateTween([cloneGameItem]);
      } else {
        tweenCotainer.removeChildren();
      }
    }
  }, [currentScene, currentGameItem, type]);

  return (
    <>
      <div id="previewTween"></div>
    </>
  );
};

export default TweenEditor;
