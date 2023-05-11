/*
 * @Author: kunnisser
 * @Date: 2021-01-29 23:26:35
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-10 15:19:07
 * @FilePath: /kunigame/editor/api/index.ts
 * @Description: ---- 接口请求实例 ----
 */
import * as axios from "axios";

// 判断是否进行代理
const prefixHost = "http://localhost:8086/";
const idsFlag = (ids) => (ids ? !0 : ids === 0 ? !0 : !1);

const getFetch = (url: string) => (ids?: string | number, params?: any) => {
  return axios["get"](prefixHost + url + (idsFlag(ids) ? "/" + ids : ""), {
    params: params || {}
  });
};

const getFile = (url: string) => {
  return (param) => {
    return axios["get"](prefixHost + url, { params: param });
  };
};

const postFile = (url: string) => (params: any) => {
  return axios["post"](prefixHost + url, params);
};

const postFetch = (url: string) => (params: any) => {
  return axios["post"](prefixHost + url, params);
};

const deleteFetch = (url: string) => {
  return (param: any) =>
    axios["delete"](prefixHost + url, {
      data: param
    });
};

const putFetch = (url: string) => (ids?: string | number, params?: any) => {
  return axios["put"](
    prefixHost + url + (idsFlag(ids) ? "/" + ids : ""),
    params
  );
};

export { getFetch, postFetch, deleteFetch, putFetch, getFile, postFile };
