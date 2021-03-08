/**
 * @Author: kunnisser
 * @Date: 2021-03-07 21:26:11
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-03-07 21:57:15
 * @FilePath: \kunigame\server\route\project\implement\getGameProjectList.js
 * @Description: ---- 获取已存项目列表 ----
 */
const fs = require('fs');
const {hivePath} = require('../path/index');

/**
 * @description: 获取已存游戏项目
 * @param {*} async
 * @return {*}
 */
const getGameProjectList = async () => {
 const dirs =  fs.readdirSync(hivePath);
 return dirs;
};

exports.getGameProjectList = getGameProjectList;