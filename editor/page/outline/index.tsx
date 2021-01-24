/*
 * @Author: kunnisser
 * @Date: 2021-01-24 21:26:21
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-24 23:22:40
 * @FilePath: \kunigame\editor\page\outline\index.tsx
 * @Description: ---- 项目大纲文件显示 ----
 */
import React from 'react';
import { Tabs } from 'antd';
import { AppleOutlined } from '@ant-design/icons';

/** tabs组件参数 */
interface TabsProps {
  /** tabs组件名称 */
  name: string,
  /** tabs组件包裹的子组件 */
  childComponent: any
};

const { TabPane } = Tabs;
const KnTabs = (props: TabsProps) => {

  return <React.Fragment>
    <Tabs defaultActiveKey="1" type="card">
      <TabPane
        tab={
          <span>
            <AppleOutlined />
            {props.name}
          </span>
        }
        key="1"
      >
        <props.childComponent></props.childComponent>
      </TabPane>
    </Tabs>
  </React.Fragment>
}

export default KnTabs;
