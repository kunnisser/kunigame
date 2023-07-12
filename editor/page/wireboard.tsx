/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:21:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-12 16:38:25
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
  RocketOutlined,
  UngroupOutlined
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
import ParticleEditor from "./workbench/particle";

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
  const [editorType, setEditorType] = useState("scene");

  const inspectorMap = {
    "scene": "场景元素",
    "tween": "缓动动画",
    "particle": "粒子特效",
    "animation": "帧动画"
  };

  const CommonWidget = {
    openModal,
    closeModal,
    openChildModal,
    closeChildModal
  };
  const sceneTabs = [
    {
      key: "leftScene",
      name: "场景元素",
      childComponent: <ContainerTree />,
      icon: <BuildOutlined />
    }
  ];

  const inspectorTabs = [
    {
      key: "inspector",
      name: inspectorMap[editorType],
      childComponent: <Inspector type={editorType} />,
      icon: <SettingOutlined />
    }
  ];

  const selector = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );

  const editorTabs = [
    {
      key: "scene",
      name: sceneId,
      childComponent: <StageEditor />,
      icon: <DesktopOutlined />,
      suffixIcon: isNewGameEdit ? "*" : ""
    },
    {
      key: "tween",
      name: sceneId + "Tween",
      childComponent: <TweenEditor type={editorType} />,
      icon: <RocketOutlined />
    },
    {
      key: "particle",
      name: sceneId + "Particle",
      childComponent: <ParticleEditor type={editorType} />,
      icon: <UngroupOutlined />
    },
    {
      key: "animation",
      name: sceneId + "Animation",
      childComponent: <>123</>,
      icon: <UngroupOutlined />
    }
  ];

  const formTabs = [
    {
      key: "sceneResource",
      name: "场景",
      childComponent: <OutlineTree />,
      icon: <AppstoreOutlined></AppstoreOutlined>
    }
  ];

  const footerTabs = [
    {
      key: "assets",
      name: "素材列表",
      childComponent: <AssetsList />,
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
                <KnTabs initialKey="sceneResource" tabs={formTabs} />
              </Sider>
              <Sider>
                <KnTabs initialKey="leftScene" tabs={sceneTabs} />
              </Sider>
            </aside>
            <Layout>
              <Content style={{ margin: "0 6px" }}>
                <KnTabs
                  initialKey="scene"
                  tabs={editorTabs}
                  onChange={(key) => {
                    setEditorType(key);
                  }}
                />
              </Content>
              <Footer className="kn-footer" style={{ marginTop: "6px" }}>
                <KnTabs initialKey="assets" tabs={footerTabs} />
              </Footer>
            </Layout>
            <Sider width={300}>
              <KnTabs initialKey="inspector" tabs={inspectorTabs} />
            </Sider>
          </Layout>
          {modal}
        </Layout>
      </ErrorBoundary>
    </WrapContext.Provider>
  );
};

export default WireBoard;
