/*
 * @Author: kunnisser
 * @Date: 2023-06-30 16:45:01
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-30 16:48:53
 * @FilePath: /kunigame/editor/page/outline/inspector_config/tween/config.ts
 * @Description: ---- tween 配置信息 ----
 */
import { DatString, DatNumber, DatFolder } from "react-dat-gui";
import { DatProperties } from "../config";
const DatTweenPropertyConfig: Array<DatProperties> = [
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
      }
    ]
  }
];

export default DatTweenPropertyConfig;
