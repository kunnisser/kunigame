/*
 * @Author: kunnisser
 * @Date: 2021-01-21 16:57:00
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-25 21:45:13
 * @FilePath: \kunigame\editor\index.tsx
 * @Description: ---- 酷尼编辑器入口文件 ----
 */

import React from 'react';
import { render } from 'react-dom';
import AppRouter from './router';
// 引入公共状态相关组件
import { ConfigProvider } from 'antd';
// 引入redux
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Combines from 'editor@/common/store';
import './assets/main.less';
import zhCN from 'antd/es/locale/zh_CN';

const store: any = createStore(Combines);

render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </ConfigProvider>
  , document.getElementById('editor'),
);

// 按路由进行热更新
// if (module['hot']) {
//   module['hot'].accept();
// }
