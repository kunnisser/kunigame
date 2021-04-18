/*
 * @Author: kunnisser
 * @Date: 2021-04-18 17:26:19
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-04-18 17:43:46
 * @FilePath: \kunigame\editor\storage\index.ts
 * @Description: ---- 定义LocalStorage ----
 */

const getCurrentProject = (): string => {
  if (localStorage.getItem('currentProject')) {
    return localStorage.getItem('currentProject') || '';
  } else {
    localStorage.setItem('currentProject', 'kuni');
    return 'kuni';
  }
};

const setCurrentProject = (str: string): void => {
  localStorage.setItem('currentProject', str);
};

const removeCurrentProject = (): void => {
  localStorage.setItem('currentProject', 'kuni');
};

export { getCurrentProject, setCurrentProject, removeCurrentProject };
