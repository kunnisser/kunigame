/*
 * @Author: kunnisser
 * @Date: 2021-02-26 16:50:05
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-04-18 18:53:16
 * @FilePath: \kunigame\editor\api\request\project.ts
 * @Description: ---- project api ----
 */

import { getFetch, postFetch, deleteFetch } from '../index';
const PREFIX_API = 'project';
const generatePath = (PATH: string): string => `${PREFIX_API}/${PATH}`;
export const createNewProject = postFetch(generatePath('create'));
export const getProjectList = getFetch(generatePath('list'));
export const changeProject = postFetch(generatePath('change'));
export const editProject = postFetch(generatePath('edit'));
export const removeProject = deleteFetch(generatePath('remove'));
