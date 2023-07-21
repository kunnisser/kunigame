/*
 * @Author: kunnisser
 * @Date: 2023-02-13 16:52:09
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-21 09:41:41
 * @FilePath: /kunigame/editor/page/outline/inspector_config/index.tsx
 * @Description: ---- 目标元素内容配置层 ----
 */
import React from "react";
import "editor@/assets/dat-gui.styl";
import TweenDatGui from "./tween";
import ParticleDatGui from "./particle";
import SceneDatGui from "./scene";
import AnimationDatGui from "./animation";

const Inspector = (props: any) => {
  const renderer = () => {
    return {
      "scene": <SceneDatGui></SceneDatGui>,
      "tween": <TweenDatGui></TweenDatGui>,
      "particle": <ParticleDatGui></ParticleDatGui>,
      "animation": <AnimationDatGui></AnimationDatGui>
    };
  };

  return renderer()[props.type];
};

export default Inspector;
