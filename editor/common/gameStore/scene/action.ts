/*
 * @Author: kunnisser
 * @Date: 2021-02-19 17:29:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-22 10:49:21
 * @FilePath: /kunigame/editor/common/gameStore/scene/action.ts
 * @Description: ---- 场景状态action ----
 */

const GET_SCENE_LIST = Symbol();

const getSceneList = (list) => {
  return {
    type: GET_SCENE_LIST,
    payload: list
  };
}

export {
  GET_SCENE_LIST,
  getSceneList
}
