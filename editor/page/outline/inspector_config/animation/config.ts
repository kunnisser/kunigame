/*
 * @Author: kunnisser
 * @Date: 2023-07-19 16:00:33
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-20 15:37:11
 * @FilePath: /kunigame/editor/page/outline/inspector_config/animation/config.ts
 * @Description: ---- 动画配置信息 ----
 */

import { DatBoolean, DatFolder, DatNumber, DatSelect } from "react-dat-gui";
import { DatProperties } from "../config";
import DatRange from "../dat/range";

export const DatAnimationPropertyConfig = (): Array<DatProperties> => [
  {
    label: "帧动画编辑",
    component: DatFolder,
    children: [
      {
        path: ["name"],
        label: "动画名称",
        component: DatSelect,
        options: []
      },
      {
        path: ["speed"],
        label: "播放速度",
        component: DatNumber,
        min: 0.01,
        max: 2,
        step: 0.01
      },
      {
        path: ["loop"],
        label: "循环播放",
        component: DatBoolean
      },
      {
        path: ["range"],
        label: "帧范围",
        component: DatRange
      }
    ]
  }
];
