/*
 * @Author: kunnisser
 * @Date: 2023-06-30 16:44:49
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-04 17:33:52
 * @FilePath: /kunigame/editor/page/outline/inspector_config/tween/index.tsx
 * @Description: ----  ----
 */
import React, { useEffect, useRef, useState } from "react";
import DatGui from "react-dat-gui";
import { DatProperties } from "../config";
import DatTweenPropertyConfig from "./config";
import { debounce } from "ts@/kuni/lib/utils/common";
import { useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import Game from "ts@/kuni/lib/core";
import * as _ from "lodash";

let originTarget: any = null;
const TweenDatGui = () => {
  const ref = useRef({
    defaultTween: null,
    scaleTween: null
  } as any);
  const [tweenItem, setTweenItem] = useState({
    x: 0,
    y: 0,
    scale: { x: 1, y: 1 },
    repeat: 0,
    alpha: 1,
    angle: 0,
    delay: 0,
    duration: 1,
    yoyo: false,
    scaleloop: false,
    ease: "linear",
    inout: "easeNone"
  });
  const game: Game = useSelector(
    (store: CombineReducer) => store.sceneReducer.game
  );
  const targets = useSelector(
    (store: CombineReducer) => store.sceneReducer.tweenGameItems
  );

  useEffect(() => {
    console.log("tween's obj changed");
    if (targets) {
      [originTarget] = _.cloneDeep(targets);
    }
  }, [targets]);

  const handleUpdate = (tweenInfo: any) => {
    debounce.handler(() => {
      console.log(tweenInfo);
      const {
        duration,
        x,
        y,
        scale,
        yoyo,
        alpha,
        repeat,
        angle,
        ease,
        inout,
        delay,
        scaleloop
      } = tweenInfo;
      const tween = game.add.tween();

      // 初始对象属性
      const originVars = {
        x: originTarget.x,
        y: originTarget.y,
        alpha: originTarget.alpha,
        angle: originTarget.angle
      };

      // 初始对象缩放
      const originScaleVars = {
        x: originTarget.scale.x,
        y: originTarget.scale.y
      };
      console.log(originVars);
      ref.current.defaultTween && ref.current.defaultTween.kill();
      ref.current.defaultTween = tween.instance.to(targets, duration, {
        startAt: originVars,
        x: "+=" + x,
        y: "+=" + y,
        angle: "+=" + angle,
        alpha: alpha || originTarget.alpha,
        delay,
        yoyo,
        repeat,
        ease: tween[ease][inout]
      });

      ref.current.scaleTween && ref.current.scaleTween.kill();
      ref.current.scaleTween = null;
      ref.current.scaleTween = tween.instance.to(targets[0].scale, duration, {
        startAt: originScaleVars,
        x: originScaleVars.x * scale.x,
        y: originScaleVars.y * scale.y,
        delay,
        yoyo,
        repeat,
        ease: tween[ease][inout],
        onComplete: () => {
          scaleloop &&
            ref.current.scaleTween &&
            ref.current.scaleTween.restart(true);
        }
      });
    }, 500);
    setTweenItem(tweenInfo);
  };

  const generateConfigCard = (configs?: any) => {
    const itemConfigs: Array<DatProperties> =
      configs || DatTweenPropertyConfig(ref);
    return itemConfigs.map((config: DatProperties) => {
      if (config.children) {
        const { component: Folder, label, ...props } = config;
        return (
          <Folder key={label} title={label} {...props} closed={false}>
            {generateConfigCard(config.children)}
          </Folder>
        );
      } else {
        const { component: DatItem, label, path, ...props } = config;
        const paths = path ? path.join(".") : "";
        return (
          <DatItem key={paths} path={paths} label={label} {...props}></DatItem>
        );
      }
    });
  };
  return (
    <DatGui data={tweenItem} onUpdate={handleUpdate}>
      {generateConfigCard()}
    </DatGui>
  );
};

export default TweenDatGui;
