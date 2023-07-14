/*
 * @Author: kunnisser
 * @Date: 2023-07-07 13:56:56
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-14 16:14:17
 * @FilePath: /kunigame/editor/page/outline/inspector_config/particle/index.tsx
 * @Description: ---- 粒子编辑组建 ----
 */

import React from "react";
import { DatParticlePropertyConfig } from "./config";
import { DatProperties } from "../config";
import DatGui from "react-dat-gui";
import { useDispatch, useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import { setParticleVars } from "editor@/common/gameStore/scene/action";
const ParticleDatGui = () => {
  const dispatch = useDispatch();
  const currentGameItems = useSelector(
    (store: CombineReducer) => store.sceneReducer.gameItem
  );
  const particleVars = useSelector(
    (store: CombineReducer) => store.sceneReducer.particleVars
  );
  const emitter = useSelector(
    (store: CombineReducer) => store.sceneReducer.emitter
  );
  const handleUpdate = (vars) => {
    dispatch(setParticleVars(vars));
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
  return particleVars && currentGameItems ? (
    <DatGui data={particleVars} onUpdate={handleUpdate}>
      {generateConfigCard(DatParticlePropertyConfig(emitter), "particle")}
    </DatGui>
  ) : (
    <>粒子特效</>
  );
};

export default ParticleDatGui;
