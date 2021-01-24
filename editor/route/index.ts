/*
 * @Author: kunnisser
 * @Date: 2021-01-21 17:03:56
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-23 00:11:39
 * @FilePath: \kunigame\editor\route\index.ts
 * @Description: ---- 编辑器总路由 ----
 */
import WireBoard from '../page/wireboard';
import NotFound from '../page/not_found';

/** 路由对象 */
interface PathRouter {
  /** 路径名称 */
  name: string,
  path: string
  component: Function,
  key: string
}

const boardRoutes: Array<PathRouter> = [
  {
    name: 'main',
    path: '/editor/',
    component: WireBoard,
    key: 'main'
  },
  {
    name: 'main',
    path: '/editor/index',
    component: WireBoard,
    key: 'main'
  },
  {
    name: 'notFound',
    path: '*',
    component: NotFound,
    key: '404'
  },
];

export default boardRoutes;