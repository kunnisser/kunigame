/*
 * @Author: kunnisser
 * @Date: 2021-01-30 21:55:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-03 23:26:29
 * @FilePath: \kunigame\editor\feedback\formcore.tsx
 * @Description: ---- REACT16 ----
 * +++++ <ANTD-V4 className="0"></ANTD-V4>表单封装  +++++
 */

import React, { useState } from 'react';
import { Form, Input, DatePicker, TimePicker, Select, Cascader, InputNumber } from 'antd';

/** FormItem 定义表单内元素描述 */
interface FormItem {
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
  validateStatus?: string,
  // 校验是否反馈
  hasFeedback?: boolean,
  // 校验提示
  help?: string,
  // 输入提示
  placeholder: string,
  // 是否允许清空
  allowClear?: boolean,
  // 参数名称
  param: string,
}

/** FormProps定义输入的Form配置描述 */
interface FormProps {
  layout: {
    labelCol: object,
    wrapperCol: object
  },
  formList: Array<FormItem>,
  formName: string,
}

const { Option } = Select;

/**
 * @description: 根据类型返回不同的Hive
 * @param {string} type 主类型
 * @param {string} subType 副类型
 * @return {Hive}
 */

const generateFormItemHive = (type: string, subType?: string) => {
}

// 主函数
const FormCore = (props: FormProps) => {
  return <Form name={props.formName} {...props.layout}>

  </Form>
}

/**
 * @description: 定义Input Form组件
 * @param {*}
 * @return {*}
 */
const formInputHex = (subType?: string) => {
  /** 定义form表单选项的状态列表 */
  const [formItemStates, setFormItemState] = useState([]);
  return <Input ></Input >
}

export default FormCore;