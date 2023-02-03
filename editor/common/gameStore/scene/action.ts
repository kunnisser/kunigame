/*
 * @Author: kunnisser
 * @Date: 2021-02-19 17:29:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-03 16:57:47
 * @FilePath: /kunigame/editor/common/gameStore/scene/action.ts
 * @Description: ---- 场景状态action ----
 */

import Game from "ts@/kuni/lib/core";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";

const GET_SCENE_LIST = Symbol();
const SET_CURRENT_SCENE = Symbol();
const GET_GAME = Symbol();

const getSceneList = (list: Array<KnScene>) => {
  return {
    type: GET_SCENE_LIST,
    payload: list
  };
};

const setCurrentScene = (scene: KnScene | null) => {
  return {
    type: SET_CURRENT_SCENE,
    payload: scene
  };
};

const getGame = (game: Game | null) => {
  return {
    type: GET_GAME,
    payload: game
  };
};

export {
  GET_SCENE_LIST,
  getSceneList,
  SET_CURRENT_SCENE,
  setCurrentScene,
  GET_GAME,
  getGame
};
