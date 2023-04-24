/*
 * @Author: kunnisser
 * @Date: 2023-04-03 00:09:09
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-24 17:27:08
 * @FilePath: /kunigame/editor/page/header/align.tsx
 * @Description: ---- 布局对齐按钮组 ----
 */
import React, { useState } from "react";
import { Button, Space, Tooltip } from "antd";
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

const Cursor = (props: any) => {
  const { Component, id, operationType, ...prop } = props;
  const isActive = id === operationType;
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

  const onChangeOperation = (key: string) => {
    setOperationType(key);
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
              type="primary"
              icon={<BorderLeftOutlined />}
              key="item-left-align"
            />
          </Tooltip>
          <Tooltip placement="bottom" title="向右对齐">
            <Button icon={<BorderRightOutlined />} key="item-right-align" />
          </Tooltip>
          <Tooltip placement="bottom" title="水平居中">
            <Button
              icon={<BorderHorizontalOutlined />}
              key="item-horizontal-align"
            />
          </Tooltip>

          <Tooltip placement="bottom" title="向上对齐">
            <Button icon={<BorderTopOutlined />} key="item-top-align" />
          </Tooltip>
          <Tooltip placement="bottom" title="向下对齐">
            <Button icon={<BorderBottomOutlined />} key="item-bottom-align" />
          </Tooltip>
          <Tooltip placement="bottom" title="垂直居中">
            <Button
              icon={<BorderVerticleOutlined />}
              key="item-verticle-align"
            />
          </Tooltip>
          <Tooltip placement="bottom" title="画布居中">
            <Button icon={<BorderInnerOutlined />} key="item-center-align" />
          </Tooltip>
        </Space>
      </Space>
    </div>
  );
};

export default AlignHeader;
