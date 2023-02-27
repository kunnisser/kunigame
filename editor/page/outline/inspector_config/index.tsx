/*
 * @Author: kunnisser
 * @Date: 2023-02-13 16:52:09
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-27 17:30:19
 * @FilePath: /kunigame/editor/page/outline/inspector_config/index.tsx
 * @Description: ---- 目标元素内容配置层 ----
 */
import React, { useEffect, useState } from "react";
import DatGui from "react-dat-gui";
import "editor@/assets/dat-gui.styl";
import { useStore } from "react-redux";
import Game from "ts@/kuni/lib/core";
import { DatProperties, InspectorConfig } from "./config";

const Inspector = () => {
  const [gameItem, setGameItem] = useState(null as any);
  const [gameItemType, setGameItemType] = useState(null as any);
  const store = useStore();

  useEffect(() => {
    store.subscribe(() => {
      const item = store.getState().sceneReducer.gameItem;
      if (item) {
        const itemType: string = item.constructor.name;
        const configProperties: Array<Array<string>> = filterAllPropertyPath(
          InspectorConfig[itemType],
          []
        );
        const configItems: any = {};
        configProperties.map((keys: Array<string>) => {
          const keysCombine = keys.join("-");
          const prop = keys.reduce((total, key) => {
            return total[key];
          }, item);
          configItems[keysCombine] = prop;
        });

        setGameItem(configItems);
        setGameItemType(itemType);
      } else {
        setGameItem(item);
      }
    });
  }, [gameItemType]);

  // 过滤递归获取所有的path
  const filterAllPropertyPath = (
    configArr: Array<DatProperties>,
    retArr: Array<Array<string>>
  ) => {
    configArr.map((arr: DatProperties) => {
      if (arr.children) {
        filterAllPropertyPath(arr.children, retArr);
      } else {
        arr.path && retArr.push(arr.path);
      }
    });
    return retArr;
  };

  const handleUpdate = (newData: any) => {
    const game: Game = store.getState().sceneReducer.game;
    const gameItem = store.getState().sceneReducer.gameItem;

    const keysArray = Object.keys(newData);

    for (const keysCombine of keysArray) {
      const keys = keysCombine.split("-");
      // 链式调用赋值
      keys.reduce((total, key, index) => {
        if (index === keys.length - 1) {
          total[key] = newData[keysCombine];
        }
        return total[key];
      }, gameItem);
    }
    game.editorTools.dragTool.onClickDragging(
      store.getState().sceneReducer.gameItem
    );
    setGameItem({ ...newData });
  };

  /**
   * @description: 构造inspector 配置内容
   * @param {Array} configs
   * @return {*}
   */
  const generateConfigCard = (configs?: Array<DatProperties>) => {
    const gameItem = store.getState().sceneReducer.gameItem;
    const itemConfigs: Array<DatProperties> =
      configs || InspectorConfig[gameItem.constructor.name];
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
        const paths = path ? path.join("-") : "";
        return (
          <DatItem key={paths} path={paths} label={label} {...props}></DatItem>
        );
      }
    });
  };

  return gameItem && gameItemType ? (
    <DatGui data={gameItem} onUpdate={handleUpdate}>
      {generateConfigCard()}
    </DatGui>
  ) : (
    <></>
  );
};

export default Inspector;
