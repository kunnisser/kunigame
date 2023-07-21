/*
 * @Author: kunnisser
 * @Date: 2023-07-19 15:59:33
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-21 17:13:35
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
const AnimationDatGui = (props) => {
  const { type } = props;
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
      const [atlasKeys, loader] = getAtlasKeys();
      setAtlasOptions(atlasKeys, loader, vars.name);
    }
    dispatch(setAnimationVars(vars));
  };

  useEffect(() => {
    if (currentScene) {
      console.log("change", currentScene);
      const [atlasKeys, loader] = getAtlasKeys();
      loadingAtlasOptions(atlasKeys, loader);
    }
  }, [currentScene, type]);

  // 获取场景帧的多个名称
  const getAtlasKeys = () => {
    const loader = currentScene.game.loader.preloader;
    const resourceKeys = Object.keys(currentScene.resources);
    const atlasKeys: Array<string> = resourceKeys.filter((key: string) => {
      return ["json"].indexOf(loader.resources[key].extension) > -1;
    });
    return [atlasKeys, loader];
  };

  const loadingAtlasOptions = (atlasKeys, loader) => {
    if (loader.loading) {
      loader.load(() => {
        setAtlasOptions(atlasKeys, loader);
      });
    } else {
      setAtlasOptions(atlasKeys, loader);
    }
  };

  // 设置帧选项，帧长度（min， max），默认帧选择范围（range）
  const setAtlasOptions = (atlasKeys, loader, name?: string) => {
    const currentAtlas: any = {};
    atlasKeys.map((resourceKey) => {
      return (currentAtlas[resourceKey] =
        loader.resources[resourceKey].data.frames);
    });
    const frameLength: number = Object.keys(
      currentAtlas[name || atlasKeys[0]]
    ).length;

    console.log(atlasKeys, name || atlasKeys[0]);
    setOptions(atlasKeys);
    setMax(frameLength - 1);
    setDefaultVal([0, frameLength - 1]);
  };

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
  return animationVars && currentScene ? (
    <DatGui data={animationVars} onUpdate={handleUpdate}>
      {generateConfigCard(DatAnimationPropertyConfig(), "animation")}
    </DatGui>
  ) : (
    <>请选择资源场景</>
  );
};

export default AnimationDatGui;
