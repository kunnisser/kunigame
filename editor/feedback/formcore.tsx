/*
 * @Author: kunnisser
 * @Date: 2021-01-30 21:55:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-19 10:30:47
 * @FilePath: /kunigame/editor/feedback/formcore.tsx
 * @Description: ---- REACT16 ----
 * +++++ <ANTD-V4></ANTD-V4>表单封装  +++++
 */

import React from 'react';
import { Form, Input, InputNumber, Switch } from 'antd';
import ruleMap from './validate/rules';
import { FormInstance } from 'antd/lib/form';

/** FormItem 定义表单内元素描述 */
export interface FormItem {
  // form元素类型
  type: {
    // 主类型 [input, select, date, cascader, hoc...]
    main: string,
    // 子类型可选
    sub?: string,
  },
  // 标题
  label: string,
  // 自定义校验规则
  validate?: Function,
  // 校验状态 [error, warning, success, validating]
  validateStatus?: any,
  // 校验是否反馈
  hasFeedback?: boolean,
  // 校验提示
  help?: string,
  // 输入提示
  placeholder?: string,
  // 是否允许清空
  allowClear?: boolean,
  // 参数名称
  param: string,
  // 默认值
  defaultVal?: any,
  // 子节点的值属性
  propName?: string,
  rules?: Array<object>,
}

/** FormItem 定义表单包裹元素描述 */
export interface FormFragment {
  // fragment类型
  type: string,
  render: Function,
}

/** FormProps定义输入的Form配置描述 */
export interface FormProps {
  layout?: {
    labelCol: object,
    wrapperCol: object
  },
  formList: Array<FormItem | FormFragment>,
  formName: string,
  submit?: any,
  form?: FormInstance
}

// const { Option } = Select;
const rules: any = ruleMap;

/**
 * @description: 定义Input Form组件
 * @param {*}
 * @return {*}
 */
const formInputHex = (formItem: FormItem): any => {

  if (formItem.type.sub == 'number') {
    return <InputNumber ></InputNumber>
  } else {
    return <Input type={formItem.type.sub ?? 'text'} placeholder={formItem.placeholder}></Input >
  }
}

/**
 * @description: 定义Switch Form组件
 * @param {*}
 * @return {*}
 */

const formSwitchHex = (formItem: FormItem): any => {
  return <Switch />
}

const FormItemsMapSheet = {
  'input': formInputHex,
  'switch': formSwitchHex,
};

/**
 * @description: 解析rules的自定义参数配置
 * @param {*}
 * @return {*}
 */

const dispatchRules = (formItem: FormItem): any => {
  return formItem.rules?.map((ruleConfig: any) => {
    if (typeof ruleConfig == 'string') {
      return {
        required: true,
        message: ruleConfig
      };
    } else {
      return {
        validator: async (rule, value) => rules.get(ruleConfig.type)(rule, value, ruleConfig.options),
      };
    }
  });
}

/**
 * @description: 根据类型返回不同的Hive
 * @param {FormItem} formItem formItem信息
 * @return {Hive}
 */

const generateFormItemHive = (formItem: FormItem) => {
  return <Form.Item
    key={formItem.param}
    label={formItem.label}
    name={formItem.param}
    hasFeedback={formItem.hasFeedback}
    validateStatus={formItem.validateStatus}
    help={formItem.help}
    initialValue={formItem.defaultVal}
    valuePropName={formItem.propName}
    rules={dispatchRules(formItem)}
  >
    {FormItemsMapSheet[formItem.type.main](formItem)}
  </Form.Item>;
}

// 主函数
const FormCore = (props: FormProps) => {
  // 递归form树状结构
  const generateItems = (items) => {
    return (items || []).map((formItem) => {
      // 包裹外层元素
      if (typeof formItem.type == 'string') {
        return formItem.render(generateItems);
      } else {
        return generateFormItemHive(formItem as FormItem);
      }
    });
  }
  return <Form
    form={props.form}
    name={props.formName}
    onFinish={props.submit}
    {...props.layout}
  >
    {generateItems(props.formList)}
  </Form>
}


export default FormCore;