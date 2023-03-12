/*
 * @Author: kunnisser
 * @Date: 2023-02-27 00:18:23
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-12 22:45:02
 * @FilePath: \kunigame\editor\page\outline\inspector_config\config\sprite.ts
 * @Description: ----  ----
 */

import { DatString, DatNumber, DatFolder, DatBoolean } from 'react-dat-gui';
import { DatProperties } from '.';
import DatAnchor from '../dat/anchor';
import PickDatFolder from '../dat/pickFolder';

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
    label: 'Transform',
    component: PickDatFolder,
    children: [
      {
        index: 0,
        path: ['scale', 'x'],
        label: 'x轴',
        component: DatNumber,
        min: -1,
        max: 10,
        step: 0.1,
      },
      {
        index: 0,
        path: ['scale', 'y'],
        label: 'y轴',
        component: DatNumber,
        min: -1,
        max: 10,
        step: 0.1,
      },
      // {
      //   index: 1,
      //   path: ['width'],
      //   label: '精灵宽度',
      //   component: DatNumber,
      //   min: 0,
      //   max: 1920,
      //   step: 1,
      // },
      // {
      //   index: 1,
      //   path: ['height'],
      //   label: '精灵高度',
      //   component: DatNumber,
      //   min: 0,
      //   max: 980,
      //   step: 1,
      // },
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
];

export default DatSpritePropertyConfig;
