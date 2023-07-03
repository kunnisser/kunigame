/*
 * @Author: kunnisser
 * @Date: 2023-06-30 16:45:01
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-03 17:26:14
 * @FilePath: /kunigame/editor/page/outline/inspector_config/tween/config.ts
 * @Description: ---- tween 配置信息 ----
 */
import { DatNumber, DatFolder, DatBoolean, DatSelect } from "react-dat-gui";
import { DatProperties } from "../config";
const DatTweenPropertyConfig: Array<DatProperties> = [
  {
    label: "tween配置",
    component: DatFolder,
    children: [
      {
        path: ["duration"],
        label: "耗时",
        component: DatNumber,
        min: 0,
        max: 5,
        step: 0.1
      },
      {
        path: ["yoyo"],
        label: "来回模式",
        component: DatBoolean
      },
      {
        path: ["alpha"],
        label: "透明度",
        component: DatNumber,
        min: 0,
        max: 1,
        step: 0.1
      },
      {
        path: ["angle"],
        label: "旋转",
        component: DatNumber,
        min: -1080,
        max: 1080,
        step: 1
      },
      {
        path: ["repeat"],
        label: "重复次数",
        component: DatNumber,
        min: 0,
        max: 1000,
        step: 1
      },
      {
        path: ["x"],
        label: "x位移",
        component: DatNumber,
        min: -1000,
        max: 1000,
        step: 1
      },
      {
        path: ["y"],
        label: "y位移",
        component: DatNumber,
        min: -1000,
        max: 1000,
        step: 1
      },
      {
        path: ["ease"],
        label: "缓动模式",
        component: DatSelect,
        options: ["linear", "cubic", "bounce", "back", "sine"]
      },
      {
        path: ["inout"],
        label: "曲线选择",
        component: DatSelect,
        options: ["easeNone", "easeIn", "easeOut", "easeInOut"]
      },
      {
        label: "缩放",
        component: DatFolder,
        children: [
          {
            path: ["scale", "x"],
            label: "x轴",
            component: DatNumber,
            min: -1,
            max: 2,
            step: 0.1
          },
          {
            path: ["scale", "y"],
            label: "y轴",
            component: DatNumber,
            min: -1,
            max: 2,
            step: 0.1
          }
        ]
      }
    ]
  }
];

export default DatTweenPropertyConfig;
