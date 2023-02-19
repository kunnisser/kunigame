/*
 * @Author: kunnisser
 * @Date: 2023-02-02 16:46:30
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-20 00:01:51
 * @FilePath: \kunigame\editor\page\outline\outline_tree\container.tsx
 * @Description: ---- 场景元素列表 ----
 */
import React, { useState, useEffect } from "react";
import { message, Tree } from "antd";
import { useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import Icon from "@ant-design/icons";
import TextIcon from "editor@/assets/icon/text.svg";
import SpriteIcon from "editor@/assets/icon/sprite.svg";
import GroupIcon from "editor@/assets/icon/group.svg";
import GraphicsIcon from "editor@/assets/icon/graphics.svg";
import { DataNode } from "antd/lib/tree";

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

      if (item.constructor.name === 'KnGroup') {
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
    const transformTreeList = loop(containerList);
    setDisplayList(transformTreeList);
    onExpand(["containerTree"]);
  };

  const selectElementTarget = (keys: Array<string>, element: any) => {
    console.log(keys, element.node.item);
    game.editorTools.dragTool.onClickDragging(element.node.item);
  };



  const dropHandler = (info) => {
    console.log('把', info.dragNode);
    console.log('移动到', info.node);
    const dragTargetNode = info.dragNode;
    const dropTargetNode = info.node;
    const dropPos = dropTargetNode.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const isGroup = dropTargetNode.item.constructor.name === 'KnGroup';
    const isDropAble = dropTargetNode.dragOverGapTop || dropTargetNode.dragOverGapBottom || !dropTargetNode.isLeaf || isGroup;
    if (isDropAble) {
      console.log(info.dropPosition, dropPosition);
      const dragKey = dragTargetNode.key;
      const dropKey = dropTargetNode.key;

      const dropIndex = info.dropPosition > 0 ? info.dropPosition - 1 : 0;

      // 如果drop的目标不是KnGroup，则说明是在组内移动， 如果是KnGroup则认为是跨组
      if (isGroup && dropPosition === 0) {
        dropTargetNode.item.addChildAt(dragTargetNode.item, dropIndex);
      } else {
        if (dropTargetNode.item.parent.id === dragTargetNode.item.parent.id) {
          dropTargetNode.item.parent.setChildIndex(dragTargetNode.item, dropIndex);
        } else {
          dropTargetNode.item.parent.addChildAt(dragTargetNode.item, dropIndex);
        }
      }

      const dropLoop = (
        data: DataNode[],
        key: React.Key,
        callback: (node: DataNode, i: number, data: DataNode[]) => void,
      ) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data);
          }
          if (data[i].children) {
            dropLoop(data[i].children!, key, callback);
          }
        }
      };
      const data = [...displayList];

      // Find dragObject
      let dragObj: DataNode;
      dropLoop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!info.dropToGap) {
        // Drop on the content
        dropLoop(data, dropKey, (item) => {
          item.children = item.children || [];
          // where to insert 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj);
        });
      } else if (
        ((dropTargetNode as any).props.children || []).length > 0 && // Has children
        (dropTargetNode as any).props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        dropLoop(data, dropKey, (item) => {
          item.children = item.children || [];
          // where to insert 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj);
          // in previous version, we use item.children.push(dragObj) to insert the
          // item to the tail of the children
        });
      } else {
        let ar: DataNode[] = [];
        let i: number;
        dropLoop(data, dropKey, (_item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i!, 0, dragObj!);
        } else {
          ar.splice(i! + 1, 0, dragObj!);
        }
      }
      console.log(data);
      setDisplayList(data);
    } else {
      message.warning('不可移动到根节点!');
    }

  }

  return (
    <div>
      {/* <Input
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={onChange}
      /> */}
      <Tree
        showIcon
        draggable
        blockNode
        onDrop={dropHandler}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        treeData={displayList}
        onSelect={selectElementTarget}
      />
    </div>
  );
};

export default ContainerTree;