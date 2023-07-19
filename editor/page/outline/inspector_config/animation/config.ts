/*
 * @Author: kunnisser
 * @Date: 2023-07-19 16:00:33
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-19 17:14:53
 * @FilePath: /kunigame/editor/page/outline/inspector_config/animation/config.ts
 * @Description: ---- 动画配置信息 ----
 */

import { DatFolder, DatNumber, DatSelect } from "react-dat-gui";
import { DatProperties } from "../config";

export const DatAnimationPropertyConfig = (): Array<DatProperties> => [
  {
    label: "帧动画编辑",
    component: DatFolder,
    children: [
      {
        path: ["speed"],
        label: "播放速度",
        component: DatNumber,
        min: 0.01,
        max: 2,
        step: 0.01
      },
      {
        path: ["name"],
        label: "动画名称",
        component: DatSelect,
        options: []
      }
    ]
  }
];
