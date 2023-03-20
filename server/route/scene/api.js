/**
 * @Author: kunnisser
 * @Date: 2021-02-25 17:08:05
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-20 16:15:50
 * @FilePath: /kunigame/server/route/scene/api.js
 * @Description: ---- 场景接口 ----
 */

var router = require("koa-router")();
const { updateScene } = require("./implement/updateSceneElement");
const { addAssetsToScene } = require("./implement/assetsManager");
var fs = require("fs-extra");
router.get("/", async (ctx) => {
  ctx.body = "sceneApi";
});

router.post("/create", async (ctx) => {
  let requestParams = ctx.request.body;
  ctx.body = {
    code: CODE.SUCCESS,
    msg: "创建成功",
    data: null
  };
});

router.post("/update", async (ctx) => {
  console.log(ctx.request.body);
  const ast = updateScene(ctx.request.body);
  ctx.body = {
    code: CODE.SUCCESS,
    msg: "更新成功",
    data: ast
  };
});

router.post("/addAssets", async (ctx) => {
  const ast = addAssetsToScene(ctx.request.body);
  ctx.body = {
    code: CODE.SUCCESS,
    msg: "添加成功",
    data: ast
  };
});

module.exports = router.routes();
