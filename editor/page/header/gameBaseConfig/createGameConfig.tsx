/*
 * @Author: kunnisser
 * @Date: 2021-02-17 15:13:48
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-26 16:46:02
 * @FilePath: /kunigame/editor/page/header/gameBaseConfig/createGameConfig.tsx
 * @Description: ---- 创建项目配置 ----
 */

import React from 'react';
import { FormProps, FormItem, FormFragment } from "editor@/feedback/formcore";
import { Collapse, Space } from 'antd';
const { Panel } = Collapse;


const createGameConfig: FormProps = {
  formName: 'createGameForm',
  formList: [
    {
      type: {
        main: 'input',
      },
      param: 'projectName',
      label: '项目名称',
      placeholder: '请输入项目名称',
      hasFeedback: true,
      rules: [
        '项目名必填',
        {
          type: 'en',
        }
      ]
    },
    {
      type: 'fragment',
      render: (generate) => {
        const fragmentChildren: Array<FormItem> = [
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
            label: '高度',
            param: 'height',
            defaultVal: 1080,
          }
        ];

        const fragment1Children: Array<FormItem> = [
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
        ];
        return <Collapse key="project_setting" defaultActiveKey={['1', '2', '3']}>
          <Panel header="分辨率设置" key="1">
            <Space>
              {generate(fragmentChildren)}
            </Space>
          </Panel>
          <Panel header="画质设置" key="2">
            <Space>
              {generate(fragment1Children)}
            </Space>
          </Panel>
        </Collapse>;
      }
    }
  ] as Array<FormFragment | FormItem>
};

export default createGameConfig;
