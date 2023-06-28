/*
 * @Author: kunnisser
 * @Date: 2023-04-03 00:09:09
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-28 15:52:33
 * @FilePath: /kunigame/editor/page/header/align.tsx
 * @Description: ---- 布局对齐按钮组 ----
 */
import React, { useEffect, useState } from "react";
import { Button, Space, Tooltip, message } from "antd";
import {
  BorderLeftOutlined,
  BorderRightOutlined,
  BorderVerticleOutlined,
  BorderTopOutlined,
  BorderBottomOutlined,
  BorderHorizontalOutlined,
  BorderInnerOutlined
} from "@ant-design/icons";
import { ReactComponent as DragCursor } from "editor@/assets/icon/dragCursor.svg";
import { ReactComponent as ScaleCursor } from "editor@/assets/icon/scaleCursor.svg";
import { ReactComponent as PickCursor } from "editor@/assets/icon/pickCursor.svg";
import { ReactComponent as RotateCursor } from "editor@/assets/icon/rotateCursor.svg";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  getGameItem,
  setCurrentOperationType,
  updateEditGameItem
} from "editor@/common/gameStore/scene/action";
import EditorTools from "ts@/hive/nnsd/src/tools";
import { transformAllToArray } from "editor@/tool";
import Game from "ts@/kuni/lib/core";
import { CombineReducer } from "editor@/common/store";

const Cursor = (props: any) => {
  const store: any = useStore();
  const { Component, id, operationType, ...prop } = props;
  const currentScene = store.getState().sceneReducer.currentScene;
  const isActive = id === (operationType || "pick") && currentScene;
  return (
    <Button
      icon={
        <span className="anticon">
          <Component
            fill={isActive ? "#11b234" : "#fff"}
            stroke={isActive ? "#11b234" : "#fff"}
          />
        </span>
      }
      key={`item-${id}`}
      {...prop}
    ></Button>
  );
};

const AlignHeader = () => {
  const [operationType, setOperationType] = useState("pick");
  const store: any = useStore();
  const dispatch: any = useDispatch();
  const operationArray = [
    {
      key: "pick",
      component: PickCursor
    },
    {
      key: "drag",
      component: DragCursor
    },
    {
      key: "scale",
      component: ScaleCursor
    },
    {
      key: "rotate",
      component: RotateCursor
    }
  ];

  const listenStack = useSelector((store: CombineReducer) => {
    return store.sceneReducer.cancelActionStack.length;
  });

  useEffect(() => {
    const type: string =
      store.getState().sceneReducer.game &&
      store.getState().sceneReducer.game.editorTools.type;
    operationType !== type && setOperationType(type);
  }, [listenStack]);

  const onChangeOperation = (key: string) => {
    const tool: EditorTools = store.getState().sceneReducer.game.editorTools;
    if (!tool) {
      message.warning("请先选择编辑场景!", 0.5);
      return;
    }
    setOperationType(key);
    dispatch(setCurrentOperationType(key));
    tool.switchOperationType.bind(tool)(key);
  };

  const commonAlignHandler = (alignCallback) => {
    const tool: EditorTools = store.getState().sceneReducer.game.editorTools;
    const game: Game = store.getState().sceneReducer.game;
    const gameItems = transformAllToArray(
      store.getState().sceneReducer.gameItem
    );
    const editGameItem = store.getState().sceneReducer.editGameItem;

    tool.recordOperationStep(gameItems || [], (record, item?: any) => {
      record.prev = { x: item.x, y: item.y };
      alignCallback(item, game);
      record.next = { x: item.x, y: item.y };
      editGameItem[item.name] = Object.assign(
        editGameItem[item.name] || {},
        record.next
      );
      dispatch(updateEditGameItem(editGameItem));
      return record;
    });
    dispatch(getGameItem([...gameItems]));
  };

  // 水平居中
  const onHorizontalAlignCenter = () => {
    commonAlignHandler((item, game: Game) => {
      item.x = game.config.halfEditorWidth;
    });
  };

  // 向左对齐
  const onLeftAlign = () => {
    commonAlignHandler((item, game: Game) => {
      item.x = 0;
    });
  };

  // 向右对齐
  const onRightAlign = () => {
    commonAlignHandler((item, game: Game) => {
      item.x = game.config.editorWidth;
    });
  };

  // 向上对齐
  const onTopAlign = () => {
    commonAlignHandler((item, game: Game) => {
      item.y = 0;
    });
  };

  // 向下对齐
  const onBottomAlign = () => {
    commonAlignHandler((item, game: Game) => {
      item.y = game.config.editorHeight;
    });
  };

  // 垂直居中
  const onVerticleAlignCenter = () => {
    commonAlignHandler((item, game: Game) => {
      item.y = game.config.halfEditorHeight;
    });
  };

  // 画布居中
  const onAlignCenter = () => {
    commonAlignHandler((item, game: Game) => {
      item.x = game.config.halfEditorWidth;
      item.y = game.config.halfEditorHeight;
    });
  };

  return (
    <div className="kn-flex">
      <Space>
        <Space>
          {operationArray.map((operation) => {
            return (
              <Cursor
                Component={operation.component}
                key={operation.key}
                id={operation.key}
                operationType={operationType}
                onClick={() => onChangeOperation(operation.key)}
              ></Cursor>
            );
          })}
        </Space>
        <Space align="center">
          <Tooltip placement="bottom" title="向左对齐">
            <Button
              icon={<BorderLeftOutlined />}
              key="item-left-align"
              onClick={onLeftAlign}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="向右对齐">
            <Button
              icon={<BorderRightOutlined />}
              key="item-right-align"
              onClick={onRightAlign}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="水平居中">
            <Button
              icon={<BorderHorizontalOutlined />}
              key="item-horizontal-align"
              onClick={onHorizontalAlignCenter}
            />
          </Tooltip>

          <Tooltip placement="bottom" title="向上对齐">
            <Button
              icon={<BorderTopOutlined />}
              key="item-top-align"
              onClick={onTopAlign}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="向下对齐">
            <Button
              icon={<BorderBottomOutlined />}
              key="item-bottom-align"
              onClick={onBottomAlign}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="垂直居中">
            <Button
              icon={<BorderVerticleOutlined />}
              key="item-verticle-align"
              onClick={onVerticleAlignCenter}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="画布居中">
            <Button
              icon={<BorderInnerOutlined />}
              key="item-center-align"
              onClick={onAlignCenter}
            />
          </Tooltip>
        </Space>
      </Space>
    </div>
  );
};

export default AlignHeader;
