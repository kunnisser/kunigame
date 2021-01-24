/*
 * @Author: kunnisser
 * @Date: 2021-01-21 16:57:00
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-23 23:48:30
 * @FilePath: \kunigame\editor\index.tsx
 * @Description: ---- 酷尼编辑器入口文件 ----
 */

import React from 'react';
import { render } from 'react-dom';
import AppRouter from './router';
// 引入公共状态相关组件
import { ConfigProvider } from 'antd';
import './assets/main.less';

render(
  <ConfigProvider>
    <AppRouter />
  </ConfigProvider>
  , document.getElementById('editor'),
);

// 按路由进行热更新
// if (module['hot']) {
//   module['hot'].accept();
// }
