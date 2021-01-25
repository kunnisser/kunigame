/*
 * @Author: kunnisser
 * @Date: 2021-01-25 16:00:13
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-25 16:54:13
 * @FilePath: /kunigame/editor/page/header/index.tsx
 * @Description: ---- KN编辑器菜单 ----
 */

import React from 'react';
import { Button, Space } from 'antd';
import { PlusCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

const KnHeader = () => {
  return <React.Fragment>
    <Space>
      <Button ghost icon={<PlusCircleOutlined />} key="addProject">创建项目</Button>
      <Button ghost icon={<PlayCircleOutlined />} key="play">播放</Button>
    </Space>
  </React.Fragment>
}

export default KnHeader;