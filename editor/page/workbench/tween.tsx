/*
 * @Author: kunnisser
 * @Date: 2023-06-29 14:57:08
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-10 23:53:08
 * @FilePath: \kunigame\editor\page\workbench\tween.tsx
 * @Description: ---- tween动画工作台 ----
 */
import { CombineReducer } from "editor@/common/store";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Game from "ts@/kuni/lib/core";
import * as _ from "lodash";
import {
  setDefaultTween,
  setScaleTween,
  setScaleTweenVars,
  setTweenVars
} from "editor@/common/gameStore/scene/action";
let previewGame: any = null;
let tweenContainer: any = null;
let tweenItem: any = null;
const TweenEditor = (props: any) => {
  const ref = useRef({
    tween: null,
    defaultTween: null,
    scaleTween: null,
    progress: 0
  } as any);
  const dispatch = useDispatch();
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const currentGameItem = useSelector(
    (store: CombineReducer) => store.sceneReducer.gameItem
  );
  const game = useSelector((store: CombineReducer) => store.sceneReducer.game);
  const tweenVars = useSelector(
    (store: CombineReducer) => store.sceneReducer.tweenVars
  );
  const scaleTweenVars = useSelector(
    (store: CombineReducer) => store.sceneReducer.scaleTweenVars
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

  const defaultScaleTweenVars = {
    scale: { x: 1, y: 1 },
    scaleloop: false,
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
      tweenContainer = previewGame.add.group("tweenGroup", previewGame.world);
      tweenContainer.position.set(previewGame.editX, previewGame.editY);
      ref.current.tween = previewGame.add.tween();
    } else {
      previewGame.stage.removeChildren();
    }
  }, []);

  const generateTween = (target) => {
    const tween = ref.current.tween;
    const [originItem] = currentGameItem;
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
      progress,
      delay
    } = tweenVars || defaultTweenVars;

    // 初始对象属性
    const originVars = {
      x: originItem.x,
      y: originItem.y,
      alpha: originItem.alpha,
      angle: originItem.angle
    };

    ref.current.defaultTween &&
      (ref.current.defaultTween.pause(0).kill(),
        (ref.current.defaultTween = null));
    ref.current.defaultTween = tween.instance.to(target, duration, {
      startAt: originVars,
      x: "+=" + x,
      y: "+=" + y,
      angle: "+=" + angle,
      alpha: alpha || originItem.alpha,
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
    ref.current.defaultTween &&
      ref.current.defaultTween.progress(progress).pause();
  };

  const generateScaleTween = (target) => {
    const tween = ref.current.tween;
    const [originItem] = currentGameItem;
    const {
      duration,
      scale,
      scaleloop,
      yoyo,
      repeat,
      ease,
      inout,
      progress,
      delay
    } = scaleTweenVars || defaultScaleTweenVars;

    // 初始对象属性
    const originScaleVars = {
      x: originItem.scale.x,
      y: originItem.scale.y
    };

    ref.current.scaleTween &&
      (ref.current.scaleTween.pause(0).kill(),
        (ref.current.scaleTween = null));
    ref.current.scaleTween = tween.instance.to(target.scale, duration, {
      startAt: originScaleVars,
      x: originScaleVars.x * scale.x,
      y: originScaleVars.y * scale.y,
      paused: true,
      delay,
      yoyo,
      repeat,
      ease: tween[ease][inout],
      onComplete: () => {
        scaleloop &&
          ref.current.scaleTween &&
          ref.current.scaleTween.seek(0).restart(true);
      }
    });
    ref.current.scaleTween &&
      ref.current.scaleTween.progress(progress).pause();
  };


  useEffect(() => {
    if (!tweenItem) {
      return;
    }

    generateTween(tweenItem);
    dispatch(setDefaultTween(ref.current.defaultTween));
  }, [tweenVars]);

  useEffect(() => {
    if (!tweenItem) {
      return;
    }
    generateScaleTween(tweenItem);
    dispatch(setScaleTween(ref.current.scaleTween));
  }, [scaleTweenVars]);

  useEffect(() => {
    if (currentScene && tweenContainer) {
      if (currentGameItem) {
        const [cloneGameItem]: any = _.cloneDeep(currentGameItem);
        cloneGameItem.interactive = false;
        tweenContainer.removeChildren();
        tweenContainer.addChild(cloneGameItem);
        tweenItem = cloneGameItem;
        cloneGameItem && generateTween(cloneGameItem);

        // 初始渲染设置默认值
        dispatch(setTweenVars(defaultTweenVars));
        dispatch(setScaleTweenVars(defaultScaleTweenVars));
      } else {
        tweenContainer.removeChildren();
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
