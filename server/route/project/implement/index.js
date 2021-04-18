/**
 * @Author: kunnisser
 * @Date: 2021-03-07 21:22:41
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-04-18 19:08:29
 * @FilePath: \kunigame\server\route\project\implement\index.js
 * @Description: ---- 项目方法实现入口 ----
 */

var { createGame } = require('./createGame');
var { removeGame } = require('./removeGame');
var { switchGameProject } = require('./switchGame');
var { getGameProjectList } = require('./getGameProjectList');
var { editGameProject } = require('./editGame');

module.exports = {
  createGame,
  removeGame,
  switchGameProject,
  getGameProjectList,
  editGameProject,
};
