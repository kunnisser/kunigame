/*
 * @Author: kunnisser
 * @Date: 2021-02-28 21:09:38
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-28 21:11:11
 * @FilePath: \kunigame\editor\api\request\test.ts
 * @Description: ---- 测试接口 ----
 */
import { getFetch } from '../index';
const PREFIX_API = 'test';
const generatePath = (PATH: string): string => `${PREFIX_API}/${PATH}`;
export const test = getFetch(generatePath('index'));
