/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:21:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-02 17:31:00
 * @FilePath: /kunigame/editor/page/wireboard.tsx
 * @Description: ---- 酷尼游戏控制台 ----
 */

import { Layout } from "antd";
import React, { createContext, useEffect, useState } from "react";
import KnHeader from "./header";
import KnTabs from "./outline";
import OutlineTree from "./outline/outline_tree";
import ContainerTree from "./outline/outline_tree/container";
import StageEditor from "./workbench/canvas";
import useModal from "editor@/feedback/modalcore";
import ErrorBoundary from "./error_boundary";
import { useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";

export const WrapContext = createContext({});

const { Header, Footer, Sider, Content } = Layout;

const WireBoard = (props) => {
  const [childModal, openChildModal, closeChildModal] = useModal({});
  const [modal, openModal, closeModal] = useModal({ childModal: childModal });
  const [sceneId, setCurrentSceneId] = useState("");
  const CommonWidget = {
    openModal,
    closeModal,
    openChildModal,
    closeChildModal
  };
  const sceneTabs = [
    {
      name: "场景元素",
      childComponent: ContainerTree
    }
  ];

  const selector = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );

  const editorTabs = [
    {
      name: sceneId,
      childComponent: StageEditor
    }
  ];

  const formTabs = [
    {
      name: "场景",
      childComponent: OutlineTree
    }
  ];

  const footerTabs = [
    {
      name: "素材列表",
      childComponent: OutlineTree
    }
  ];

  useEffect(() => {
    if (selector) {
      setCurrentSceneId(selector.id);
    }
  }, [selector]);

  return (
    <WrapContext.Provider value={CommonWidget}>
      <ErrorBoundary>
        <Layout>
          <Header style={{ marginBottom: "6px" }}>
            <div className="logo">Kuni(kunigame)</div>
            <KnHeader />
          </Header>
          <Layout>
            <Sider theme="light">
              <KnTabs initialKey="tab_scene" tabs={sceneTabs} />
            </Sider>
            <Content style={{ margin: "0 6px" }}>
              <KnTabs initialKey="tab_editor" tabs={editorTabs} />
            </Content>
            <Sider theme="light">
              <KnTabs initialKey="tab_form" tabs={formTabs} />
            </Sider>
          </Layout>
          <Footer className="kn-footer" style={{ marginTop: "6px" }}>
            <KnTabs initialKey="tab_footer" tabs={footerTabs} />
          </Footer>
          {modal}
        </Layout>
      </ErrorBoundary>
    </WrapContext.Provider>
  );
};

export default WireBoard;
