/*
 * @Author: kunnisser
 * @Date: 2021-01-29 23:26:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-27 20:21:12
 * @FilePath: \kunigame\editor\api\index.ts
 * @Description: ---- 接口请求实例 ----
 */
import * as axios from 'axios';

// 判断是否进行代理
const prefixHost = 'http://localhost:8088/';
const idsFlag = ids => ids ? !0 : (ids === 0 ? !0 : !1);

const getFetch = (url: string) => (ids?: string | number, params?: any) => {
  return axios['get'](prefixHost + url + (idsFlag(ids) ? ('/' + ids) : ''), {
    params: params || {}
  });
};

const getFile = (url: string) => {
  return (param) => {
    return axios['get'](prefixHost + url, { params: param });
  }
}

const postFile = (url: string) => (params: any) => {
  return axios['post'](prefixHost + url, params);
};

const postFetch = (url: string) => (params: any) => {
  return axios['post'](prefixHost + url, params);
};

const deletFetch = (url: string) => {
  return (id: string | number) => axios['delete'](prefixHost + url + '/' + id);
}

const putFetch = (url: string) => (ids?: string | number, params?: any) => {
  return axios['put'](prefixHost + url + (idsFlag(ids) ? ('/' + ids) : ''), params);
}

export { getFetch, postFetch, deletFetch, putFetch, getFile, postFile };