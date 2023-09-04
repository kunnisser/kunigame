/*
 * @Author: kunnisser
 * @Date: 2023-02-02 16:46:30
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-04 19:45:47
 * @FilePath: \kunigame\editor\page\outline\outline_tree\container.tsx
 * @Description: ---- 场景元素列表 ----
 */
import React, { useState, useEffect } from "react";
import { message, Tree } from "antd";
import { useDispatch, useSelector, useStore } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import Icon from "@ant-design/icons";
import { ReactComponent as TextIcon } from "editor@/assets/icon/text.svg";
import { ReactComponent as SpriteIcon } from "editor@/assets/icon/sprite.svg";
import { ReactComponent as GroupIcon } from "editor@/assets/icon/group.svg";
import { ReactComponent as GraphicsIcon } from "editor@/assets/icon/graphics.svg";
import { DataNode } from "antd/lib/tree";
import { updateEditGameItem } from "editor@/common/gameStore/scene/action";
import EditorTools from "ts@/template/src/tools";

const ContainerTree = () => {
  const [displayList, setDisplayList] = useState([] as any);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const store = useStore();
  const dispatch = useDispatch();
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };
  const listenEditGameItem = useSelector((store: CombineReducer) => {
    return store.sceneReducer.editGameItem;
  });
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
      "KnBackGround": {
        key: "name",
        icon: SpriteIcon
      },
      "KnSprite": {
        key: "name",
        icon: SpriteIcon
      },
      "AnimatedSprite": {
        key: "name",
        icon: SpriteIcon
      },
      "KnBitMapText": {
        key: "id",
        icon: TextIcon
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

      if (item.constructor.name === "KnGroup") {
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
    game.editorTools.onClickHandler([element.node.item]);
  };

  const dropHandler = (info) => {
    const dragTargetNode = info.dragNode;
    const dropTargetNode = info.node;
    const dropPos = dropTargetNode.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const isGroup = dropTargetNode.item.constructor.name === "KnGroup";
    const isDropAble =
      dropTargetNode.dragOverGapTop ||
      dropTargetNode.dragOverGapBottom ||
      !dropTargetNode.isLeaf ||
      isGroup;
    if (isDropAble) {
      const dragKey = dragTargetNode.key;
      const dropKey = dropTargetNode.key;

      const dropLoop = (
        data: DataNode[],
        key: React.Key,
        callback: (node: DataNode, i: number, data: DataNode[]) => void
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
      let dragObj: any;
      dropLoop(data, dragKey, (item: any, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
        // item.item.parent.removeChild(dragObj.item);
      });

      if (!info.dropToGap) {
        // Drop on the content
        dropLoop(data, dropKey, (item: any) => {
          item.children = item.children || [];
          // where to insert 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj);
          const tool: EditorTools =
            store.getState().sceneReducer.game.editorTools;
          tool.recordOperationStep([dragObj.item], (record, target?: any) => {
            record.prev = {
              parent: target.parent.name,
              index: target.parent.getChildIndex(target)
            };
            item.item.addChildAt(target, 0);
            // alignCallback(item, game);
            record.next = {
              parent: target.parent.name,
              index: target.parent.getChildIndex(target)
            };
            listenEditGameItem[item.item.name] = Object.assign(
              listenEditGameItem[item.item.name] || {},
              record.next
            );
            return record;
          });
          dispatch(updateEditGameItem(listenEditGameItem));
        });
      } else if (
        ((dropTargetNode as any).props.children || []).length > 0 && // Has children
        (dropTargetNode as any).props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        console.log(listenEditGameItem);
        dropLoop(data, dropKey, (item: any) => {
          item.children = item.children || [];
          // where to insert 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj);
          item.item.addChildAt(dragObj.item, 0);
        });
      } else {
        console.log(listenEditGameItem);
        let ar: DataNode[] = [];
        let i: number;
        let node: any = null;
        dropLoop(data, dropKey, (_item, index, arr) => {
          ar = arr;
          i = index;
          node = _item;
        });
        const isCommonGroup =
          node.item.parent.name === dragObj!.item.parent.name;
        if (dropPosition === -1) {
          ar.splice(i!, 0, dragObj!);
          // 不同组拖拽和相同组内拖拽api不同
          if (isCommonGroup) {
            node.item.parent.setChildIndex(dragObj!.item, i!);
          } else {
            node.item.parent.addChildAt(dragObj!.item, i!);
          }
        } else {
          console.log(listenEditGameItem);
          ar.splice(i! + 1, 0, dragObj!);
          if (isCommonGroup) {
            node.item.parent.setChildIndex(dragObj!.item, i! + 1);
          } else {
            node.item.parent.addChildAt(dragObj!.item, i! + 1);
          }
        }
      }
      game.editorTools.onClickHandler(store.getState().sceneReducer.gameItem);
      setDisplayList(data);
    } else {
      message.warning("不可移动到根节点!");
    }
  };

  return (
    <div>
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
