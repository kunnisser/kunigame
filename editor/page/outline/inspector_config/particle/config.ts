/*
 * @Author: kunnisser
 * @Date: 2023-07-13 16:18:04
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-13 17:36:58
 * @FilePath: /kunigame/editor/page/outline/inspector_config/particle/config.ts
 * @Description: ---- 粒子特效调试配置 ----
 */

import {
  DatNumber,
  DatFolder
  // DatBoolean,
  // DatSelect,
  // DatButton
} from "react-dat-gui";
import { DatProperties } from "../config";
export const DatParticlePropertyConfig = (): Array<DatProperties> => [
  {
    label: "粒子特效编辑",
    component: DatFolder,
    children: [
      {
        path: ["throtting"],
        label: "粒子发射间隔",
        component: DatNumber,
        min: 0,
        max: 300,
        step: 1
      },
      {
        path: ["duration"],
        label: "粒子动画时间",
        component: DatNumber,
        min: 0.2,
        max: 3,
        step: 0.1
      }
    ]
  }
];
