/*
 * @Author: kunnisser
 * @Date: 2021-01-25 16:00:13
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-27 17:37:19
 * @FilePath: /kunigame/editor/page/header/index.tsx
 * @Description: ---- KN编辑器菜单 ----
 */

import React, { useContext } from 'react';
import { Button, Space, Tree, Input, Divider } from 'antd';
import { PlusCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { WrapContext } from 'editor@/page/wireboard';
import { ModalOptions } from 'editor@/feedback/modalcore';
import { SmileOutlined, MehOutlined } from '@ant-design/icons';
const { DirectoryTree } = Tree;
// 文件类型数据
const fileData = [
  {
    title: '项目',
    key: 'file_project',
    icon: <SmileOutlined />,
  },
  {
    title: 'State场景',
    key: 'state',
    icon: <MehOutlined />,
  },
];
const KnHeader = () => {
  const commonContext: any = useContext(WrapContext);
  const { openModal } = commonContext;
  const createProjectFile = () => {
    openModal({
      width: 600,
      name: "构建目录",
      content: <React.Fragment>
        <Input type="text" placeholder="请输入名称"></Input>
        <Divider dashed />
        <DirectoryTree showIcon treeData={fileData}></DirectoryTree>
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