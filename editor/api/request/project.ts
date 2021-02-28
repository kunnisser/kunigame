/*
 * @Author: kunnisser
 * @Date: 2021-02-26 16:50:05
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-28 21:20:29
 * @FilePath: \kunigame\editor\api\request\project.ts
 * @Description: ---- project api ----
 */

import { postFetch } from '../index';
const PREFIX_API = 'project';
const generatePath = (PATH: string): string => `${PREFIX_API}/${PATH}`;
export const createNewProject = postFetch(generatePath('create'));