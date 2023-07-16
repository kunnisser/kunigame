/*
 * @Author: kunnisser
 * @Date: 2023-02-13 16:52:09
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-15 16:32:26
 * @FilePath: \kunigame\editor\page\outline\inspector_config\index.tsx
 * @Description: ---- 目标元素内容配置层 ----
 */
import React from "react";
import "editor@/assets/dat-gui.styl";
import TweenDatGui from "./tween";
import ParticleDatGui from "./particle";
import SceneDatGui from "./scene";

const Inspector = (props: any) => {


  const renderer = () => {
    return {
      "scene": <SceneDatGui></SceneDatGui>,
      "tween": <TweenDatGui></TweenDatGui>,
      "particle": <ParticleDatGui></ParticleDatGui>,
      "animation": <>123123</>
    };
  };

  return renderer()[props.type];
};

export default Inspector;
