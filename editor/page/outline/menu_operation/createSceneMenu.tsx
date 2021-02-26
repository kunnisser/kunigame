/*
 * @Author: kunnisser
 * @Date: 2021-02-25 15:11:05
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-26 10:01:15
 * @FilePath: /kunigame/editor/page/outline/menu_operation/createSceneMenu.tsx
 * @Description: ---- 新增场景操作 ----
 */
import React, { useContext } from 'react';
import { Button, Form, message, Menu } from 'antd';
import { WrapContext } from 'editor@/page/wireboard';
import { ModalOptions } from 'editor@/feedback/modalcore';
import FormCore from 'editor@/feedback/formcore';
import createSceneConfig from './config/createSceneConfig';
import { createScene } from 'editor@/api/request/scene';
const CreateSceneMenu = () => {
  const commonContext: any = useContext(WrapContext);
  const { openModal, closeModal } = commonContext;
  const [createSceneForm] = Form.useForm();
  const resetForm = () => {
    createSceneForm.resetFields();
  }
  const submitForm = () => {
    createSceneForm.submit();
  }
  const onSubmit = (params): void => {
    createScene(params).then(() => {
      resetForm();
      closeModal();
    })
  }

  const createNewScene = () =>
    openModal({
      width: 600,
      name: "创建场景",
      content: <React.Fragment>
        <FormCore form={createSceneForm} {...createSceneConfig} submit={onSubmit}></FormCore>
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

  return <Menu>
    <Menu.Item key="create_scene" onClick={createNewScene}>新建场景</Menu.Item>
  </Menu>
};

export default CreateSceneMenu;
