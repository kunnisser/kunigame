/*
 * @Author: kunnisser
 * @Date: 2021-01-25 16:00:13
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-29 23:02:56
 * @FilePath: \kunigame\editor\page\header\index.tsx
 * @Description: ---- KN编辑器菜单 ----
 */

import React, { useContext } from 'react';
import { Button, Space, Input, Collapse } from 'antd';
import { PlusCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { WrapContext } from 'editor@/page/wireboard';
import { ModalOptions } from 'editor@/feedback/modalcore';
const { Panel } = Collapse;
// 文件类型数据

const KnHeader = () => {
  const commonContext: any = useContext(WrapContext);
  const { openModal } = commonContext;
  const createProjectFile = () => {
    openModal({
      width: 600,
      name: "新建游戏项目",
      content: <React.Fragment>
        <Input type="text" placeholder="项目名"></Input>
        <Collapse defaultActiveKey={['1', '2', '3']} >
          <Panel header="分辨率设置" key="1">
            <p>123</p>
          </Panel>
          <Panel header="画质设置" key="2">
            <p>345</p>
          </Panel>
        </Collapse>
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