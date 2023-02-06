/*
 * @Author: kunnisser
 * @Date: 2023-02-02 16:46:30
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-06 16:50:13
 * @FilePath: /kunigame/editor/page/outline/outline_tree/container.tsx
 * @Description: ---- 场景元素列表 ----
 */
import React, { useState, useEffect } from "react";
import { Tree, Dropdown } from "antd";
import { useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import { MenuOperation } from "../menu_operation/index";

const DirectoryTree = Tree.DirectoryTree;

const ContainerTree = () => {
  const [displayList, setDisplayList] = useState([] as any);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [rightClickType, setRightClickType] = useState();

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

  // 查找场景
  // const onChange = (e) => {
  //   const { value } = e.target;
  //   const expandedKeys: any = currentScene.id;
  //   setExpandedKeys(expandedKeys);
  //   setAutoExpandParent(true);
  //   setSearchValue(value);
  // };

  // 当前游戏场景
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );

  const game = useSelector((store: CombineReducer) => store.sceneReducer.game);

  // 遍历添加查询样式
  const loop = (data) =>
    data.map((item) => {
      const target: String = `${item.constructor.name}_${item.text}`;
      const title = target;
      if (item.children > 0) {
        return { title, key: target, children: loop(item.children) };
      }
      console.log(target);
      return {
        title,
        key: target,
        isLeaf: true
      };
    });

  // 监听游戏初始化完成
  useEffect(() => {
    if (currentScene && currentScene.children) {
      // 跳转当前编辑游戏场景
      const createdScene = game.sceneManager.dispatchEditScene(currentScene);
      console.log(createdScene);

      // 当前游戏场景下的容器列表
      const containerList: Array<any> = createdScene.children;
      setDisplayList(containerList);
      onExpand(["containerTree", createdScene.id]);
    }
  }, [currentScene]);

  // 场景列表管理菜单
  const sceneListMenu = <CreateSceneMenu></CreateSceneMenu>;

  // 场景操作列表
  const sceneMenu = (
    <div></div>
    // <Menu>
    //   <Menu.Item key="manage_scene">删除</Menu.Item>
    // </Menu>
  );

  return (
    <div>
      {/* <Input
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={onChange}
      /> */}
      <Dropdown
        overlay={rightClickType == "scenes" ? sceneListMenu : sceneMenu}
        trigger={["contextMenu"]}
      >
        <DirectoryTree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          defaultExpandAll
          autoExpandParent={autoExpandParent}
          treeData={loop(displayList)}
          onRightClick={(e: any) => {
            setRightClickType(e.node.key);
          }}
        />
      </Dropdown>
    </div>
  );
};

export default ContainerTree;
