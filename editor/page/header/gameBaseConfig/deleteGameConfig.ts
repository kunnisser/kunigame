/*
 * @Author: kunnisser
 * @Date: 2021-03-09 20:44:45
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-03-09 22:02:52
 * @FilePath: \kunigame\editor\page\header\gameBaseConfig\deleteGameConfig.ts
 * @Description: ---- 删除游戏项目 ----
 */

import { FormProps, FormItem, FormFragment } from "editor@/feedback/formcore";


const deleteGameConfig: FormProps = {
  formName: 'deleteGameForm',
  formList: [
    {
      type: {
        main: 'input',
      },
      param: 'projectName',
      label: '',
      placeholder: '请输入要删除的项目名',
      hasFeedback: true,
      rules: [
        '项目名必填',
        {
          type: 'en',
        }
      ]
    },
  ] as Array<FormFragment | FormItem>
};

export default deleteGameConfig;
