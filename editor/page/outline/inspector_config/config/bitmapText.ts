/*
 * @Author: kunnisser
 * @Date: 2023-02-27 14:58:40
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-27 17:12:30
 * @FilePath: /kunigame/editor/page/outline/inspector_config/config/bitmapText.ts
 * @Description: ---- 点阵文字配置 ----
 */

import { DatString, DatNumber, DatFolder } from "react-dat-gui";
import { DatProperties } from ".";
import DatAnchor from "../dat/anchor";
import DatResourcePicker from "../dat/resource";
const DatBitMapTextPropertyConfig: Array<DatProperties> = [
  {
    label: "基本变量",
    component: DatFolder,
    children: [
      {
        path: ["name"],
        label: "名称",
        component: DatString
      }
    ]
  },
  {
    label: "位置信息",
    component: DatFolder,
    children: [
      {
        path: ["x"],
        label: "x坐标",
        component: DatNumber,
        min: 0,
        max: 1920,
        step: 1
      },
      {
        path: ["y"],
        label: "y坐标",
        component: DatNumber,
        min: 0,
        max: 980,
        step: 1
      },
      {
        path: ["anchor"],
        label: "锚点",
        component: DatAnchor
      }
    ]
  },
  {
    label: "样式",
    component: DatFolder,
    children: [
      {
        label: "字体资源",
        path: ["fontName"],
        component: DatResourcePicker
      }
    ]
  }
];

export default DatBitMapTextPropertyConfig;
