/*
 * @Author: kunnisser 
 * @Date: 2019-10-31 16:16:39 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-03-09 16:03:12
 */

/**
 *  -- 公共模态窗口hooks --
 *  content存放当前模态UI元素
 *  props.childDrawer用于存放下一层布局
 */

import React, { useState } from 'react';
import { Modal } from 'antd';

const useModal = props => {
  const [modalVisible, setModalVisible] = useState(!1);
  const closeModal = () => setModalVisible(!1);
  const [width, setWidth] = useState(0);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [footer, setFooter] = useState(null);
  const [handler, setHandler] = useState(null);

  const openModal: any = (options) => {
    setModalVisible(!0);
    setWidth(options.width);
    setName(options.name);
    setFooter(options.footer);
    setContent(options.content);
    setHandler(options.handler);
  };

  const dispatchSubmit = () => {
    let paramHandler: any = handler;
    paramHandler && paramHandler();
    closeModal();
  }

  return [<Modal
    title={name}
    width={width}
    closable={false}
    onOk={dispatchSubmit}
    onCancel={closeModal}
    visible={modalVisible}
    footer={footer}
    {...props}
  >
    {content}
    {props.childModal}
  </Modal>, openModal, closeModal];
}

export default useModal;
