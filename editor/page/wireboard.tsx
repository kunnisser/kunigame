/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:21:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-25 22:41:40
 * @FilePath: \kunigame\editor\page\wireboard.tsx
 * @Description: ---- 酷尼游戏控制台 ----
 */

import { Layout } from 'antd';
import React, { createContext } from 'react';
import KnHeader from './header';
import KnTabs from './outline';
import OutlineTree from './outline/outline_tree';
import StageEditor from './workbench/canvas';
import useModal from 'editor@/feedback/modalcore';

export const WrapContext = createContext({});

const { Header, Footer, Sider, Content } = Layout;

const WireBoard = () => {
  const [modal, openModal, closeModal] = useModal({});
  const CommonWidget = {
    openModal, closeModal
  };
  return <WrapContext.Provider value={CommonWidget}>
    <Layout>
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
      {modal}
    </Layout >
  </WrapContext.Provider>;
}

export default WireBoard;