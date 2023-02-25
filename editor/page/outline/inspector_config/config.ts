/*
 * @Author: kunnisser
 * @Date: 2023-02-25 17:08:34
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-26 02:12:00
 * @FilePath: \kunigame\editor\page\outline\inspector_config\config.ts
 * @Description: ---- inspector 元素类型的配置 ----
 */
import { DatString, DatNumber, DatFolder } from 'react-dat-gui';
import DatAnchor from './dat/anchor';

export interface DatProperties {
  label: string;
  component: any;
  children?: Array<DatProperties>;
  path?: Array<string>;
  min?: number;
  max?: number;
  step?: number;
}

const DatTextPropertyConfig: Array<DatProperties> = [
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
        path: ['text'],
        label: '文字',
        component: DatString,
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
        path: ['anchor'],
        label: '锚点',
        component: DatAnchor,
      },
    ],
  },
];

const DatGroupPropertyConfig: Array<DatProperties> = [
  {
    label: '基本变量',
    component: DatFolder,
    children: [
      {
        path: ['name'],
        label: '名称',
        component: DatString,
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
    ],
  },
];

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
        path: ['anchor'],
        label: '锚点',
        component: DatAnchor,
      },
    ],
  },
];

const InspectorConfig = {
  KnText: DatTextPropertyConfig,
  KnGroup: DatGroupPropertyConfig,
  KnSprite: DatSpritePropertyConfig,
};

export { InspectorConfig };
