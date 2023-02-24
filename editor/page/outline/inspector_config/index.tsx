/*
 * @Author: kunnisser
 * @Date: 2023-02-13 16:52:09
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-24 16:43:40
 * @FilePath: /kunigame/editor/page/outline/inspector_config/index.tsx
 * @Description: ---- 目标元素内容配置层 ----
 */
import React, { useEffect, useState } from "react";
import DatGui, { DatFolder, DatNumber, DatString } from "react-dat-gui";
import DatAnchor from "./dat/anchor";
import "editor@/assets/dat-gui.styl";
import { useSelector, useStore } from "react-redux";
import Game from "ts@/kuni/lib/core";
import { CombineReducer } from "editor@/common/store";

const Inspector = () => {
  const [gameItem, setGameItem] = useState(null as any);
  const store = useStore();
  const originGame: Game = useSelector(
    (store: CombineReducer) => store.sceneReducer.game
  );

  useEffect(() => {
    store.subscribe(() => {
      const item = store.getState().sceneReducer.gameItem;
      if (item) {
        setGameItem({
          name: item.name || "",
          text: item.text || "",
          x: item.x,
          y: item.y,
          anchor: item.anchor
        });
      } else {
        setGameItem(item);
      }
    });
  }, []);

  const handleUpdate = (newData: any) => {
    const game: Game = store.getState().sceneReducer.game;
    const gameItem = store.getState().sceneReducer.gameItem;
    gameItem.text = newData.text;
    gameItem.name = newData.name;
    gameItem.x = newData.x;
    gameItem.y = newData.y;
    gameItem.anchor = newData.anchor;
    game.editorTools.dragTool.onClickDragging(
      store.getState().sceneReducer.gameItem
    );
    console.log(newData);
    setGameItem({ ...newData });
  };

  return gameItem ? (
    <DatGui data={gameItem} onUpdate={handleUpdate}>
      <DatFolder title="基本变量" closed={false}>
        <DatString path="name" label="名称" />
        <DatString path="text" label="文字内容" />
        <DatNumber
          path="x"
          label="x坐标"
          step={1}
          min={0}
          max={originGame.config.width}
        />
        <DatNumber
          path="y"
          label="y坐标"
          step={1}
          min={0}
          max={originGame.config.height}
        />
        <DatAnchor path="anchor" label="锚点"></DatAnchor>
      </DatFolder>
    </DatGui>
  ) : (
    <></>
  );
};

export default Inspector;
