/*
 * @Author: kunnisser
 * @Date: 2021-01-24 21:26:21
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-22 16:14:41
 * @FilePath: /kunigame/editor/page/outline/index.tsx
 * @Description: ---- 项目大纲文件显示 ----
 */
import React from 'react';
import { Tabs } from 'antd';
import { AppleOutlined } from '@ant-design/icons';

/** tabs组件参数 */
interface TabsProps {
  tabs: Array<
    {
      /** tabs组件名称 */
      name: string,
      /** tabs组件包裹的子组件 */
      childComponent: any
    }
  >,
  initialKey: string
};


const { TabPane } = Tabs;
const KnTabs = (props: TabsProps) => {
  return <React.Fragment>
    <Tabs defaultActiveKey={props.initialKey + '0'} type="card">
      {props.tabs.map((tab, index) => {
        return <TabPane
          tab={
            <span>
              <AppleOutlined />
              {tab.name}
            </span>
          }
          key={props.initialKey + index}
        >
          <tab.childComponent></tab.childComponent>
        </TabPane>
      })
      }
    </Tabs>
  </React.Fragment>
}

export default KnTabs;
