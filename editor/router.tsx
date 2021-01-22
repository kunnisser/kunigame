/*
 * @Author: kunnisser 
 * @Date: 2019-09-11 13:32:04 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-10-09 14:35:04
 */

/*
* 定义全局根路由组件
* @class AppRouter
* */

import React from "react"
import { Router } from '@reach/router';
import boardRoutes from './route';
const routes = boardRoutes;

const AppRouter = () => {
  const switchRoutes = (
    <Router>
      {
        routes.map((prop: object, key: any) => {
          const ComponentChild = prop['component'];
          if (prop['path'] === '*') {
            return <ComponentChild default key={prop['key']} />
          } else {
            return <ComponentChild path={prop['path']} name={prop['name']} key={prop['key']} />
          }
        })
      }
    </Router>
  );
  return switchRoutes;
}

export default AppRouter;