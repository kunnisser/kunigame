/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:21:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-29 15:00:18
 * @FilePath: /kunigame/editor/page/wireboard.tsx
 * @Description: ---- 酷尼游戏控制台 ----
 */

import { Divider, Layout } from "antd";
import React, { createContext, useEffect, useState } from "react";
import KnHeader from "./header";
import KnTabs from "./outline";
import OutlineTree from "./outline/outline_tree";
import ContainerTree from "./outline/outline_tree/container";
import StageEditor from "./workbench/canvas";
import useModal from "editor@/feedback/modalcore";
import ErrorBoundary from "./error_boundary";
import { useSelector, useDispatch, useStore } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import AssetsList from "./outline/outline_tree/assets";
import Inspector from "./outline/inspector_config";
import {
  AppstoreOutlined,
  BuildOutlined,
  SettingOutlined,
  BulbOutlined,
  DesktopOutlined,
  RocketOutlined
} from "@ant-design/icons";
import "editor@/assets/index.styl";
import {
  clearEditGameItem,
  setCancelActionStack,
  setResumeActionStack
} from "editor@/common/gameStore/scene/action";
import { updateScene } from "editor@/api/request/scene";
import { EditGameName } from "editor@/page/workbench/canvas";
import { isObjectEmpty } from "editor@/tool";
import AlignHeader from "./header/align";
import TweenEditor from "./workbench/tween";

export const WrapContext = createContext({});

const { Header, Footer, Sider, Content } = Layout;

const WireBoard = (props) => {
  const [childModal, openChildModal, closeChildModal] = useModal({});
  const [modal, openModal, closeModal] = useModal({
    childModal: childModal
  });
  const store = useStore();
  const dispatch = useDispatch();
  const [sceneId, setCurrentSceneId] = useState("");
  const [isNewGameEdit, setIsNewGameEdit] = useState(false);

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
      icon: <DesktopOutlined />,
      suffixIcon: isNewGameEdit ? "*" : ""
    },
    {
      name: sceneId + "Tween",
      childComponent: TweenEditor,
      icon: <RocketOutlined />
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
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const editGameItem = store.getState().sceneReducer.editGameItem;
        if (!isObjectEmpty(editGameItem)) {
          const currentScene = store.getState().sceneReducer.currentScene;
          updateScene({
            projectName: EditGameName,
            sceneName: currentScene.id,
            editRecords: editGameItem
          });
          const { cancelActionStack, resumeActionStack } =
            store.getState().sceneReducer;
          cancelActionStack.length = 0;
          resumeActionStack.length = 0;
          setIsNewGameEdit(false);
          dispatch(clearEditGameItem());
          dispatch(setCancelActionStack(cancelActionStack));
          dispatch(setResumeActionStack(resumeActionStack));
        }
      }
    });
    store.subscribe(() => {
      checkEditTodoList();
    });
  }, []);

  useEffect(() => {
    if (selector) {
      setCurrentSceneId(selector.id);
    }
  }, [selector]);

  const checkEditTodoList = () => {
    const actionStack = store.getState().sceneReducer.cancelActionStack;
    const bool = actionStack && Object.keys(actionStack).length > 0;
    if (bool !== isNewGameEdit || !bool) {
      // 更新是否有操作记录
      setIsNewGameEdit(bool);
    }
  };

  return (
    <WrapContext.Provider value={CommonWidget}>
      <ErrorBoundary>
        <Layout>
          <Header style={{ marginBottom: "6px" }}>
            <div>
              <div className="logo">Kuni(kunigame)</div>
              <KnHeader />
            </div>
            <Divider style={{ margin: "2px 0" }} dashed></Divider>
            <AlignHeader></AlignHeader>
          </Header>
          <>{console.log("redner")}</>
          <Layout className="vh-scroll">
            <aside
              style={{
                display: "flex",
                flex: "0 0 0 0",
                flexDirection: "column"
              }}
            >
              <Sider>
                <KnTabs initialKey="tab_form" tabs={formTabs} />
              </Sider>
              <Sider>
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
            <Sider width={300}>
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
