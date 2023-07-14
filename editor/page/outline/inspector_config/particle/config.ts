/*
 * @Author: kunnisser
 * @Date: 2023-07-13 16:18:04
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-14 16:55:05
 * @FilePath: /kunigame/editor/page/outline/inspector_config/particle/config.ts
 * @Description: ---- 粒子特效调试配置 ----
 */

import {
  DatNumber,
  DatFolder,
  DatBoolean,
  DatSelect
  // DatBoolean,
  // DatSelect,
  // DatButton
} from "react-dat-gui";
import { DatProperties } from "../config";
import DatTexture from "../dat/texture";
import KnEmitter from "ts@/kuni/lib/gameobjects/kn_emitter";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
export const DatParticlePropertyConfig = (
  emitter: KnEmitter
): Array<DatProperties> => [
  {
    label: "粒子特效编辑",
    component: DatFolder,
    children: [
      {
        label: "发射器属性",
        component: DatFolder,
        children: [
          {
            path: ["count"],
            label: "发射粒子数量",
            component: DatNumber,
            min: 1,
            max: 300,
            step: 1
          },
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
          },
          {
            path: ["width"],
            label: "粒子发射X轴范围",
            component: DatNumber,
            min: -500,
            max: 500,
            step: 1
          },
          {
            path: ["height"],
            label: "粒子发射Y轴范围",
            component: DatNumber,
            min: -500,
            max: 500,
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
          }
        ]
      },
      {
        label: "粒子属性",
        component: DatFolder,
        children: [
          {
            path: ["offsetX"],
            label: "X轴粒子移动距离",
            component: DatNumber,
            min: -1000,
            max: 1000,
            step: 1
          },
          {
            path: ["offsetY"],
            label: "Y轴粒子移动距离",
            component: DatNumber,
            min: -1000,
            max: 1000,
            step: 1
          },
          {
            path: ["xRandom"],
            label: "X轴粒子移动随机",
            component: DatBoolean
          },
          {
            path: ["yRandom"],
            label: "Y轴粒子移动随机",
            component: DatBoolean
          },
          {
            path: ["xDirect"],
            label: "X轴方向随机",
            component: DatBoolean
          },
          {
            path: ["yDirect"],
            label: "Y轴方向随机",
            component: DatBoolean
          },
          {
            path: ["angle"],
            label: "粒子旋转角度",
            component: DatNumber,
            min: -720,
            max: 720,
            step: 1
          },
          {
            path: ["angleRandom"],
            label: "旋转角度随机",
            component: DatBoolean
          },
          {
            path: ["angleDirect"],
            label: "旋转方向随机",
            component: DatBoolean
          },
          {
            path: ["texture"],
            label: "纹理",
            component: DatTexture,
            onChange: (texture) => {
              console.log(emitter);
              emitter &&
                emitter.children.map((sprite: KnSprite) => {
                  sprite.texture = texture;
                });
            }
          }
        ]
      }
    ]
  }
];
