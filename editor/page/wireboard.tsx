/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:21:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-27 10:46:22
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
import AssetsList from "./outline/outline_tree/assets";
import Inspector from "./outline/inspector_config";
import {
  AppstoreOutlined,
  BuildOutlined,
  SettingOutlined,
  BulbOutlined,
  DesktopOutlined
} from "@ant-design/icons";
import "editor@/assets/index.styl";

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
      childComponent: ContainerTree,
      icon: <BuildOutlined />
    }
  ];

  const inspectorTabs = [
    {
      name: "元素配置",
      childComponent: Inspector,
      icon: <SettingOutlined />
    }
  ];

  const selector = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );

  const editorTabs = [
    {
      name: sceneId,
      childComponent: StageEditor,
      icon: <DesktopOutlined />
    }
  ];

  const formTabs = [
    {
      name: "场景",
      childComponent: OutlineTree,
      icon: <AppstoreOutlined></AppstoreOutlined>
    }
  ];

  const footerTabs = [
    {
      name: "素材列表",
      childComponent: AssetsList,
      icon: <BulbOutlined />
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
          <Layout className="vh-scroll">
            <aside
              style={{
                display: "flex",
                flex: "0 0 0 0",
                flexDirection: "column"
              }}
            >
              <Sider theme="light">
                <KnTabs initialKey="tab_form" tabs={formTabs} />
              </Sider>
              <Sider theme="light">
                <KnTabs initialKey="tab_scene" tabs={sceneTabs} />
              </Sider>
            </aside>
            <Layout>
              <Content style={{ margin: "0 6px" }}>
                <KnTabs initialKey="tab_editor" tabs={editorTabs} />
              </Content>
              <Footer className="kn-footer" style={{ marginTop: "6px" }}>
                <KnTabs initialKey="tab_footer" tabs={footerTabs} />
              </Footer>
            </Layout>
            <Sider theme="light" width={300}>
              <KnTabs initialKey="tab_scene" tabs={inspectorTabs} />
            </Sider>
          </Layout>
          {modal}
        </Layout>
      </ErrorBoundary>
    </WrapContext.Provider>
  );
};

export default WireBoard;
