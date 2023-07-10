/*
 * @Author: kunnisser
 * @Date: 2021-02-22 09:21:27
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-10 23:19:46
 * @FilePath: \kunigame\editor\common\gameStore\scene\reducer.ts
 * @Description: ---- 操作scene状态 ----
 */
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import {
  CLEAR_EDIT_GAME_ITEM,
  GET_GAME,
  GET_GAME_ITEM,
  GET_SCENE_LIST,
  SET_CURRENT_SCENE,
  SET_DRAG_TARGET,
  SET_OPERATION_TYPE,
  UPDATE_EDIT_GAME_ITEM,
  SET_RESUME_ACTION_STACK,
  SET_CANCEL_ACTION_STACK,
  SET_PARTICLE_GAME_ITEM,
  SET_DEFAULT_TWEEN,
  SET_SCALE_TWEEN,
  SET_TWEEN_VARS,
  SET_SCALE_TWEEN_VARS,
} from './action';
import Game from 'ts@/kuni/lib/core';

export interface SceneState {
  scene: Array<KnScene>;
  currentScene: KnScene | null;
  game: Game | null;
  gameItem: any; // 当前编辑对象
  defaultTween; // tween实例
  scaleTween; // scaleTween实例
  tweenVars: any; // 当前绑定缓动动画的配置
  scaleTweenVars: any; // 当前绑定缩放动画的配置
  particleGameItem: any; // 当前绑定粒子动画的对象
  editGameItem: any; // 编辑游戏对象信息
  dragTarget: any; // 拖拽对象
  operationType: string; // 操作类型
  resumeActionStack: Array<any>; // 撤销操作栈
  cancelActionStack: Array<any>; // 还原操作栈
}

const initialState: SceneState = {
  scene: [],
  currentScene: null,
  game: null,
  gameItem: null,
  tweenVars: null,
  scaleTweenVars: null,
  defaultTween: null,
  scaleTween: null,
  particleGameItem: null,
  editGameItem: {},
  dragTarget: null,
  operationType: 'pick',
  resumeActionStack: [],
  cancelActionStack: [],
};

const _getSceneList = (state: SceneState, action) => {
  return {
    ...state,
    scene: action.payload,
  };
};

const _setCurrentScene = (state: SceneState, action) => {
  return {
    ...state,
    currentScene: action.payload,
  };
};

const _getGame = (state: SceneState, action) => {
  return {
    ...state,
    game: action.payload,
  };
};

const _getGameItem = (state: SceneState, action) => {
  console.log(action.payload);
  return {
    ...state,
    gameItem: action.payload,
  };
};

const _updateEditGameItem = (state: SceneState, action) => {
  return {
    ...state,
    editGameItem: action.payload,
  };
};

const _clearEditGameItem = (state: SceneState, action) => {
  return {
    ...state,
    editGameItem: action.payload,
  };
};

const _setDragTarget = (state: SceneState, action) => {
  return {
    ...state,
    dragTarget: action.payload,
  };
};

const _setOperationType = (state: SceneState, action) => {
  return {
    ...state,
    operationType: action.payload,
  };
};

const _setCancelActionStack = (state: SceneState, action) => {
  return {
    ...state,
    cancelActionStack: action.payload,
  };
};

const _setResumeActionStack = (state: SceneState, action) => {
  return {
    ...state,
    resumeActionStack: action.payload,
  };
};

const _setDefaultTween = (state: SceneState, action) => {
  return {
    ...state,
    defaultTween: action.payload,
  };
};

const _setScaleTween = (state: SceneState, action) => {
  return {
    ...state,
    scaleTween: action.payload,
  };
};

const _setTweenVars = (state: SceneState, action) => {
  return {
    ...state,
    tweenVars: action.payload,
  };
};

const _setScaleTweenVars = (state: SceneState, action) => {
  return {
    ...state,
    scaleTweenVars: action.payload,
  };
};

const _setParticleGameItem = (state: SceneState, action) => {
  return {
    ...state,
    particleGameItem: action.payload,
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
SceneMap[SET_OPERATION_TYPE] = _setOperationType;
SceneMap[SET_CANCEL_ACTION_STACK] = _setCancelActionStack;
SceneMap[SET_RESUME_ACTION_STACK] = _setResumeActionStack;
// tween
SceneMap[SET_DEFAULT_TWEEN] = _setDefaultTween;
SceneMap[SET_SCALE_TWEEN] = _setScaleTween;
SceneMap[SET_TWEEN_VARS] = _setTweenVars;
SceneMap[SET_SCALE_TWEEN_VARS] = _setScaleTweenVars;
// particle
SceneMap[SET_PARTICLE_GAME_ITEM] = _setParticleGameItem;

const sceneReducer = (state = initialState, action) => {
  if (SceneMap[action.type]) {
    return SceneMap[action.type](state, action);
  } else {
    return { ...state };
  }
};

export default sceneReducer;
