/*
 * @Author: kunnisser
 * @Date: 2021-01-25 16:00:13
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-25 22:44:12
 * @FilePath: \kunigame\editor\page\header\index.tsx
 * @Description: ---- KN编辑器菜单 ----
 */

import React, { useContext } from 'react';
import { Button, Space } from 'antd';
import { PlusCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { WrapContext } from 'editor@/page/wireboard';
import { ModalOptions } from 'editor@/feedback/modalcore';

const KnHeader = () => {
  const commonContext: any = useContext(WrapContext);
  const { openModal } = commonContext;
  const createProjectFile = () => {
    openModal({
      width: 600,
      name: "新建文件",
      content: <React.Fragment>
        打开文件
      </React.Fragment>
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