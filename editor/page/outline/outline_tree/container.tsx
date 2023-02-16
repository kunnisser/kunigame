/*
 * @Author: kunnisser
 * @Date: 2023-02-02 16:46:30
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-15 14:58:44
 * @FilePath: /kunigame/editor/page/outline/outline_tree/container.tsx
 * @Description: ---- 场景元素列表 ----
 */
import React, { useState, useEffect } from "react";
import { Tree } from "antd";
import { useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import Icon from "@ant-design/icons";
import TextIcon from "editor@/assets/icon/text.svg";
import SpriteIcon from "editor@/assets/icon/sprite.svg";
import GroupIcon from "editor@/assets/icon/group.svg";
import GraphicsIcon from "editor@/assets/icon/graphics.svg";

const ContainerTree = () => {
  const [displayList, setDisplayList] = useState([] as any);
  const [expandedKeys, setExpandedKeys] = useState([]);

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
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

  // 命名规则生成
  const generateTargetName = (item) => {
    const nameTypeMap = {
      "KnGroup": {
        key: "name",
        icon: GroupIcon
      },
      "KnText": {
        key: "id",
        icon: TextIcon
      },
      "KnGraphics": {
        key: "id",
        icon: GraphicsIcon
      },
      "KnSprite": {
        key: "id",
        icon: SpriteIcon
      }
    };
    const type: string = item.constructor.name;
    const key: string = nameTypeMap[type].key;
    const icon: any = nameTypeMap[type].icon;
    return [type, item[key], icon];
  };

  // 遍历添加查询样式
  const loop = (data) =>
    data.map((item) => {
      const [type, title, icon] = generateTargetName(item);
      const targetKey = `${type}_${title}`;

      if (item.children && item.children.length) {
        return {
          title,
          key: targetKey,
          children: loop(item.children),
          icon: <Icon component={icon as any} />,
          item
        };
      } else {
        return {
          title,
          key: targetKey,
          isLeaf: true,
          icon: <Icon component={icon as any} />,
          item
        };
      }
    });

  // 监听游戏初始化完成
  useEffect(() => {
    if (currentScene && currentScene.children) {
      // 跳转当前编辑游戏场景
      const createdSceneEntity: any = getCreatedScene();
      // 判断是否场景资源已经加载
      if (createdSceneEntity instanceof Promise) {
        createdSceneEntity.then((ret) => {
          setCreatedScene(ret);
        });
      } else {
        setCreatedScene(createdSceneEntity);
      }
    }
  }, [currentScene]);

  const getCreatedScene = async () => {
    return await game.sceneManager.dispatchEditScene(currentScene);
  };

  const setCreatedScene = (scene) => {
    // 当前游戏场景下的容器列表
    const containerList: Array<any> = scene.children;
    setDisplayList(containerList);
    onExpand(["containerTree"]);
  };

  const selectElementTarget = (keys: Array<string>, element: any) => {
    console.log(keys, element.node.item);
    game.editorTools.dragTool.onClickDragging(element.node.item);
  };

  return (
    <div>
      {/* <Input
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={onChange}
      /> */}
      <Tree
        showIcon
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        treeData={loop(displayList)}
        onSelect={selectElementTarget}
      />
    </div>
  );
};

export default ContainerTree;
