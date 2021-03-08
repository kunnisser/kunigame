/*
 * @Author: kunnisser
 * @Date: 2021-02-26 09:14:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-03-06 20:51:44
 * @FilePath: \kunigame\editor\api\request\scene.ts
 * @Description: ---- scene api ----
 */

import { postFetch } from '../index';
const PREFIX_API = 'scene';
const generatePath = (PATH: string): string => `${PREFIX_API}/${PATH}`;
export const createScene = postFetch(generatePath('create'));