/*
 * @Author: kunnisser
 * @Date: 2021-01-21 16:57:00
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-22 17:33:53
 * @FilePath: /kunigame/editor/index.tsx
 * @Description: ---- 酷尼编辑器入口文件 ----
 */

/*
* 项目初始化
* @method hotRender
* */
import React from 'react';
import ReactDOM from 'react-dom';
import AdminRouter from './router';

// 引入公共状态相关组件
import { ConfigProvider } from 'antd';

ReactDOM.render(
  <ConfigProvider>
    <AdminRouter />
  </ConfigProvider>
  , document.getElementById('editor'));

// 按路由进行热更新
// if (module['hot']) {
//   module['hot'].accept();
// }
