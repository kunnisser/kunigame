/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:21:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-04-11 16:48:23
 * @FilePath: \kunigame\editor\page\wireboard.tsx
 * @Description: ---- 酷尼游戏控制台 ----
 */

import { Layout } from 'antd';
import React, { createContext, useEffect, useState } from 'react';
import KnHeader from './header';
import KnTabs from './outline';
import OutlineTree from './outline/outline_tree';
import StageEditor from './workbench/canvas';
import useModal from 'editor@/feedback/modalcore';
import ErrorBoundary from './error_boundary';
import { useSelector } from 'react-redux';
import { CombineReducer } from 'editor@/common/store';

export const WrapContext = createContext({});

const { Header, Footer, Sider, Content } = Layout;

const WireBoard = (props) => {
  const [childModal, openChildModal, closeChildModal] = useModal({});
  const [modal, openModal, closeModal] = useModal({ childModal: childModal });
  const [sceneId, setCurrentSceneId] = useState('');
  const CommonWidget = {
    openModal,
    closeModal,
    openChildModal,
    closeChildModal
  };
  const sceneTabs = [
    {
      name: "Outline",
      childComponent: OutlineTree
    }
  ];

  const selector = useSelector((store: CombineReducer) => store.sceneReducer.currentScene);


  const editorTabs = [
    {
      name: sceneId,
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

  useEffect(() => {
    if (selector) {
      setCurrentSceneId(selector.id);
    }
  }, [selector]);

  return <WrapContext.Provider value={CommonWidget}>
    <ErrorBoundary>
      <Layout>
        <Header>
          <div className="logo">
            <img src="../editor/assets/image/logo.png"></img>
          </div>
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