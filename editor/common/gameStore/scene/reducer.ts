/*
 * @Author: kunnisser
 * @Date: 2021-02-22 09:21:27
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-20 11:10:05
 * @FilePath: /kunigame/editor/common/gameStore/scene/reducer.ts
 * @Description: ---- 操作scene状态 ----
 */
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import {
  CLEAR_EDIT_GAME_ITEM,
  GET_GAME,
  GET_GAME_ITEM,
  GET_SCENE_LIST,
  SET_CURRENT_SCENE,
  SET_DRAG_TARGET,
  UPDATE_EDIT_GAME_ITEM
} from "./action";
import Game from "ts@/kuni/lib/core";

export interface SceneState {
  scene: Array<KnScene>;
  currentScene: KnScene | null;
  game: Game | null;
  gameItem: any; // 当前编辑对象
  editGameItem: any; // 编辑游戏对象信息
  dragTarget: any; // 拖拽对象
}

const initialState: SceneState = {
  scene: [],
  currentScene: null,
  game: null,
  gameItem: null,
  editGameItem: {},
  dragTarget: null
};

const _getSceneList = (state: SceneState, action) => {
  return {
    ...state,
    scene: action.payload
  };
};

const _setCurrentScene = (state: SceneState, action) => {
  return {
    ...state,
    currentScene: action.payload
  };
};

const _getGame = (state: SceneState, action) => {
  return {
    ...state,
    game: action.payload
  };
};

const _getGameItem = (state: SceneState, action) => {
  return {
    ...state,
    gameItem: action.payload
  };
};

const _updateEditGameItem = (state: SceneState, action) => {
  return {
    ...state,
    editGameItem: action.payload
  };
};

const _clearEditGameItem = (state: SceneState, action) => {
  return {
    ...state,
    editGameItem: action.payload
  };
};

const _setDragTarget = (state: SceneState, action) => {
  return {
    ...state,
    dragTarget: action.payload
  };
};

const SceneMap = {};
SceneMap[GET_SCENE_LIST] = _getSceneList;
SceneMap[SET_CURRENT_SCENE] = _setCurrentScene;
SceneMap[GET_GAME] = _getGame;
SceneMap[GET_GAME_ITEM] = _getGameItem;
SceneMap[UPDATE_EDIT_GAME_ITEM] = _updateEditGameItem;
SceneMap[CLEAR_EDIT_GAME_ITEM] = _clearEditGameItem;
SceneMap[SET_DRAG_TARGET] = _setDragTarget;

const sceneReducer = (state = initialState, action) => {
  if (SceneMap[action.type]) {
    return SceneMap[action.type](state, action);
  } else {
    return { ...state };
  }
};

export default sceneReducer;
