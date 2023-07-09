/*
 * @Author: kunnisser
 * @Date: 2021-02-19 17:29:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-08 00:37:59
 * @FilePath: \kunigame\editor\common\gameStore\scene\action.ts
 * @Description: ---- 场景状态action ----
 */

import Game from 'ts@/kuni/lib/core';
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';

const GET_SCENE_LIST = Symbol();
const SET_CURRENT_SCENE = Symbol();
const GET_GAME = Symbol();
const GET_GAME_ITEM = Symbol();
const UPDATE_EDIT_GAME_ITEM = Symbol();
const CLEAR_EDIT_GAME_ITEM = Symbol();
const SET_DRAG_TARGET = Symbol();
const SET_OPERATION_TYPE = Symbol();
const SET_CANCEL_ACTION_STACK = Symbol();
const SET_RESUME_ACTION_STACK = Symbol();
const SET_DEFAULT_TWEEN = Symbol();
const SET_TWEEN_GAME_ITEM = Symbol();
const SET_PARTICLE_GAME_ITEM = Symbol();
// 储存场景列表
const getSceneList = (list: Array<KnScene>) => {
  return {
    type: GET_SCENE_LIST,
    payload: list,
  };
};

// 设置当前场景列表
const setCurrentScene = (scene: KnScene | null) => {
  return {
    type: SET_CURRENT_SCENE,
    payload: scene,
  };
};

// 储存当前游戏实例
const getGame = (game: Game | null) => {
  return {
    type: GET_GAME,
    payload: game,
  };
};

// 储存当前选中游戏对象实例
// item 传数组
const getGameItem = (item: Array<any> | null) => {
  return {
    type: GET_GAME_ITEM,
    payload: item,
  };
};

// 更新编辑选中的游戏对象实例
const updateEditGameItem = (gameItem: any) => {
  console.log(gameItem);
  return {
    type: UPDATE_EDIT_GAME_ITEM,
    payload: gameItem,
  };
};

// 清空选中的游戏对象
const clearEditGameItem = () => {
  return {
    type: CLEAR_EDIT_GAME_ITEM,
    payload: {},
  };
};

// 设置当前操作类型
const setCurrentOperationType = (type: string) => {
  return {
    type: SET_OPERATION_TYPE,
    payload: type,
  };
};

// 设置拖动的对象
const setDragTarget = (target: any) => {
  return {
    type: SET_DRAG_TARGET,
    payload: target,
  };
};

// 设置撤销操作栈
const setCancelActionStack = (stack) => {
  return {
    type: SET_CANCEL_ACTION_STACK,
    payload: stack,
  };
};

const setResumeActionStack = (stack) => {
  return {
    type: SET_RESUME_ACTION_STACK,
    payload: stack,
  };
};

// 设置tween配置
const setTweenGameItem = (targets) => {
  return {
    type: SET_TWEEN_GAME_ITEM,
    payload: targets,
  };
};

// 设置默认tween实例
const setDefaultTween = (tween) => {
  return {
    type: SET_DEFAULT_TWEEN,
    payload: tween,
  };
};

// 设置粒子对象
const setParticleGameItem = (target) => {
  return {
    type: SET_PARTICLE_GAME_ITEM,
    payload: target,
  };
};

export {
  GET_SCENE_LIST,
  getSceneList,
  SET_CURRENT_SCENE,
  setCurrentScene,
  GET_GAME,
  getGame,
  GET_GAME_ITEM,
  getGameItem,
  UPDATE_EDIT_GAME_ITEM,
  updateEditGameItem,
  CLEAR_EDIT_GAME_ITEM,
  clearEditGameItem,
  SET_DRAG_TARGET,
  setDragTarget,
  SET_OPERATION_TYPE,
  setCurrentOperationType,
  setCancelActionStack,
  setResumeActionStack,
  SET_CANCEL_ACTION_STACK,
  SET_RESUME_ACTION_STACK,
  setTweenGameItem,
  SET_TWEEN_GAME_ITEM,
  setParticleGameItem,
  SET_PARTICLE_GAME_ITEM,
  SET_DEFAULT_TWEEN,
  setDefaultTween,
};
