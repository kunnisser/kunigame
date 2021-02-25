/**
 * @Author: kunnisser
 * @Date: 2021-02-25 17:08:05
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-25 17:20:52
 * @FilePath: /kunigame/server/route/scene/api.js
 * @Description: ---- 场景接口 ----
 */

var router = require('koa-router')();

router.get('/', async (ctx) => {
  ctx.body = 'sceneApi';
});


router.get('/demo', async (ctx) => {
  ctx.body = {
    code: CODE.SUCCESS,
    msg: '',
    data: [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
        icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg,https://img.18183.com/uploads/allimg/190522/235-1Z5221T522.png,https://img.18183.com/uploads/allimg/190522/235-1Z5221TS2.png'
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园2号',
        icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg'
      },
    ],
    pageLimit: {
      totalCount: 2
    }
  };
});

module.exports = router.routes();