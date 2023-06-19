/*
 * @Author: kunnisser
 * @Date: 2023-06-01 14:44:58
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-19 15:30:52
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/admixture.tsx
 * @Description: ---- 多对象排列 ----
 */
import React, { useState } from "react";
import { Button, Collapse, Divider, Input, List, Space } from "antd";
import Icon from "@ant-design/icons";
import { ReactComponent as TextIcon } from "editor@/assets/icon/text.svg";
import { ReactComponent as SpriteIcon } from "editor@/assets/icon/sprite.svg";
import { ReactComponent as GroupIcon } from "editor@/assets/icon/group.svg";
import { ReactComponent as GraphicsIcon } from "editor@/assets/icon/graphics.svg";
import { useDispatch, useStore } from "react-redux";
import { updateEditGameItem } from "editor@/common/gameStore/scene/action";
const Panel = Collapse.Panel;
const Admixture = (props: any) => {
  const { items } = props;
  const store = useStore();
  const dispatch = useDispatch();
  const tool: any = store.getState().sceneReducer.game.editorTools;
  const [offsetX, setOffsetX] = useState(0 as number);
  const [offsetY, setOffsetY] = useState(0);
  const [paddingX, setPaddingX] = useState(0 as number);
  const [paddingY, setPaddingY] = useState(0 as number);
  const iconMap = {
    "KnText": TextIcon,
    "KnBitMapText": TextIcon,
    "KnGroup": GroupIcon,
    "KnSprite": SpriteIcon,
    "KnGraphics": GraphicsIcon
  };

  const onArrangement = () => {
    const editGameItem = store.getState().sceneReducer.editGameItem;
    tool.recordOperationStep(items, (record: any, item: any) => {
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
      editGameItem[item.name] = Object.assign(
        editGameItem[item.name] || {},
        record.next
      );
      return record;
    });
    dispatch(updateEditGameItem(editGameItem));
  };

  // 横向排列
  const horizontalArrange = () => {
    const editGameItem = store.getState().sceneReducer.editGameItem;
    let index: number = 0;
    let itemWidth: number = 0;
    let baseItemY: number = 0;
    let baseItemX: number = 0;
    tool.recordOperationStep(items, (record: any, item: any) => {
      index === 0
        ? ((baseItemY = item.y), (baseItemX = item.x))
        : (itemWidth += item.width * item.anchor.x);
      record.prev = {
        x: item.x,
        y: item.y
      };
      item.x = baseItemX + itemWidth + index * paddingX;
      item.y = baseItemY;
      itemWidth += item.width * (1 - item.anchor.x);
      index++;
      record.next = {
        x: item.x,
        y: item.y
      };
      editGameItem[item.name] = Object.assign(
        editGameItem[item.name] || {},
        record.next
      );
      return record;
    });
    dispatch(updateEditGameItem(editGameItem));
  };

  // 纵向排列
  const verticalArrange = () => {
    const editGameItem = store.getState().sceneReducer.editGameItem;
    let index: number = 0;
    let itemHeight: number = 0;
    let baseItemY: number = 0;
    let baseItemX: number = 0;
    tool.recordOperationStep(items, (record: any, item: any) => {
      index === 0
        ? ((baseItemY = item.y), (baseItemX = item.x))
        : (itemHeight += item.height * item.anchor.y);
      record.prev = {
        x: item.x,
        y: item.y
      };
      item.y = baseItemY + itemHeight + index * paddingY;
      item.x = baseItemX;
      itemHeight += item.height * (1 - item.anchor.y);
      index++;
      record.next = {
        x: item.x,
        y: item.y
      };
      editGameItem[item.name] = Object.assign(
        editGameItem[item.name] || {},
        record.next
      );
      return record;
    });
    dispatch(updateEditGameItem(editGameItem));
  };
  return (
    <>
      <Space direction="vertical" style={{ display: "flex", padding: "10px" }}>
        <div>
          <label>X轴偏移</label>
          <Input
            type="number"
            size="small"
            onChange={(e) => {
              setOffsetX(+e.target.value);
            }}
          ></Input>
        </div>
        <div>
          <label>Y轴偏移</label>
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
        <Collapse>
          <Panel header="横向排列" key="horizSort">
            <section style={{ display: "flex" }}>
              <label style={{ width: "200px" }}>间隔(padding)</label>
              <Input
                type="number"
                size="small"
                onChange={(e) => {
                  setPaddingX(+e.target.value);
                }}
              ></Input>
            </section>
            <Divider></Divider>
            <Button block type="default" onClick={horizontalArrange}>
              确定
            </Button>
          </Panel>
        </Collapse>
        <Collapse>
          <Panel header="纵向排列" key="verticleSort">
            <section style={{ display: "flex" }}>
              <label style={{ width: "200px" }}>间隔(padding)</label>
              <Input
                type="number"
                size="small"
                onChange={(e) => {
                  setPaddingY(+e.target.value);
                }}
              ></Input>
            </section>
            <Divider></Divider>
            <Button block type="default" onClick={verticalArrange}>
              确定
            </Button>
          </Panel>
        </Collapse>
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
