/*
 * @Author: kunnisser
 * @Date: 2023-06-30 16:44:49
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-30 16:52:30
 * @FilePath: /kunigame/editor/page/outline/inspector_config/tween/index.tsx
 * @Description: ----  ----
 */
import React from "react";
import DatGui from "react-dat-gui";
import { DatProperties } from "../config";
import DatTweenPropertyConfig from "./config";
const TweenDatGui = () => {
  const tweenItem = {};
  const handleUpdate = () => {};

  const generateConfigCard = (configs?: any) => {
    const itemConfigs: Array<DatProperties> = configs || DatTweenPropertyConfig;
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
