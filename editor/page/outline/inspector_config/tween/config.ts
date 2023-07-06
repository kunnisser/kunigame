/*
 * @Author: kunnisser
 * @Date: 2023-06-30 16:45:01
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-06 15:54:59
 * @FilePath: /kunigame/editor/page/outline/inspector_config/tween/config.ts
 * @Description: ---- tween 配置信息 ----
 */
import {
  DatNumber,
  DatFolder,
  DatBoolean,
  DatSelect,
  DatButton
} from "react-dat-gui";
import { DatProperties } from "../config";
export const DatTweenPropertyConfig = (ref): Array<DatProperties> => [
  {
    label: "缓动动画",
    component: DatFolder,
    children: [
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
        path: ["duration"],
        label: "耗时",
        component: DatNumber,
        min: 0,
        max: 3,
        step: 0.1
      },
      {
        path: ["yoyo"],
        label: "来回模式",
        component: DatBoolean
      },
      {
        path: ["loop"],
        label: "循环播放",
        component: DatBoolean
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
        path: ["delay"],
        label: "延时",
        component: DatNumber,
        min: 0,
        max: 10,
        step: 0.1
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
        label: "操作",
        component: DatFolder,
        children: [
          {
            label: "进度",
            path: ["progress"],
            component: DatNumber,
            min: 0,
            max: 1,
            step: 0.01
          },
          {
            label: "播放",
            component: DatButton,
            onClick: () => {
              ref.current.defaultTween &&
                ref.current.defaultTween.restart(true);
            }
          },
          {
            label: "反向播放",
            component: DatButton,
            onClick: () => {
              ref.current.defaultTween && ref.current.defaultTween.reverse(0);
            }
          },
          {
            label: "重置",
            component: DatButton,
            onClick: () => {
              ref.current.defaultTween && ref.current.defaultTween.pause(0);
            }
          }
        ]
      }
    ]
  }
];

export const DatScaleTweenPropertyConfig = (ref): Array<DatProperties> => [
  {
    label: "缩放动画",
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
      },
      {
        path: ["scaleloop"],
        label: "缩放循环播放",
        component: DatBoolean
      },
      {
        path: ["duration"],
        label: "耗时",
        component: DatNumber,
        min: 0,
        max: 3,
        step: 0.1
      },
      {
        path: ["yoyo"],
        label: "来回模式",
        component: DatBoolean
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
        path: ["delay"],
        label: "延时",
        component: DatNumber,
        min: 0,
        max: 10,
        step: 0.1
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
        label: "操作",
        component: DatFolder,
        children: [
          {
            label: "进度",
            path: ["progress"],
            component: DatNumber,
            min: 0,
            max: 1,
            step: 0.01
          },
          {
            label: "播放",
            component: DatButton,
            onClick: () => {
              ref.current.scaleTween && ref.current.scaleTween.restart(true);
            }
          },
          {
            label: "反向播放",
            component: DatButton,
            onClick: () => {
              ref.current.scaleTween && ref.current.scaleTween.reverse(0);
            }
          },
          {
            label: "重置",
            component: DatButton,
            onClick: () => {
              ref.current.scaleTween && ref.current.scaleTween.pause(0);
            }
          }
        ]
      }
    ]
  }
];
