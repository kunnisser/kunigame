/*
 * @Author: kunnisser
 * @Date: 2021-02-22 09:21:27
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-25 10:10:08
 * @FilePath: /kunigame/editor/common/gameStore/scene/reducer.ts
 * @Description: ---- 操作scene状态 ----
 */
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import { GET_SCENE_LIST, SET_CURRENT_SCENE } from './action';

export interface SceneState {
  scene: Array<KnScene>,
  currentScene: KnScene | null
};

const initialState: SceneState = {
  scene: [],
  currentScene: null
};

const _getSceneList = (state: SceneState, action) => {
  return {
    ...state,
    scene: action.payload
  };
}

const _setCurrentScene = (state: SceneState, action) => {
  return {
    ...state,
    currentScene: action.payload
  }
}

let SceneMap = {
};
SceneMap[GET_SCENE_LIST] = _getSceneList;
SceneMap[SET_CURRENT_SCENE] = _setCurrentScene;

const sceneReducer = (state = initialState, action) => {
  if (SceneMap[action.type]) {
    return SceneMap[action.type](state, action);
  } else {
    return { ...state };
  }
}

export default sceneReducer;
