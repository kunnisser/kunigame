/*
 * @Author: kunnisser
 * @Date: 2023-02-13 16:52:09
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-23 17:23:30
 * @FilePath: /kunigame/editor/page/outline/inspector_config/index.tsx
 * @Description: ---- 目标元素内容配置层 ----
 */
import React, { useEffect, useState } from "react";
import DatGui, { DatFolder, DatString } from "react-dat-gui";
import "editor@/assets/dat-gui.styl";
import { useStore } from "react-redux";
import Game from "ts@/kuni/lib/core";

const Inspector = () => {
  const [gameItem, setGameItem] = useState(null as any);
  const store = useStore();

  useEffect(() => {
    store.subscribe(() => {
      console.log(store.getState().sceneReducer);
      const item = store.getState().sceneReducer.gameItem;
      if (item) {
        setGameItem({ name: item.name, text: item.text });
      } else {
        setGameItem(item);
      }
    });
  }, []);

  const handleUpdate = (newData: any) => {
    const game: Game = store.getState().sceneReducer.game;
    store.getState().sceneReducer.gameItem.text = newData.text;
    store.getState().sceneReducer.gameItem.name = newData.name;
    game.editorTools.dragTool.onClickDragging(
      store.getState().sceneReducer.gameItem
    );
    setGameItem({ ...newData });
  };

  return gameItem ? (
    <DatGui data={gameItem} onUpdate={handleUpdate}>
      <DatFolder title="基本变量" closed={false}>
        <DatString path="name" label="名称" />
        <DatString path="text" label="文字内容" />
      </DatFolder>
    </DatGui>
  ) : (
    <></>
  );
};

export default Inspector;
