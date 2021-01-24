/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:21:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-24 23:21:33
 * @FilePath: \kunigame\editor\page\wireboard.tsx
 * @Description: ---- 酷尼游戏控制台 ----
 */

import { Layout } from 'antd';
import React, { useEffect } from 'react';
import GameInitial from 'ts@/kuni/main';
import KnTabs from './outline';
import OutlineTree from './outline/outline_tree';
const { Header, Footer, Sider, Content } = Layout;
const WireBoard = () => {
  useEffect(() => {
    const view: any = document.getElementById('stage');
    GameInitial(view);
  });
  return <Layout>
    <Header>Header</Header>
    <Layout>
      <Sider><KnTabs name="Outline" childComponent={OutlineTree} /></Sider>
      <Content>
        <div id="stage"></div>
      </Content>
      <Sider><KnTabs name="查看" childComponent={OutlineTree} /></Sider>
    </Layout>
    <Footer className="kn-footer">Footer</Footer>
  </Layout >;
}

export default WireBoard;