/*
 * @Author: kunnisser
 * @Date: 2023-02-27 00:18:17
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-27 00:23:58
 * @FilePath: \kunigame\editor\page\outline\inspector_config\config\group.ts
 * @Description: ----  ----
 */

import { DatString, DatNumber, DatFolder } from 'react-dat-gui';
import { DatProperties } from '.';
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

export default DatGroupPropertyConfig;
