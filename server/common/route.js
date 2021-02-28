/**
 * @Author: kunnisser
 * @Date: 2021-02-28 21:58:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-28 23:03:54
 * @FilePath: \kunigame\server\common\route.js
 * @Description: ---- 接口类方法 ----
 */

const normalErrorHandler = (ctx, error) => {
  if (error) {
    ctx.body = {
      code: CODE.FAIL,
      msg: error.message,
      data: null,
    };
    return;
  }
}

exports.normalErrorHandler = normalErrorHandler;