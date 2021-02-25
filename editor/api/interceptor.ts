/*
 * @Author: kunnisser 
 * @Date: 2019-09-11 13:29:45 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-03 15:40:40
 */

/*
* axios拦截器定义
* */

import { message } from 'antd';
import axios from 'axios';
import CODES from "./code";
import { navigate } from '@reach/router';

// 定义对象接口
interface CancelPending {
  [propName: string]: Function
}

let cancelPending: CancelPending = {};
const CancelToken: any = axios['CancelToken'];
// const TIMEOUT: number = 5000;

axios.defaults.withCredentials = true;
// axios.defaults.timeout =  TIMEOUT;

const removePending: any = (currentKey: string) => {
  if (cancelPending[currentKey]) {
    cancelPending[currentKey]();
    cancelPending = {};
  }
}

const initialAxios: any = () => {

  // http请求拦截器
  axios['interceptors'].request.use((config: any) => {
    const currentKey = config.url + `&${config.method}`;

    // 判断重复请求，并取消之前接口请求
    removePending(currentKey);
    config.cancelToken = new CancelToken((cancel: Function) => {
      cancelPending = { [`${currentKey}`]: cancel };
    });

    if (config.method === 'post') {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  }, error => {
    message['warning'](error.message);
    return Promise.reject(error);
  });

  // http响应拦截器
  axios['interceptors'].response.use((response: any) => {
    const { data: resultData = {} } = response;
    // TODO 设置token过期失效相关处理
    if (resultData.code === '4002') {
    }

    if (resultData.code === '4001') {
      navigate("/admin/login");
    }
    
    // TODO 其他异常响应，例如权限不足
    
    // 获取到正常数据并返回
    if (CODES['SUCCESS'].indexOf(resultData.code) > -1) {
      resultData.status = 'success';
      resultData.msg && message.success(resultData.msg, 1);
      response['ok'] = true;
      return Promise.resolve(response);
    } else {
      resultData.msg && message['warning'](resultData.msg, 1);
      // 状态码异常
      return Promise.resolve(response);
    }
  }, error => {
    const errStatus = error.response ? error.response.status : '';
    error.message && message['warning'](CODES[errStatus] || error.message);
    if (errStatus && (errStatus === 503 || errStatus === 500)) {
      navigate("/admin/login");
    }
    return Promise.reject(error.message || error);
  });
};

export default initialAxios;