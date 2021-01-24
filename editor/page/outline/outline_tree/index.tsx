/*
 * @Author: kunnisser
 * @Date: 2021-01-24 21:50:10
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-24 22:40:09
 * @FilePath: \kunigame\editor\page\outline\outline_tree\index.tsx
 * @Description: ---- 大纲树状结构 ----
 */

import React, { useState } from 'react';
import { Tree, Input } from 'antd';

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey?: string, _tns?: any) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children: Array<string> = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList: Array<any> = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node: object = data[i];
    const key: any = node['key'];
    dataList.push({ key, title: key });
    if (node['children']) {
      generateList(node['children']);
    }
  }
};
generateList(gData);

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

const OutlineTree = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);


  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = e => {
    const { value } = e.target;
    const expandedKeys: any = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
    setSearchValue(value);
  };

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
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={loop(gData)}
      />
    </div>
  );
}

export default OutlineTree;
