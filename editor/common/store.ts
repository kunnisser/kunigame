/*
 * @Author: kunnisser
 * @Date: 2021-01-25 21:41:28
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-22 14:34:00
 * @FilePath: /kunigame/editor/common/store.ts
 * @Description: ---- 公共状态集合 ----
 */

import { combineReducers } from 'redux';
import sceneReducer from 'editor@/common/gameStore/scene/reducer';
export interface CombineReducer {
  sceneReducer: any,
}
const Combines = combineReducers({
  sceneReducer
} as CombineReducer);

export default Combines;
