/*
 * @Author: kunnisser
 * @Date: 2023-07-07 13:56:56
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-13 16:49:16
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
  const particleVars = useSelector(
    (store: CombineReducer) => store.sceneReducer.particleVars
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
  return particleVars ? (
    <DatGui data={particleVars} onUpdate={handleUpdate}>
      {generateConfigCard(DatParticlePropertyConfig(), "particle")}
    </DatGui>
  ) : (
    <>粒子特效</>
  );
};

export default ParticleDatGui;
