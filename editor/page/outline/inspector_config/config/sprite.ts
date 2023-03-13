/*
 * @Author: kunnisser
 * @Date: 2023-02-27 00:18:23
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-13 23:15:24
 * @FilePath: \kunigame\editor\page\outline\inspector_config\config\sprite.ts
 * @Description: ----  ----
 */

import {
  DatString,
  DatNumber,
  DatFolder,
  DatBoolean,
  DatColor,
} from 'react-dat-gui';
import { DatProperties } from '.';
import DatAnchor from '../dat/anchor';
import * as PIXI from 'pixi.js';
import FixedNumberDatSelect from '../dat/select';

const DatSpritePropertyConfig: Array<DatProperties> = [
  {
    label: '基本变量',
    component: DatFolder,
    children: [
      {
        path: ['name'],
        label: '名称',
        component: DatString,
      },
      {
        path: ['alpha'],
        label: '透明度',
        component: DatNumber,
        min: 0,
        max: 1,
        step: 0.1,
      },
      {
        path: ['visible'],
        label: '是否显示',
        component: DatBoolean,
      },
    ],
  },
  {
    label: '缩放偏移',
    component: DatFolder,
    children: [
      {
        path: ['scale', 'x'],
        label: 'x轴',
        component: DatNumber,
        min: -1,
        max: 10,
        step: 0.1,
      },
      {
        path: ['scale', 'y'],
        label: 'y轴',
        component: DatNumber,
        min: -1,
        max: 10,
        step: 0.1,
      },
      {
        path: ['skew', 'x'],
        label: 'skew-x',
        component: DatNumber,
        min: -1,
        max: 1,
        step: 0.01,
      },
      {
        path: ['skew', 'y'],
        label: 'skew-y',
        component: DatNumber,
        min: -1,
        max: 1,
        step: 0.01,
      },
    ],
  },
  {
    label: '位置信息',
    component: DatFolder,
    children: [
      {
        path: ['x'],
        label: 'x坐标',
        component: DatNumber,
        min: 0,
        max: 1920,
        step: 1,
      },
      {
        path: ['y'],
        label: 'y坐标',
        component: DatNumber,
        min: 0,
        max: 980,
        step: 1,
      },
      {
        path: ['angle'],
        label: '旋转角度',
        component: DatNumber,
        min: 0,
        max: 360,
        step: 1,
      },
      {
        path: ['anchor'],
        label: '锚点',
        component: DatAnchor,
      },
    ],
  },
  {
    label: '样式',
    component: DatFolder,
    children: [
      {
        path: ['blendMode'],
        label: '混合模式',
        component: FixedNumberDatSelect,
        optionLabels: [
          '正常模式',
          '添加模式(叠加RGB)',
          '正片叠底（上下像素相乘）',
          '滤色',
        ],
        options: [
          PIXI.BLEND_MODES.NORMAL,
          PIXI.BLEND_MODES.ADD,
          PIXI.BLEND_MODES.MULTIPLY,
          PIXI.BLEND_MODES.SCREEN,
        ],
      },
      {
        path: ['tintColor'],
        label: '图片色调',
        component: DatColor,
      },
    ],
  },
];

export default DatSpritePropertyConfig;
