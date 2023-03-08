/*
 * @Author: kunnisser
 * @Date: 2021-01-24 21:50:10
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-08 17:06:35
 * @FilePath: /kunigame/editor/page/outline/outline_tree/index.tsx
 * @Description: ---- 大纲树状结构 ----
 */

import React, { useState, useEffect } from "react";
import { Tree, Input, Dropdown, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import { MenuOperation } from "../menu_operation/index";
import {
  clearEditGameItem,
  getGameItem,
  setCurrentScene
} from "editor@/common/gameStore/scene/action";
import {
  BarsOutlined,
  AppstoreOutlined,
  CaretDownOutlined
} from "@ant-design/icons";
import Game from "ts@/kuni/lib/core";
import { isObjectEmpty } from "editor@/tool";
import { updateScene } from "editor@/api/request/scene";
import { EditGameName } from "editor@/page/workbench/canvas";

const { confirm } = Modal;

const OutlineTree = () => {
  const [displayList, setDisplayList] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(["scenes"]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [rightClickType, setRightClickType] = useState();
  const [selectedKeys, setSelectedKeys] = useState([] as any);
  const { CreateSceneMenu } = MenuOperation;

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
  };

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const dataList: Array<any> = [];
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key: string = node.key;
      dataList.push({ key, title: key });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(displayList);

  // 查找场景
  const onChange = (e) => {
    const { value } = e.target;
    const expandedKeys: any = dataList
      .map((item: any) => {
        if (item["title"].indexOf(value) > -1) {
          return getParentKey(item.key, displayList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
    setSearchValue(value);
  };

  // 获取游戏实例
  const game: Game = useSelector(
    (store: CombineReducer) => store.sceneReducer.game
  );

  const dispatch: any = useDispatch();

  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );

  const editGameItem = useSelector(
    (store: CombineReducer) => store.sceneReducer.editGameItem
  );

  // 遍历添加查询样式
  const loop = (data) =>
    data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) };
      }

      return {
        title,
        key: item.key,
        isLeaf: true,
        icon: <BarsOutlined />
      };
    });

  // 监听游戏初始化完成
  useEffect(() => {
    if (game) {
      const sceneListTree = Object.values(game.editHive).map(
        (scene: KnScene) => ({
          title: scene.id,
          key: scene.id
        })
      );
      const curDisplayList: any = [
        {
          title: "显示列表",
          key: "scenes",
          children: sceneListTree,
          icon: <AppstoreOutlined />
        }
      ];
      setDisplayList(curDisplayList);
    }

    onExpand(["scenes"]);
  }, [game]);

  // 场景列表管理菜单
  const sceneListMenu = <CreateSceneMenu></CreateSceneMenu>;

  // 场景操作列表
  const sceneMenu = (
    <div></div>
    // <Menu>
    //   <Menu.Item key="manage_scene">删除</Menu.Item>
    // </Menu>
  );

  //跳转场景
  const changeAppointScene = (pickedScene: any) => {
    setSelectedKeys([pickedScene.name]);
    currentScene && game.sceneManager.exitEditScene(currentScene);
    dispatch(setCurrentScene(pickedScene));
    // 清空当前目标
    dispatch(getGameItem(null));
  };

  return (
    <div>
      <Input
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={onChange}
      />
      <Dropdown
        overlay={rightClickType == "scenes" ? sceneListMenu : sceneMenu}
        trigger={["contextMenu"]}
      >
        <Tree
          showIcon
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          switcherIcon={<CaretDownOutlined />}
          defaultExpandAll
          autoExpandParent={autoExpandParent}
          treeData={loop(displayList)}
          onSelect={(selected: Array<string>) => {
            const key: string = selected[0];
            const pickedScene: KnScene | null = game.editHive[key];

            if (pickedScene) {
              // 设置当前编辑游戏场景
              if (!currentScene || currentScene.id !== pickedScene.id) {
                // confirm是否提交操作
                if (isObjectEmpty(editGameItem)) {
                  changeAppointScene(pickedScene);
                } else {
                  confirm({
                    title: "还存在编辑记录，确认先进行保存么？",
                    onOk() {
                      updateScene({
                        projectName: EditGameName,
                        sceneName: currentScene.id,
                        editRecords: editGameItem
                      });
                      dispatch(clearEditGameItem());

                      changeAppointScene(pickedScene);
                    }
                  });
                }
              }
            }
          }}
          onRightClick={(e: any) => {
            setRightClickType(e.node.key);
          }}
        />
      </Dropdown>
    </div>
  );
};

export default OutlineTree;
