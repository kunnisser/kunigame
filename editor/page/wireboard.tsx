/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:21:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-22 16:21:01
 * @FilePath: /kunigame/editor/page/wireboard.tsx
 * @Description: ---- 酷尼游戏控制台 ----
 */

import { Layout } from 'antd';
import React, { createContext } from 'react';
import KnHeader from './header';
import KnTabs from './outline';
import OutlineTree from './outline/outline_tree';
import StageEditor from './workbench/canvas';
import useModal from 'editor@/feedback/modalcore';
import ErrorBoundary from './error_boundary';

export const WrapContext = createContext({});

const { Header, Footer, Sider, Content } = Layout;

const WireBoard = (props) => {
  const [modal, openModal, closeModal] = useModal({});
  const CommonWidget = {
    openModal, closeModal
  };
  const sceneTabs = [
    {
      name: "Outline",
      childComponent: OutlineTree
    }
  ];

  const editorTabs = [
    {
      name: "场景编辑",
      childComponent: StageEditor
    }
  ];

  const formTabs = [
    {
      name: "查看",
      childComponent: OutlineTree
    }
  ];

  const footerTabs = [
    {
      name: "元素列表",
      childComponent: OutlineTree
    }
  ];

  return <WrapContext.Provider value={CommonWidget}>
    <ErrorBoundary>
      <Layout>
        <Header>
          <img className="logo" src="../editor/assets/image/logo.png"></img>
          <KnHeader />
        </Header>
        <Layout>
          <Sider><KnTabs initialKey="tab_scene" tabs={sceneTabs} /></Sider>
          <Content>
            <KnTabs initialKey="tab_editor" tabs={editorTabs} />
          </Content>
          <Sider><KnTabs initialKey="tab_form" tabs={formTabs} /></Sider>
        </Layout>
        <Footer className="kn-footer">
          <KnTabs initialKey="tab_footer" tabs={footerTabs} />
        </Footer>
        {modal}
      </Layout >
    </ErrorBoundary>
  </WrapContext.Provider>;
}

export default WireBoard;