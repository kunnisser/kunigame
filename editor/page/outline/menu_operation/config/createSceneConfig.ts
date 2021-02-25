/*
 * @Author: kunnisser
 * @Date: 2021-02-25 15:20:39
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-25 16:14:15
 * @FilePath: /kunigame/editor/page/outline/menu_operation/config/createSceneConfig.ts
 * @Description: ---- 创建场景配置 ----
 */

import { FormProps, FormItem, FormFragment } from "editor@/feedback/formcore";

const createSceneConfig: FormProps = {
  layoutConfig: {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    layout: 'horizontal'
  },
  formName: 'createSceneForm',
  formList: [
    {
      type: {
        main: 'input',
      },
      param: 'sceneName',
      label: '场景名称',
      placeholder: '请输入项目名称',
      hasFeedback: true,
      rules: ['必填项']
    },
    {
      type: {
        main: 'input',
      },
      param: 'sceneId',
      label: '场景ID',
      placeholder: '请定义场景id',
      hasFeedback: true,
      rules: ['必填项', {
        type: 'en',
      }]
    },
    {
      type: {
        main: 'select',
      },
      param: 'preloader',
      label: '转场模式',
      placeholder: '选择加载界面',
      options: [
        {
          title: 'default',
          value: 'global_preloader',
        }
      ],
      rules: ['必填项',]
    },
  ] as Array<FormFragment | FormItem>
};

export default createSceneConfig;
