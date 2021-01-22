/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:03:56
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-22 17:27:49
 * @FilePath: /kunigame/editor/route/index.ts
 * @Description: ---- 编辑器总路由 ----
 */
import WireBoard from '../page/wireboard';

/** 路由对象 */
interface PathRouter {
  /** 路径名称 */
  path: string
  component: any,
  key: string
}

const boardRoutes: Array<PathRouter> = [
  {
    path: '/',
    component: WireBoard,
    key: 'main'
  },
  {
    path: '/index',
    component: WireBoard,
    key: 'index'
  },
];

export default boardRoutes;