/*
 * @Author: kunnisser
 * @Date: 2021-01-24 21:26:21
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-30 16:28:46
 * @FilePath: /kunigame/editor/page/outline/index.tsx
 * @Description: ---- 项目大纲文件显示 ----
 */
import React from "react";
import { Tabs } from "antd";

/** tabs组件参数 */
interface TabsProps {
  tabs: Array<{
    key: string;
    /** tabs组件名称 */
    name: string;
    /** tabs组件包裹的子组件 */
    childComponent: any;
    icon: any;
    suffixIcon?: any;
  }>;
  initialKey: string;
  onChange?: any;
}

const { TabPane } = Tabs;
const KnTabs = (props: TabsProps) => {
  return (
    <React.Fragment>
      <Tabs
        defaultActiveKey={props.initialKey}
        type="card"
        onChange={props.onChange}
      >
        {props.tabs.map((tab) => {
          return (
            <TabPane
              className="overflow-scroller"
              tab={
                <span>
                  {tab.icon}
                  {tab.name}
                  {tab.suffixIcon}
                </span>
              }
              key={tab.key}
            >
              {tab.childComponent}
            </TabPane>
          );
        })}
      </Tabs>
    </React.Fragment>
  );
};

export default KnTabs;
