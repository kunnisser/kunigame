/*
 * @Author: kunnisser
 * @Date: 2023-06-30 16:44:49
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-14 09:54:50
 * @FilePath: /kunigame/editor/page/outline/inspector_config/tween/index.tsx
 * @Description: ---- 缓动配置 ----
 */
import React from "react";
import DatGui from "react-dat-gui";
import { DatProperties } from "../config";
import { DatTweenPropertyConfig, DatScaleTweenPropertyConfig } from "./config";
import { useDispatch, useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import * as _ from "lodash";
import {
  setScaleTweenVars,
  setTweenVars
} from "editor@/common/gameStore/scene/action";
import { Button } from "antd";

const TweenDatGui = () => {
  const dispatch = useDispatch();
  const currentGameItems = useSelector(
    (store: CombineReducer) => store.sceneReducer.gameItem
  );
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

  return vars && currentGameItems ? (
    <div>
      <Button
        type="primary"
        onClick={() => {
          defaultTween && defaultTween.seek(0).restart(true);
          scaleTween && scaleTween.seek(0).restart(true);
        }}
      >
        总体预览
      </Button>
      <DatGui data={vars} onUpdate={handleUpdate}>
        {generateConfigCard(
          DatTweenPropertyConfig(defaultTween),
          "default-tween"
        )}
      </DatGui>
      <DatGui data={scaleVars} onUpdate={handleScaleUpdate}>
        {generateConfigCard(
          DatScaleTweenPropertyConfig(scaleTween),
          "scale-tween"
        )}
      </DatGui>
    </div>
  ) : (
    <>先选择缓动对象</>
  );
};

export default TweenDatGui;
