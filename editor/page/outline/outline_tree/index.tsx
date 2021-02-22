/*
 * @Author: kunnisser
 * @Date: 2021-01-24 21:50:10
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-22 16:06:57
 * @FilePath: /kunigame/editor/page/outline/outline_tree/index.tsx
 * @Description: ---- 大纲树状结构 ----
 */

import React, { useState, useEffect } from 'react';
import { Tree, Input } from 'antd';
import { useSelector } from 'react-redux';
import { CombineReducer } from 'editor@/common/store';
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
const DirectoryTree = Tree.DirectoryTree;
const OutlineTree = () => {
  const [displayList, setDisplayList] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };


  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const dataList: Array<any> = [];
  const generateList = data => {
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

  const onChange = e => {
    const { value } = e.target;
    const expandedKeys: any = dataList
      .map((item: any) => {
        if (item['title'].indexOf(value) > -1) {
          return getParentKey(item.key, displayList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
    setSearchValue(value);
  };

  const selector = useSelector((store: CombineReducer) => store.sceneReducer.scene);
  const sceneList = Object.values(selector).map((scene: KnScene) => ({
    title: scene.id,
    key: scene.id
  }));

  useEffect(() => {

    const curDisplayList: any = [{
      title: '光标',
      key: 'cursor',
    },
    {
      title: '显示列表',
      key: 'scenes',
      children: sceneList
    }];
    setDisplayList(curDisplayList);
  }, [selector]);

  const loop = data =>
    data.map(item => {
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
      };
    });

  return (
    <div>
      <Input style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
      <DirectoryTree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        defaultExpandAll
        autoExpandParent={autoExpandParent}
        treeData={loop(displayList)}
      />
    </div>
  );
}

export default OutlineTree;
