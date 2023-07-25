/*
 * @Author: kunnisser
 * @Date: 2023-07-25 10:33:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-25 10:36:48
 * @FilePath: /kunigame/editor/page/outline/inspector_config/config/bg.ts
 * @Description: ---- 背景配置 ----
 */
import * as PIXI from "pixi.js";
import {
  DatString,
  DatFolder,
  DatNumber,
  DatBoolean,
  DatColor
} from "react-dat-gui";
import { DatProperties } from ".";
import FixedNumberDatSelect from "../dat/select";
import DatTexture from "../dat/texture";
const DatBackgroundPropertyConfig: Array<DatProperties> = [
  {
    label: "基本变量",
    component: DatFolder,
    children: [
      {
        path: ["name"],
        label: "名称",
        component: DatString
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
        path: ["visible"],
        label: "是否显示",
        component: DatBoolean
      }
    ]
  },
  {
    label: "样式",
    component: DatFolder,
    children: [
      {
        path: ["blendMode"],
        label: "混合模式",
        component: FixedNumberDatSelect,
        optionLabels: [
          "正常模式",
          "添加模式(叠加RGB)",
          "正片叠底（上下像素相乘）",
          "滤色"
        ],
        options: [
          PIXI.BLEND_MODES.NORMAL,
          PIXI.BLEND_MODES.ADD,
          PIXI.BLEND_MODES.MULTIPLY,
          PIXI.BLEND_MODES.SCREEN
        ]
      },
      {
        path: ["tintColor"],
        label: "图片色调",
        component: DatColor
      },
      {
        label: "纹理",
        path: ["texture"],
        component: DatTexture
      }
    ]
  }
];

export default DatBackgroundPropertyConfig;
