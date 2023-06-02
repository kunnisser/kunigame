/*
 * @Author: kunnisser
 * @Date: 2023-02-13 16:52:09
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-02 10:59:22
 * @FilePath: /kunigame/editor/page/outline/inspector_config/index.tsx
 * @Description: ---- 目标元素内容配置层 ----
 */
import React, { useEffect, useState } from "react";
import DatGui from "react-dat-gui";
import "editor@/assets/dat-gui.styl";
import { useDispatch, useSelector, useStore } from "react-redux";
import Game from "ts@/kuni/lib/core";
import { DatProperties, InspectorConfig } from "./config";
import { updateEditGameItem } from "editor@/common/gameStore/scene/action";
import { CombineReducer } from "editor@/common/store";
import Admixture from "./dat/admixture";

const Inspector = () => {
  const [gameItem, setGameItem] = useState(null as any);
  const [gameItemType, setGameItemType] = useState(null as any);
  const store = useStore();
  const dispatch = useDispatch();
  const listenGameItem = useSelector((store: CombineReducer) => {
    return store.sceneReducer.gameItem;
  });
  const listenEditGameItem = useSelector((store: CombineReducer) => {
    return store.sceneReducer.editGameItem;
  });

  useEffect(() => {
    const item = store.getState().sceneReducer.gameItem;
    if (!item) {
      return;
    }
    const isMultiPick = item.length > 1;
    let itemType: string = "";
    if (isMultiPick) {
      itemType = "Admixture";
    } else {
      itemType = item[0].constructor.name;
      const configProperties: Array<Array<string>> = filterAllPropertyPath(
        InspectorConfig[itemType],
        []
      );
      const configItems: any = {};
      configProperties.map((keys: Array<string>) => {
        const keysCombine = keys.join("-");
        const prop = keys.reduce((total, key) => {
          return total[key];
        }, item[0]);
        configItems[keysCombine] = prop;
      });
      setGameItem(configItems);
    }
    setGameItemType(itemType);
  }, [listenGameItem, listenEditGameItem]);

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

  // 处理特殊提交对象
  const setAdvancedVariables = (val: any) => {
    if (val.textureCacheIds) {
      return {
        type: "texture",
        value: val.textureCacheIds
      };
    }
    return val;
  };

  const handleUpdate = (newData: any, path: string) => {
    const game: Game = store.getState().sceneReducer.game;
    const [gameItem] = store.getState().sceneReducer.gameItem;
    const gameItemName = gameItem.name;
    const editGameItem = store.getState().sceneReducer.editGameItem;
    editGameItem[gameItemName] = editGameItem[gameItemName] || {};

    // 提交的更新参数构造
    editGameItem[gameItemName][path] = setAdvancedVariables(newData[path]);
    dispatch(updateEditGameItem(editGameItem));

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
    if (gameItem._width && gameItem._height) {
      gameItem.width = gameItem._width;
      gameItem.height = gameItem._height;
    }
    game.editorTools.drawOperationComponent(
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
    const [gameItem] = store.getState().sceneReducer.gameItem;
    const configTypeName = gameItem.constructor.name;
    const itemConfigs: Array<DatProperties> =
      configs || InspectorConfig[configTypeName];
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

  return listenGameItem ? (
    gameItemType === "Admixture" ? (
      <Admixture items={listenGameItem} />
    ) : gameItem && listenGameItem[0].name === gameItem.name ? (
      <DatGui data={gameItem} onUpdate={handleUpdate}>
        {generateConfigCard()}
      </DatGui>
    ) : (
      <></>
    )
  ) : (
    <>空</>
  );
};

export default Inspector;
