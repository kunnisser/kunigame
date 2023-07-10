/*
 * @Author: kunnisser
 * @Date: 2023-06-30 16:44:49
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-10 23:51:23
 * @FilePath: \kunigame\editor\page\outline\inspector_config\tween\index.tsx
 * @Description: ---- 缓动配置 ----
 */
import React from "react";
import DatGui from "react-dat-gui";
import { DatProperties } from "../config";
import { DatTweenPropertyConfig, DatScaleTweenPropertyConfig } from "./config";
import { useDispatch, useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import * as _ from "lodash";
import { setScaleTweenVars, setTweenVars } from "editor@/common/gameStore/scene/action";

const TweenDatGui = () => {
  const dispatch = useDispatch();

  const defaultTween = useSelector(
    (store: CombineReducer) => store.sceneReducer.defaultTween
  );
  const scaleTween = useSelector(
    (store: CombineReducer) => store.sceneReducer.scaleTween
  );
  const vars = useSelector(
    (store: CombineReducer) => store.sceneReducer.tweenVars
  );

  const scaleVars = useSelector(
    (store: CombineReducer) => store.sceneReducer.scaleTweenVars
  );

  const handleUpdate = (tweenVars: any) => {
    dispatch(setTweenVars(tweenVars));
  };

  const handleScaleUpdate = (scaleTweenVars) => {
    dispatch(setScaleTweenVars(scaleTweenVars));
  }

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
        const { component: DatItem, label, path, ...props } = config;
        const paths = path ? path.join(".") : "";
        return (
          <DatItem
            key={`${key}_${label}_${paths}`}
            path={paths}
            label={label}
            {...props}
          ></DatItem>
        );
      }
    });
  };
  return vars ? (
    <div>
      <DatGui data={vars} onUpdate={handleUpdate}>
        {generateConfigCard(
          DatTweenPropertyConfig(defaultTween),
          "default-tween"
        )}
      </DatGui>
      <DatGui data={scaleVars} onUpdate={handleScaleUpdate}>
        {generateConfigCard(DatScaleTweenPropertyConfig(scaleTween), "scale-tween")}
      </DatGui>
    </div>
  ) : (
    <>先选择缓动对象</>
  );
};

export default TweenDatGui;
