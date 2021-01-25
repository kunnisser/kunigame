/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:21:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-25 17:13:28
 * @FilePath: /kunigame/editor/page/wireboard.tsx
 * @Description: ---- 酷尼游戏控制台 ----
 */

import { Layout } from 'antd';
import React from 'react';
import KnHeader from './header';
import KnTabs from './outline';
import OutlineTree from './outline/outline_tree';
import StageEditor from './workbench/canvas';
const { Header, Footer, Sider, Content } = Layout;
const WireBoard = () => {

  return <Layout>
    <Header>
      <img className="logo" src="../editor/assets/image/logo.png"></img>
      <KnHeader />
    </Header>
    <Layout>
      <Sider><KnTabs name="Outline" childComponent={OutlineTree} /></Sider>
      <Content>
        <KnTabs name="场景编辑" childComponent={StageEditor} />
      </Content>
      <Sider><KnTabs name="查看" childComponent={OutlineTree} /></Sider>
    </Layout>
    <Footer className="kn-footer">Footer</Footer>
  </Layout >;
}

export default WireBoard;