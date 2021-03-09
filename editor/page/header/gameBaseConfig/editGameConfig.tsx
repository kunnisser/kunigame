/*
 * @Author: kunnisser
 * @Date: 2021-03-09 22:00:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-03-09 22:23:35
 * @FilePath: \kunigame\editor\page\header\gameBaseConfig\editGameConfig.tsx
 * @Description: ---- 编辑项目设置 ----
 */

import { FormProps, FormItem, FormFragment } from "editor@/feedback/formcore";


const editGameConfig: FormProps = {
  formName: 'editGameForm',
  layoutConfig: {
    layout: 'inline'
  },
  formList: [
    {
      type: {
        main: 'input',
        sub: 'number'
      },
      label: '宽度',
      param: 'width',
      defaultVal: 1920,
    },
    {
      type: {
        main: 'input',
        sub: 'number'
      },
      label: '宽高比',
      param: 'ratio',
      defaultVal: 2,
    },
    {
      type: {
        main: 'switch',
      },
      label: '抗锯齿',
      param: 'antialias',
      propName: 'checked',
      defaultVal: true
    },
    {
      type: {
        main: 'switch',
      },
      label: '背景透明',
      param: 'transparent',
      propName: 'checked',
      defaultVal: true
    },
  ] as Array<FormFragment | FormItem>
};

export default editGameConfig;

