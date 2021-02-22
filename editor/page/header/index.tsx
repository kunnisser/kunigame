/*
 * @Author: kunnisser
 * @Date: 2021-01-25 16:00:13
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-19 11:02:18
 * @FilePath: /kunigame/editor/page/header/index.tsx
 * @Description: ---- KN编辑器菜单 ----
 */

import React, { useContext } from 'react';
import { Button, Space, Form, message } from 'antd';
import { PlusCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { WrapContext } from 'editor@/page/wireboard';
import { ModalOptions } from 'editor@/feedback/modalcore';
import FormCore from 'editor@/feedback/formcore';
import createGameConfig from './gameBaseConfig/createGameConfig';
// 文件类型数据

const KnHeader = () => {
  const commonContext: any = useContext(WrapContext);
  const { openModal, closeModal } = commonContext;
  const [createGameForm] = Form.useForm();
  const resetForm = () => {
    createGameForm.resetFields();
  }
  const submitForm = () => {
    createGameForm.submit();
  }
  const onSubmit = (params): void => {
    console.log(params);
    resetForm();
    closeModal();
    message.success('创建成功！')
  }
  const createProjectFile = () => {
    openModal({
      width: 600,
      name: "新建游戏项目",
      content: <React.Fragment>
        <FormCore form={createGameForm} {...createGameConfig} submit={onSubmit}></FormCore>
      </React.Fragment>,
      footer: [
        <Button key="back" onClick={resetForm}>
          重置
      </Button>,
        <Button key="submit" type="primary" onClick={submitForm}>
          创建
      </Button>,
      ]
    } as ModalOptions);
  };
  return <React.Fragment>
    <Space>
      <Button ghost icon={<PlusCircleOutlined />} key="addProject" onClick={createProjectFile}>创建项目</Button>
      <Button ghost icon={<PlayCircleOutlined />} key="play">播放</Button>
    </Space>
  </React.Fragment>
}

export default KnHeader;