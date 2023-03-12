/*
 * @Author: kunnisser
 * @Date: 2023-02-25 17:08:34
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-12 16:52:37
 * @FilePath: \kunigame\editor\page\outline\inspector_config\config\text.ts
 * @Description: ---- inspector 元素类型的配置 ----
 */
import {
  DatString,
  DatNumber,
  DatFolder,
  DatColor,
  DatSelect,
  DatBoolean,
} from 'react-dat-gui';
import { DatProperties } from '.';
import DatAnchor from '../dat/anchor';

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
    label: '缩放倾斜',
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
        path: ['style', 'fill'],
        label: '文字颜色',
        component: DatColor,
      },
      {
        path: ['style', 'fontSize'],
        label: '文字大小',
        component: DatNumber,
        min: 12,
        max: 500,
        step: 1,
      },
      {
        path: ['style', 'letterSpacing'],
        label: '文字间距',
        component: DatNumber,
        min: 0,
        max: 100,
        step: 1,
      },
      {
        path: ['style', 'fontStyle'],
        label: '字体样式',
        component: DatSelect,
        options: ['normal', 'italic', 'oblique'],
      },
      {
        path: ['style', 'fontWeight'],
        label: '字体粗细',
        component: DatSelect,
        options: [
          'normal',
          'bold',
          'bolder',
          'lighter',
          '100',
          '200',
          '300',
          '400',
          '500',
          '600',
          '700',
          '800',
          '900',
        ],
      },
      {
        path: ['style', 'fontFamily'],
        label: '字体库',
        component: DatSelect,
        options: [
          'Helvetica',
          'Arial',
          'sans-serif',
          'Verdana',
          'Tahoma',
          'Georgia',
        ],
      },
      {
        path: ['style', 'align'],
        label: '文本对齐',
        component: DatSelect,
        options: ['left', 'center', 'right', 'justify'],
      },
      {
        label: '文字描边',
        component: DatFolder,
        children: [
          {
            path: ['style', 'stroke'],
            label: '描边颜色',
            component: DatColor,
          },
          {
            path: ['style', 'strokeThickness'],
            label: '描边粗细',
            component: DatNumber,
            min: 0,
            max: 30,
            step: 1,
          },
        ],
      },
      {
        label: '阴影',
        component: DatFolder,
        children: [
          {
            path: ['style', 'dropShadow'],
            label: '文字阴影',
            component: DatBoolean,
          },
          {
            path: ['style', 'dropShadowColor'],
            label: '阴影颜色',
            component: DatColor,
          },
          {
            path: ['style', 'dropShadowAngle'],
            label: '阴影角度',
            component: DatNumber,
            min: 0,
            max: 2 * Math.PI,
            step: 0.1,
          },
          {
            path: ['style', 'dropShadowBlur'],
            label: '阴影模糊半径',
            component: DatNumber,
            min: 0,
            max: 10,
            step: 1,
          },
          {
            path: ['style', 'dropShadowDistance'],
            label: '阴影距离',
            component: DatNumber,
            min: 1,
            max: 20,
            step: 1,
          },
          {
            path: ['style', 'dropShadowAlpha'],
            label: '阴影透明度',
            component: DatNumber,
            min: 0,
            max: 1,
            step: 0.1,
          },
        ],
      },
      {
        label: '换行',
        component: DatFolder,
        children: [
          {
            path: ['style', 'wordWrap'],
            label: '开启换行',
            component: DatBoolean,
          },
          {
            path: ['style', 'leading'],
            label: '行间距',
            component: DatNumber,
            step: 1,
            min: 0,
            max: 100,
          },
          {
            path: ['style', 'breakWords'],
            label: '支持断词换行',
            component: DatBoolean,
          },
          {
            path: ['style', 'wordWrapWidth'],
            label: '换行宽度',
            component: DatNumber,
            min: 100,
            max: 5000,
            step: 1,
          },
        ],
      },
    ],
  },
];

export default DatTextPropertyConfig;
