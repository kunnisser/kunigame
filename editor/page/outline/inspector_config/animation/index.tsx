/*
 * @Author: kunnisser
 * @Date: 2023-07-19 15:59:33
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-20 17:26:32
 * @FilePath: /kunigame/editor/page/outline/inspector_config/animation/index.tsx
 * @Description: ---- 动画配置面板 ----
 */

import React, { useEffect, useState } from "react";
import { DatAnimationPropertyConfig } from "./config";
import { DatProperties } from "../config";
import DatGui from "react-dat-gui";
import { useDispatch, useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import { setAnimationVars } from "editor@/common/gameStore/scene/action";
const AnimationDatGui = () => {
  const dispatch = useDispatch();
  const [max, setMax] = useState(0);
  const [defaultVal, setDefaultVal] = useState([0, 0]) as any;
  const [currentOptions, setOptions] = useState([] as Array<string>);
  const animationVars = useSelector(
    (store: CombineReducer) => store.sceneReducer.animationVars
  );
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const handleUpdate = (vars) => {
    if (animationVars.name !== vars.name) {
      const loader = currentScene.game.loader.preloader;
      const gameResources = loader.resources;
      const resourceKeys = Object.keys(currentScene.resources);
      const atlasKeys: Array<string> = resourceKeys.filter((key: string) => {
        return ["json"].indexOf(gameResources[key].extension) > -1;
      });
      const currentAtlas: any = {};
      atlasKeys.map((resourceKey) => {
        return (currentAtlas[resourceKey] =
          gameResources[resourceKey].data.frames);
      });
      const frameLength: number = Object.keys(currentAtlas[vars.name]).length;
      setMax(frameLength - 1);
      console.log(frameLength - 1);
      vars.range = [0, frameLength - 1];
      setDefaultVal([0, frameLength - 1]);
      setOptions(atlasKeys);
    }

    dispatch(setAnimationVars(vars));
  };

  useEffect(() => {
    if (currentScene) {
      const loader = currentScene.game.loader.preloader;
      const gameResources = loader.resources;
      const resourceKeys = Object.keys(currentScene.resources);
      const atlasKeys: Array<string> = resourceKeys.filter((key: string) => {
        return ["json"].indexOf(gameResources[key].extension) > -1;
      });
      setOptions(atlasKeys);
      loader.onComplete.add(() => {
        const currentAtlas: any = {};
        atlasKeys.map((resourceKey) => {
          return (currentAtlas[resourceKey] =
            gameResources[resourceKey].data.frames);
        });
        const frameLength: number = Object.keys(
          currentAtlas[atlasKeys[0]]
        ).length;
        setMax(frameLength - 1);
        setDefaultVal([0, frameLength - 1]);
      });
    }
  }, [currentScene]);

  const generateConfigCard = (configs: any, key: string) => {
    const itemConfigs: Array<DatProperties> = configs;
    return itemConfigs.map((config: DatProperties) => {
      if (config.children) {
        const { component: Folder, label, ...props } = config;
        return (
          <Folder
            key={`${key}_${label}`}
            title={label}
            {...props}
            closed={false}
          >
            {generateConfigCard(config.children, key)}
          </Folder>
        );
      } else {
        const { component: DatItem, label, path, options, ...props } = config;
        const paths = path ? path.join(".") : "";
        // 动态设置options
        if (path && path[0] === "range") {
          return (
            <DatItem
              key={`${key}_${label}_${paths}`}
              path={paths}
              label={label}
              min={0}
              max={max}
              defaultVal={defaultVal}
              {...props}
            ></DatItem>
          );
        }
        if (options) {
          return (
            <DatItem
              key={`${key}_${label}_${paths}`}
              path={paths}
              label={label}
              options={currentOptions}
              {...props}
            ></DatItem>
          );
        } else {
          return (
            <DatItem
              key={`${key}_${label}_${paths}`}
              path={paths}
              label={label}
              {...props}
            ></DatItem>
          );
        }
      }
    });
  };
  return animationVars ? (
    <DatGui data={animationVars} onUpdate={handleUpdate}>
      {generateConfigCard(DatAnimationPropertyConfig(), "animation")}
    </DatGui>
  ) : (
    <>粒子特效</>
  );
};

export default AnimationDatGui;
