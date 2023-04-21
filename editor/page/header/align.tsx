/*
 * @Author: kunnisser
 * @Date: 2023-04-03 00:09:09
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-21 17:19:26
 * @FilePath: /kunigame/editor/page/header/align.tsx
 * @Description: ---- 布局对齐按钮组 ----
 */
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
import DragCursor from "editor@/assets/icon/dragCursor.svg";
import ScaleCursor from "editor@/assets/icon/scaleCursor.svg";
import PickCursor from "editor@/assets/icon/pickCursor.svg";
import RotateCursor from "editor@/assets/icon/rotateCursor.svg";

import React from "react";
const AlignHeader = () => {
  return (
    <div className="kn-flex">
      <Space>
        <Button
          icon={
            <span className="anticon">
              <PickCursor fill="#d10311"></PickCursor>
            </span>
          }
          key="item-picker"
        ></Button>
        <Button
          icon={<DragCursor stroke="#d10311"></DragCursor>}
          key="item-drag"
        ></Button>
        <Button icon={<ScaleCursor></ScaleCursor>} key="item-scale"></Button>
        <Button icon={<RotateCursor></RotateCursor>} key="item-rotate"></Button>
      </Space>
      <Space align="center">
        <Tooltip placement="bottom" title="向左对齐">
          <Button icon={<BorderLeftOutlined />} key="item-left-align" />
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
          <Button icon={<BorderVerticleOutlined />} key="item-verticle-align" />
        </Tooltip>
        <Tooltip placement="bottom" title="画布居中">
          <Button icon={<BorderInnerOutlined />} key="item-center-align" />
        </Tooltip>
      </Space>
    </div>
  );
};

export default AlignHeader;
