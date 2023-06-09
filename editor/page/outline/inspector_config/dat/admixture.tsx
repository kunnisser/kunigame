/*
 * @Author: kunnisser
 * @Date: 2023-06-01 14:44:58
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-09 16:28:47
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/admixture.tsx
 * @Description: ---- 多对象排列 ----
 */
import React, { useState } from "react";
import { Button, Input, List, Space } from "antd";
import Icon from "@ant-design/icons";
import { ReactComponent as TextIcon } from "editor@/assets/icon/text.svg";
import { ReactComponent as SpriteIcon } from "editor@/assets/icon/sprite.svg";
import { ReactComponent as GroupIcon } from "editor@/assets/icon/group.svg";
import { ReactComponent as GraphicsIcon } from "editor@/assets/icon/graphics.svg";
import { useDispatch, useStore } from "react-redux";
import { updateEditGameItem } from "editor@/common/gameStore/scene/action";

const Admixture = (props: any) => {
  const { items } = props;
  const store = useStore();
  const dispatch = useDispatch();
  const tool: any = store.getState().sceneReducer.game.editorTools;
  const [offsetX, setOffsetX] = useState(0 as number);
  const [offsetY, setOffsetY] = useState(0);
  const iconMap = {
    "KnText": TextIcon,
    "KnBitMapText": TextIcon,
    "KnGroup": GroupIcon,
    "KnSprite": SpriteIcon,
    "KnGraphics": GraphicsIcon
  };

  const onArrangement = () => {
    const editGameItem = store.getState().sceneReducer.editGameItem;
    tool.recordOperationStep(items, (item: any, record: any) => {
      record.prev = {
        x: item.x,
        y: item.y
      };
      item.x += offsetX;
      item.y += offsetY;
      record.next = {
        x: item.x,
        y: item.y
      };
      editGameItem[item.name] = record.next;
      return record;
    });
    dispatch(updateEditGameItem(editGameItem));
  };
  return (
    <>
      <Space direction="vertical" style={{ display: "flex", padding: "10px" }}>
        <div>
          <label>X轴偏移</label>{" "}
          <Input
            type="number"
            size="small"
            onChange={(e) => {
              setOffsetX(+e.target.value);
            }}
          ></Input>
        </div>
        <div>
          <label>Y轴偏移</label>{" "}
          <Input
            type="number"
            size="small"
            onChange={(e) => {
              setOffsetY(+e.target.value);
            }}
          ></Input>
        </div>
        <Button type="default" onClick={onArrangement}>
          排列
        </Button>
        <div>横向对齐</div>
        <div>纵向对齐</div>
      </Space>

      <List
        itemLayout="horizontal"
        dataSource={items || []}
        renderItem={(item: any, index) => (
          <List.Item
            style={{ cursor: "pointer" }}
            onClick={() => {
              tool.onClickHandler([item]);
            }}
          >
            <List.Item.Meta
              avatar={<Icon component={iconMap[item.constructor.name]} />}
              title={<span>{item.name}</span>}
              description={item.constructor.name}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default Admixture;
