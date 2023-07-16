/*
 * @Author: kunnisser
 * @Date: 2023-07-15 16:29:40
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-15 17:39:39
 * @FilePath: \kunigame\editor\page\outline\inspector_config\scene\index.tsx
 * @Description: ---- 场景对象配置面板 ----
 */

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, useStore } from "react-redux";
import Game from "ts@/kuni/lib/core";
import DatGui from "react-dat-gui";
import { DatProperties, InspectorConfig } from "../config";
import { updateEditGameItem } from "editor@/common/gameStore/scene/action";
import { CombineReducer } from "editor@/common/store";
import Admixture from "../dat/admixture";
import { createFrom, debounce } from "ts@/kuni/lib/utils/common";
import * as _ from "lodash";

const SceneDatGui = () => {
  const [gameItem, setGameItem] = useState(null as any);
  const [gameItemType, setGameItemType] = useState(null as any);

  const ref = useRef({
    update: true,
    recordPrev: null
  } as any);
  const store = useStore();
  const dispatch = useDispatch();
  const listenGameItem = useSelector((store: CombineReducer) => {
    return store.sceneReducer.gameItem;
  });
  const listenEditGameItem = useSelector((store: CombineReducer) => {
    return store.sceneReducer.editGameItem;
  });

  useEffect(() => {
  }, []);

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
        const keysCombine = keys.join(".");
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

  // 将带-字符串的属性名解构成嵌套对象
  const disAssembleGameItem = (path, gameItem) => {
    const game: Game = store.getState().sceneReducer.game;
    const factorValue: any = createFrom(gameItem, game);
    const ret = _.get(factorValue, path);
    return {
      [path]: ret
    };
  };

  const handleUpdate = (newData: any, path: string) => {
    console.time('scene');
    const game: Game = store.getState().sceneReducer.game;
    const [gameItem] = store.getState().sceneReducer.gameItem;
    const gameItemName = gameItem.name;
    const editGameItem = store.getState().sceneReducer.editGameItem;
    editGameItem[gameItemName] = editGameItem[gameItemName] || {};

    // 提交的更新参数构造
    // 只记录更新前的第一个状态快照，在防抖记录变更后的状态再变更update判断
    ref.current.update &&
      (ref.current.recordPrev = disAssembleGameItem(path, gameItem));
    ref.current.update = false;

    const keysArray = Object.keys(newData);
    for (const keysCombine of keysArray) {
      const keys = keysCombine.split(".");

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

    debounce.handler(() => {
      ref.current.update = true;
      const recordNext = { [path]: newData[path] };
      editGameItem[gameItemName][path] = setAdvancedVariables(newData[path]);

      console.log("old", ref.current.recordPrev);
      console.log("new", recordNext);

      game.editorTools.recordOperationStep([gameItem] || [], (record) => {
        record.prev = ref.current.recordPrev;
        record.next = recordNext;
        return record;
      });
      ref.current.recordPrev = null;

      dispatch(updateEditGameItem(editGameItem));
    });
    setGameItem({ ...newData });
    console.timeEnd('scene');
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
        const paths = path ? path.join(".") : "";
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
  )
}

export default SceneDatGui;
