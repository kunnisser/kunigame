/**
 * @Author: kunnisser
 * @Date: 2021-03-07 21:22:41
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-03-07 21:29:03
 * @FilePath: \kunigame\server\route\project\implement\index.js
 * @Description: ---- 项目方法实现入口 ----
 */

 var {createGame} = require('./createGame');
 var {switchGameProject} = require('./switchGame');
 var {getGameProjectList} = require('./getGameProjectList');

module.exports = {
  createGame,
  switchGameProject,
  getGameProjectList
}
