/**
 * @Author: kunnisser
 * @Date: 2021-02-25 17:11:55
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-26 17:02:55
 * @FilePath: /kunigame/server/env/index.js
 * @Description: ---- 公共变量 ----
 */

module.exports = () => {
  global.CODE = {
    SUCCESS: '200',
    FAIL: '503',
    AUTHEXPIRED: '402',
    AUTHERROR: '401',
    TIMEOUT: '408'
  }
}