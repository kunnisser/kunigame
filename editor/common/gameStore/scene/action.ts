/*
 * @Author: kunnisser
 * @Date: 2021-02-19 17:29:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-26 11:24:25
 * @FilePath: /kunigame/editor/common/gameStore/scene/action.ts
 * @Description: ---- 场景状态action ----
 */

import Game from "ts@/kuni/lib/core";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";

const GET_SCENE_LIST = Symbol();
const SET_CURRENT_SCENE = Symbol();
const GET_GAME = Symbol();
const GET_GAME_ITEM = Symbol();
const UPDATE_EDIT_GAME_ITEM = Symbol();
const CLEAR_EDIT_GAME_ITEM = Symbol();
const SET_DRAG_TARGET = Symbol();
const SET_OPERATION_TYPE = Symbol();

// 储存场景列表
const getSceneList = (list: Array<KnScene>) => {
  return {
    type: GET_SCENE_LIST,
    payload: list
  };
};

// 设置当前场景列表
const setCurrentScene = (scene: KnScene | null) => {
  return {
    type: SET_CURRENT_SCENE,
    payload: scene
  };
};

// 储存当前游戏实例
const getGame = (game: Game | null) => {
  return {
    type: GET_GAME,
    payload: game
  };
};

// 储存当前选中游戏对象实例
const getGameItem = (item: any) => {
  return {
    type: GET_GAME_ITEM,
    payload: item
  };
};

// 更新编辑选中的游戏对象实例
const updateEditGameItem = (gameItem: any) => {
  return {
    type: UPDATE_EDIT_GAME_ITEM,
    payload: gameItem
  };
};

// 清空选中的游戏对象
const clearEditGameItem = () => {
  return {
    type: CLEAR_EDIT_GAME_ITEM,
    payload: {}
  };
};

// 设置当前操作类型
const setCurrentOperationType = (type: string) => {
  return {
    type: SET_OPERATION_TYPE,
    payload: type
  };
};

// 设置拖动的对象
const setDragTarget = (target: any) => {
  return {
    type: SET_DRAG_TARGET,
    payload: target
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
  setCurrentOperationType
};
