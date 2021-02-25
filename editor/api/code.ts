/*
 * @Author: kunnisser 
 * @Date: 2019-09-11 13:29:25 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-01 14:02:04
 */

/*
*  -- response code --
**/

const CODES: object = {
  'SUCCESS': ['2000', 304, 200, 0, '200'],
  'BAD_REQUEST': ['4001', '4008', '4009', '4010'],
  '408': '请求超时！',
  '404': '当前接口不存在！',
  '503': '服务暂时不可用！',
  '500': '服务未启动'
};

export default CODES;