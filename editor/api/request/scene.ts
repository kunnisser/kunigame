/*
 * @Author: kunnisser
 * @Date: 2021-02-26 09:14:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-06 14:39:51
 * @FilePath: /kunigame/editor/api/request/scene.ts
 * @Description: ---- scene api ----
 */

import { postFetch } from "../index";
const PREFIX_API = "scene";
const generatePath = (PATH: string): string => `${PREFIX_API}/${PATH}`;
const createScene = postFetch(generatePath("create"));
const updateScene = postFetch(generatePath("update"));

export { createScene, updateScene };
