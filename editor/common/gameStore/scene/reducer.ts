/*
 * @Author: kunnisser
 * @Date: 2021-02-22 09:21:27
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-22 14:12:14
 * @FilePath: /kunigame/editor/common/gameStore/scene/reducer.ts
 * @Description: ---- 操作scene状态 ----
 */
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import { GET_SCENE_LIST } from './action';

export interface SceneState {
  scene: Array<KnScene>
};

const initialState: SceneState = {
  scene: []
};

let SceneMap = {
};

const _getSceneList = (state, action) => {
  return {
    ...state,
    scene: action.payload
  };
}

SceneMap[GET_SCENE_LIST] = _getSceneList;

const sceneReducer = (state = initialState, action) => {
  if (SceneMap[action.type]) {
    return SceneMap[action.type](state, action);
  } else {
    return { ...state };
  }
}

export default sceneReducer;
